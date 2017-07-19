import React, {Component} from "react";
import PropTypes from "prop-types";
import ChatForm from "./ChatForm";
import AttendeeList from "./AttendeeList";

class ChatRoom extends Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <div>
                <h1>Room {this.props.roomID}</h1>
                <ChatForm name={this.props.name} socket={this.props.socket} roomID={this.props.roomID} />
                <AttendeeList attendees={this.props.attendees} />
            </div>
        );
    }
}

ChatRoom.propTypes = {
    socket: PropTypes.object.isRequired,
    roomID: PropTypes.string.isRequired,
    attendees: PropTypes.array.isRequired,
    name: PropTypes.string,
};

export default ChatRoom;
