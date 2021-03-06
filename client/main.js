import "tachyons";
import "./styles/styles.css";
import ReactDOM from "react-dom";
import React, {Component} from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";
import R from "ramda";
import io from "socket.io-client";
import $ from "jquery";

import Login from "components/Login";
import ChatRoom from "components/ChatRoom";
import AttendeeListToggle from "components/AttendeeListToggle";
import Person from "entities/Person";
import Room from "entities/Room";

const socket = io();
socket.on("connect", (me) => {
    console.log("Socket connected");
});

class Main extends Component {
    constructor (props) {
        super(props);
        this.state = {
            room: null,
            self: null,
        };

        socket.on("broad", (data) => {
            const messages = this.state.room.messages.concat(data);
            this.setState({room: Room.of(Object.assign({}, this.state.room, {messages}))});
        });

        socket.on("room-entered", (person) => {
            if (this.state.room) {
                this.setState(previous => {
                    const room = Room.enter(previous.room, Person.of(person));
                    return {room};
                });
            }
        });

        socket.on("room-left", (person) => {
            if (this.state.room) {
                this.setState(previous => {
                    const room = Room.leave(previous.room, Person.of(person));
                    return {room};
                });
            }
        });
    }

    componentDidMount () {
        const roomID = window.location.pathname.slice(1);
        if (roomID) {
            socket.emit("reenter-room", roomID, (data) => {
                if (data.error) {
                    console.log(data.error);
                    window.location.replace("/");
                } else {
                    this.setState({
                        room: Room.of(data.room),
                        self: Person.of(data.self)
                    });
                }
            });
        }
    }

    render () {
        return (
            <Router>
                <div>
                    <Route exact path="/" component={({history}) => {
                        return (
                            <div>
                                <header className="bg-black-80">
                                    <div className="dib white pa2 f3">Chat</div>
                                </header>
                                <Login
                                    joinRoom={(roomID, name) => {
                                        this.joinRoom(roomID, name).then(({room, self}) => {
                                            this.setState({
                                                self,
                                                room
                                            }, () => {
                                                history.push("/" + room.id);
                                            });
                                        }).catch(e => {
                                            console.error(e);
                                        });
                                    }}
                                    createRoom={(name) => {
                                        socket.emit("create-room", name, (data) => {
                                            this.joinRoom(data.roomID, name).then(({room, self}) => {
                                                this.setState({
                                                    self,
                                                    room
                                                }, () => {
                                                    history.push("/" + room.id);
                                                });
                                            }).catch(e => {
                                                console.error(e);
                                            });
                                        });
                                    }}
                                />
                            </div>
                        );
                    }} />
                    <Route path="/:roomID" component={({match, history}) => {
                        return (
                            <div>
                                <header className="bg-black-80">
                                    <div className="dib white pa2 f3">Chat</div>
                                    <button
                                        className="input-reset dib w2 h2 pa1 white ba b--white-90 border-box bg-transparent hover-bg-white hover--black">
                                        <AttendeeListToggle />
                                    </button>
                                </header>
                                <ChatRoom
                                    self={this.state.self}
                                    roomID={match.params.roomID}
                                    socket={socket}
                                    room={this.state.room}
                                    history={history}
                                    leaveRoom={() => {
                                        socket.emit("leave-room", {self: this.state.self, roomID: match.params.roomID}, () => {
                                            history.push("/");
                                            this.setState({
                                                room: null,
                                                self: null,
                                            });
                                        });
                                    }}
                                    destroyRoom={() => {
                                        socket.emit("destroy-room", {roomID: this.state.room.id}, () => {
                                            history.push("/");
                                            this.setState((previous) => ({
                                                room: Room.destroy(previous.room),
                                                self: null
                                            }));
                                        });
                                    }}
                                />
                            </div>
                        );
                    }} />
                </div>
            </Router>
        );
    }

    joinRoom (roomID, name) {
        const self = Person.of({name: name ? name : undefined});
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "/login",
                method: "POST",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({...self}),
                success: () => {
                    socket.emit("join-room", {roomID, self}, ({room, error}) => {
                        if (error) {
                            return reject(error);
                        } else {
                            return resolve({room: Room.of(room), self});
                        }
                    });
                },
                error: (err) => {
                    reject(err);
                }
            });
        });
    }
}

ReactDOM.render(<Main />, document.getElementById("root"));
