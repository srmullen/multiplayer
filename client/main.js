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
            name: ""
        }
    }

    render () {
        if (this.state.roomID) {
            return (
                <ChatRoom name={this.state.name} roomID={this.state.roomID} />
            )
        } else {
            return (
                <Login
                    joinRoom={(roomID, name) => {
                        this.setState({roomID, name});
                    }}
                    createRoom={() => {
                        
                    }}
                />
            );
        }
    }
}

ReactDOM.render(<Main />, document.getElementById("root"));
