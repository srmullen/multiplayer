const path = require("path");
const express =  require("express");
const http = require("http");
const socket = require("socket.io");
const Person = require("./entities/Person");

const app = express();
const server = http.createServer(app);
const io = socket(server);

app.use(express.static(__dirname + '/dist'));
app.get("*", (req, res) => {
    res.sendFile(__dirname + "/dist/index.html");
});

const PORT = 4200;
server.listen(4200, () => {
    console.log(`Server started on port 4200.`);
});

io.on("connection", (client) => {
    client.on("create-room", (name, fn) => {
        const roomID = generateID();
        client.join(roomID, () => {
            client.emit("roomCreated", {roomID, name});
        });
        fn({roomID, name});
    });

    client.on("join-room", (data, fn) => {
        client.join(data.roomID, () => {
            client.emit("roomJoined", data);
            io.to(data.roomID).emit("room-entered", data.name);
        });
        fn(data);
    });

    client.on("leave-room", (data, fn) => {
        client.leave(data.roomID, () => {
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
