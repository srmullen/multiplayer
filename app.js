const uuid = require("uuid/v1");
const path = require("path");
const express =  require("express");
const bodyParser = require("body-parser");
const http = require("http");
const expressSession = require("express-session");
const socketSession = require("express-socket.io-session");
const socket = require("socket.io");

const Person = require("./entities/Person");
const Room = require("./entities/Room");

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

// Temporary store for room info.
const rooms = {};

// Errors
const ROOM_DOES_NOT_EXIST = "Room does not exist";

io.on("connection", (client) => {
    client.on("get-self", (data, fn) => {
        fn(client.handshake.session.self);
    });

    client.on("get-room", (roomID, fn) => {
        const room = rooms[roomID];
        if (room) {
            fn({room});
        } else {
            fn({error: ROOM_DOES_NOT_EXIST});
        }
    });

    client.on("create-room", (name, fn) => {
        const room = Room.of();
        client.join(room.id);
        rooms[room.id] = room;
        fn({roomID: room.id, name});
    });

    client.on("join-room", (data, fn) => {
        client.handshake.session.self = data.self;
        const room = rooms[data.roomID];
        if (room) {
            client.join(data.roomID, () => {
                io.to(data.roomID).emit("room-entered", data.self);
                rooms[data.roomID].attendees.push(data.self);
                fn({room});
            });
        } else {
            fn({error: ROOM_DOES_NOT_EXIST});
        }
    });

    client.on("leave-room", (data, fn) => {
        client.leave(data.roomID, () => {
            io.to(data.roomID).emit("room-left", data.self);
            fn();
        });
    });

    client.on("messages", (data) => {
        io.to(data.roomID).emit("broad", data);
    });

});
