const path = require("path");
const express =  require("express");
const http = require("http");
const socket = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socket(server);

app.use(express.static(__dirname + '/dist'));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/dist/index.html");
});

const PORT = 4200;
server.listen(4200, () => {
    console.log(`Server started on port 4200.`);
});

io.on("connection", (client) => {
    client.on("join", (data) => {
        console.log(data);
    });

    client.on("create-room", () => {
        const roomID = generateID();
        client.join(roomID, () => {
            const rooms = Object.keys(client.rooms);
            client.emit("roomCreated", roomID);
        });
    });

    client.on("join-room", (data) => {
        client.join(data.roomID, () => {
            client.emit("roomJoined", data.roomID);
            io.to(data.roomID).emit("room-entered", data.name + " has joined the room");
        });
    });

    client.on("messages", (data) => {
        console.log("messages");
        client.broadcast.emit("broad", data);
    });
});

function generateID () {
    return Math.random().toString(36).substr(2, 9);
}
