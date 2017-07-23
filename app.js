const uuid = require("uuid/v1");
const path = require("path");
const express =  require("express");
const bodyParser = require("body-parser");
const http = require("http");
const expressSession = require("express-session");
const socketSession = require("express-socket.io-session");
const socket = require("socket.io");
const Person = require("./entities/Person");

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

io.on("connection", (client) => {
    client.on("get-self", (data, fn) => {
        fn(client.handshake.session.self);
    });

    client.on("create-room", (name, fn) => {
        const roomID = generateID();
        client.join(roomID);
        fn({roomID, name});
    });

    client.on("join-room", (data, fn) => {
        client.handshake.session.self = data.self;
        client.join(data.roomID, () => {
            io.to(data.roomID).emit("room-entered", data.self);
        });
        fn(data);
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

function generateID () {
    return Math.random().toString(36).substr(2, 9);
}
