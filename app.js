const uuid = require("uuid/v1");
const path = require("path");
const express =  require("express");
const bodyParser = require("body-parser");
const http = require("http");
const expressSession = require("express-session");
const socketSession = require("express-socket.io-session");
const socket = require("socket.io");
const exitHook = require("exit-hook");
const {find, propEq} = require("ramda");

const Person = require("./entities/Person");
const Room = require("./entities/Room");
const redis = require("./db");
const {ROOM_EXPIRATION_TIME} = require("./constants");

const app = express();
const server = http.createServer(app);
const io = socket(server);

const session = expressSession({
    secret: "boopbeepboop",
    resave: true,
    saveUninitialized: true
});
app.use(session);
io.use(socketSession(session, {
    autoSave: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/dist'));
app.post("/login", (req, res) => {
    req.session.self = req.body;
    res.json({message: "Success"});
});
app.get("*", (req, res) => {
    res.sendFile(__dirname + "/dist/_index.html");
});

const PORT = process.env.PORT || 4200;
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}.`);
});

// Errors
const ROOM_DOES_NOT_EXIST = "Room does not exist";

io.on("connection", (client) => {
    client.on("reenter-room", (roomID, fn) => {
        if (client.handshake.session.self) {
            redis.multi()
                .get(`room:${roomID}`)
                .sismember(`attendees:${roomID}`, JSON.stringify(client.handshake.session.self), (err, val) => {})
                .smembers(`attendees:${roomID}`)
                .lrange(`messages:${roomID}`, -100, -1)
                .exec((err, [roomJSON, isInRoom, attendees, messages]) => {
                    if (err) {
                        console.log(err);
                    }

                    if (roomJSON && isInRoom) {
                        const self = client.handshake.session.self;
                        const room = JSON.parse(roomJSON);
                        room.attendees = attendees.map(JSON.parse);
                        room.messages = messages.map(JSON.parse);
                        client.join(roomID);
                        fn({room, self});
                    } else {
                        fn({error: ROOM_DOES_NOT_EXIST});
                    }
                });
        } else {
            fn({error: ROOM_DOES_NOT_EXIST});
        }
    });

    client.on("create-room", (name, fn) => {
        const room = Room.of();
        redis.set(`room:${room.id}`, JSON.stringify(room), "EX", ROOM_EXPIRATION_TIME);
        client.join(room.id);
        fn({roomID: room.id, name});
    });

    client.on("join-room", (data, fn) => {
        client.handshake.session.self = data.self;
        redis.get(`room:${data.roomID}`, (err, roomJSON) => {
            if (roomJSON) {
                client.join(data.roomID, () => {
                    const room = JSON.parse(roomJSON);
                    redis.multi()
                        .sadd(`attendees:${data.roomID}`, JSON.stringify(data.self))
                        .smembers(`attendees:${data.roomID}`)
                        .lrange(`messages:${data.roomID}`, -100, -1)
                        .expire(`attendees:${data.roomID}`, ROOM_EXPIRATION_TIME)
                        .expire(`room:${data.roomID}`, ROOM_EXPIRATION_TIME)
                        .expire(`messages:${data.roomID}`, ROOM_EXPIRATION_TIME)
                        .exec((err, [sadd, attendees, messages]) => {
                            if (err) {
                                console.error(err);
                                return;
                            }

                            io.to(data.roomID).emit("room-entered", data.self);
                            room.attendees = attendees.map(JSON.parse);
                            room.messages = messages.map(JSON.parse);
                            fn({room});
                        });
                });
            } else {
                fn({error: ROOM_DOES_NOT_EXIST});
            }
        });
    });

    client.on("leave-room", (data, fn) => {
        client.leave(data.roomID, () => {
            redis.srem(`attendees:${data.roomID}`, JSON.stringify(data.self), (err, wasRemoved) => {
                if (err) {
                    console.error(err);
                    return;
                }

                io.to(data.roomID).emit("room-left", data.self);
                fn();
            });
        });
    });

    client.on("messages", (data, fn) => {
        redis.multi()
            .get(`room:${data.roomID}`)
            .rpush(`messages:${data.roomID}`, JSON.stringify(data))
            .expire(`room:${data.roomID}`, ROOM_EXPIRATION_TIME)
            .expire(`messages:${data.roomID}`, ROOM_EXPIRATION_TIME)
            .exec((err, [roomJSON]) => {
                if (err) {
                    cosole.error(err);
                }

                if (roomJSON) {
                    io.to(data.roomID).emit("broad", data);
                } else {
                    fn({error: ROOM_DOES_NOT_EXIST})
                }
            });
    });
});

exitHook(function () {
    console.log("Shutting down!");
    redis.flushdb();
    redis.quit();
});
