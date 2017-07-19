import "./styles/styles.css";
import ReactDOM from "react-dom";
import React, {Component} from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";
import io from "socket.io-client";

import Login from "./Login";
import ChatRoom from "./ChatRoom";

var socket = io.connect('http://127.0.0.1:4200');
socket.on("connect", (data) => {
    socket.emit("join", "Hello world from client");
});

class Main extends Component {
    constructor (props) {
        super(props);
        this.state = {
            roomID: null,
            name: "",
            attendees: []
        };

        socket.on("room-entered", (name) => {
            this.setState({attendees: this.state.attendees.concat({name})});
        });
    }

    render () {
        return (
            <Router>
                <div>
                    <Route exact path="/" component={({history}) => {
                        return (
                            <Login
                                joinRoom={(roomID, name) => {
                                    this.setState({name}, () => {
                                        socket.emit("join-room", {roomID, name}, (data) => {
                                            history.push("/" + data.roomID);
                                        });
                                    });
                                }}
                                createRoom={(name) => {
                                    const attendees = this.state.attendees.concat({name});
                                    this.setState({name, attendees}, () => {
                                        socket.emit("create-room", name, (data) => {
                                            history.push("/" + data.roomID);
                                        });
                                    })
                                }}
                            />
                        );
                    }} />
                    <Route path="/:roomID" component={({match}) => {
                        return (
                            <ChatRoom
                                name={this.state.name}
                                roomID={match.params.roomID}
                                socket={socket}
                                attendees={this.state.attendees}
                            />
                        );
                    }} />
                </div>
            </Router>
        );
    }
}

ReactDOM.render(<Main />, document.getElementById("root"));
