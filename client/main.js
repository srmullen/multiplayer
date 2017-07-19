import "./styles/styles.css";
import ReactDOM from "react-dom";
import React, {Component} from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";
import io from "socket.io-client";

import Login from "./Login";
import ChatRoom from "./ChatRoom";
import Person from "../entities/Person";

var socket = io.connect('http://127.0.0.1:4200');
socket.on("connect", () => {
    console.log("Connected to Socket");
});

class Main extends Component {
    constructor (props) {
        super(props);
        this.state = {
            roomID: null,
            self: null,
            attendees: []
        };

        socket.on("room-entered", (name) => {
            this.setState({attendees: this.state.attendees.concat(Person.of({name}))});
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
                                    const self = Person.of({name});
                                    this.setState({self}, () => {
                                        socket.emit("join-room", {roomID, name}, (data) => {
                                            history.push("/" + data.roomID);
                                        });
                                    });
                                }}
                                createRoom={(name) => {
                                    const attendees = this.state.attendees.concat(Person.of({name}));
                                    this.setState({self: Person.of({name}), attendees}, () => {
                                        socket.emit("create-room", name, (data) => {
                                            history.push("/" + data.roomID);
                                        });
                                    })
                                }}
                            />
                        );
                    }} />
                    <Route path="/:roomID" component={({match, history}) => {
                        return (
                            <ChatRoom
                                self={this.state.self}
                                roomID={match.params.roomID}
                                socket={socket}
                                attendees={this.state.attendees}
                                leaveRoom={() => {
                                    socket.emit("leave-room", {self: this.state.self, roomID: this.state.roomID}, () => {
                                        history.push("/");
                                        this.setState({
                                            roomID: null,
                                            self: null,
                                            attendees: []
                                        });
                                    });
                                }}
                            />
                        );
                    }} />
                </div>
            </Router>
        );
    }
}

ReactDOM.render(<Main />, document.getElementById("root"));
