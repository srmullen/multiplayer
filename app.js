const uuid = require("uuid/v1");
const path = require("path");
const express =  require("express");
const bodyParser = require("body-parser");
const http = require("http");
const expressSession = require("express-session");
const socketSession = require("express-socket.io-session");
const socket = require("socket.io");
const redisClient = require("redis");
const exitHook = require("exit-hook");

const Person = require("./entities/Person");
const Room = require("./entities/Room");

const redis = redisClient.createClient();
redis.on("error", (err) => {
    console.error(err);
});

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

const PORT = 4200;
server.listen(4200, () => {
    console.log(`Server started on port 4200.`);
});

// Errors
const ROOM_DOES_NOT_EXIST = "Room does not exist";

io.on("connection", (client) => {
    client.on("get-self", (data, fn) => {
        fn(client.handshake.session.self);
    });

    client.on("get-room", (roomID, fn) => {
        redis.hget("rooms", roomID, (err, roomJSON) => {
            if (err) {
                console.log(err);
            }

            if (roomJSON) {
                const room = JSON.parse(roomJSON);
                fn({room});
            } else {
                fn({error: ROOM_DOES_NOT_EXIST});
            }
        });
    });

    client.on("create-room", (name, fn) => {
        const room = Room.of();
        redis.hset("rooms", room.id, JSON.stringify(room));
        client.join(room.id);
        fn({roomID: room.id, name});
    });

    client.on("join-room", (data, fn) => {
        client.handshake.session.self = data.self;
        redis.hget("rooms", data.roomID, (err, roomJSON) => {
            if (roomJSON) {
                client.join(data.roomID, () => {
                    const room = JSON.parse(roomJSON);
                    room.attendees.push(data.self)
                    redis.hset("rooms", data.roomID, JSON.stringify(room));
                    io.to(data.roomID).emit("room-entered", data.self);
                    fn({room});
                });
            } else {
                fn({error: ROOM_DOES_NOT_EXIST});
            }
        });
    });

    client.on("leave-room", (data, fn) => {
        client.leave(data.roomID, () => {
            redis.hget("rooms", data.roomID, (err, roomJSON) => {
                if (roomJSON) {
                    const room = JSON.parse(roomJSON);
                    redis.hset("rooms", data.roomID, JSON.stringify(Room.leave(room, data.self)));
                }
                io.to(data.roomID).emit("room-left", data.self);
                fn();
            });
        });
    });

    client.on("messages", (data, fn) => {
        redis.hget("rooms", data.roomID, (err, roomJSON) => {
            if (roomJSON) {
                const room = JSON.parse(roomJSON);
                room.messages.push(data);
                redis.hset("rooms", data.roomID, JSON.stringify(room));
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
