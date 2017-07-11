import ReactDOM from "react-dom";
import React from "react";
import io from "socket.io-client";

var socket = io.connect('http://127.0.0.1:4200');
socket.on("connect", (data) => {
    socket.emit("join", "Hello world from client");
});
socket.on("broad", (data) => {
    $("#future").append(data + "<br />");
});

class ChatForm extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            chatInput: "",
            messages: []
        }
    }

    render () {
        return (
            <div>
                <h1>Chat!</h1>
                <div id="future"></div>
                <form id="chat_form">
                    <input type="text" value={this.state.chatInput} onChange={e => {
                        this.setState({chatInput: e.target.value});
                    }} />
                    <input type="button" value="Send" onClick={e => {
                        var message = e.target.value;
                        socket.emit("messages", message);
                        this.setState({chatInput: ""});
                    }} />
                </form>
            </div>
        );
    }
};

ReactDOM.render(<ChatForm />, document.getElementById("root"));
