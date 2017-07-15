import React, {Component} from "react";
import PropTypes from "prop-types";
import ChatForm from "./ChatForm";

class ChatRoom extends Component {
    constructor (props) {
        super(props);

        props.socket.on("room-entered", (name) => {
            console.log(`${name} has joined the room.`);
        });
    }

    render () {
        return (
            <div>
                <h1>Room {this.props.roomID}</h1>
                <ChatForm name={this.props.name} socket={this.props.socket} roomID={this.props.roomID} />
            </div>
        );
    }
}

ChatRoom.propTypes = {
    socket: PropTypes.object.isRequired,
    roomID: PropTypes.string.isRequired,
    name: PropTypes.string
};

export default ChatRoom;
