import "./styles/styles.css";
import ReactDOM from "react-dom";
import React, {Component} from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";
import R from "ramda";
import io from "socket.io-client";

import Login from "./Login";
import ChatRoom from "./ChatRoom";
import Person from "../entities/Person";

var socket = io.connect('http://127.0.0.1:4200');
socket.on("connect", () => {
    console.log("Connected to Socket");
});

window.R = R;

class Main extends Component {
    constructor (props) {
        super(props);
        this.state = {
            roomID: null,
            self: null,
            attendees: []
        };

        socket.on("room-entered", (person) => {
            this.setState({attendees: this.state.attendees.concat(Person.of(person))});
        });

        socket.on("room-left", (person) => {
            this.setState(previous => {
                return {attendees: R.reject(attendee => attendee.id === person.id, previous.attendees)};
            });
        });
    }

    componentDidMount () {
        console.log("mounted");
    }

    render () {
        return (
            <Router>
                <div>
                    <Route exact path="/" component={({history}) => {
                        return (
                            <Login
                                joinRoom={(roomID, name) => {
                                    this.joinRoom(roomID, name, history);
                                }}
                                createRoom={(name) => {
                                    const attendees = this.state.attendees.concat(Person.of({name}));
                                    socket.emit("create-room", name, (data) => {
                                        this.joinRoom(data.roomID, name, history);
                                    });
                                }}
                            />
                        );
                    }} />
                    <Route path="/:roomID" component={({match, history}) => {
                        const self = this.state.self;
                        const attendees = this.state.attendees;
                        return (
                            <ChatRoom
                                self={self}
                                roomID={match.params.roomID}
                                socket={socket}
                                attendees={attendees}
                                leaveRoom={() => {
                                    socket.emit("leave-room", {self: self, roomID: match.params.roomID}, () => {
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

    joinRoom (roomID, name, history) {
        const self = Person.of({name});
        this.setState({self}, () => {
            socket.emit("join-room", {roomID, self}, (data) => {
                history.push("/" + data.roomID);
            });
        });
    }
}

ReactDOM.render(<Main />, document.getElementById("root"));
