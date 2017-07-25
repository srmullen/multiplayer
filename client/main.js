import "./styles/styles.css";
import ReactDOM from "react-dom";
import React, {Component} from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";
import R from "ramda";
import io from "socket.io-client";
import $ from "jquery";

import Login from "./Login";
import ChatRoom from "./ChatRoom";
import Person from "../entities/Person";

// const socket = io.connect('http://127.0.0.1:4200');
const socket = io();
socket.on("connect", (me) => {
    console.log("Socket connected");
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
        socket.emit("get-self", {}, (self) => {
            console.log(self);
            if (self) {
                this.setState({self: Person.of(self)});
            }
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
                                    this.joinRoom(roomID, name).then(roomID => {
                                        history.push("/" + roomID);
                                    }).catch(e => {
                                        console.log(e);
                                    });
                                }}
                                createRoom={(name) => {
                                    const attendees = this.state.attendees.concat(Person.of({name}));
                                    socket.emit("create-room", name, (data) => {
                                        this.joinRoom(data.roomID, name).then(roomID => {
                                            history.push("/" + roomID);
                                        }).catch(e => {
                                            console.log(e);
                                        });
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

    joinRoom (roomID, name) {
        const self = Person.of({name});
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "/login",
                method: "POST",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({...self}),
                success: () => {
                    this.setState({self}, () => {
                        socket.emit("join-room", {roomID, self}, (data) => {
                            return resolve(data.roomID);
                        });
                    });
                },
                error: (err) => {
                    reject(err);
                }
            });
        });
    }
}

ReactDOM.render(<Main self={self} />, document.getElementById("root"));
