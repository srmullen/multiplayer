import React, {Component} from "react";
import PropTypes from "prop-types";
import ChatForm from "./ChatForm";
import AttendeeList from "./AttendeeList";
import Person from "../entities/Person";

class ChatRoom extends Component {
    constructor (props) {
        super(props);
    }

    render () {
        if (this.props.self) {
            return (
                <div>
                    <h1>Room {this.props.roomID}</h1>
                    <button onClick={this.props.leaveRoom}>Leave</button>
                    <button onClick={() => {
                        this.props.socket.emit("get-self", {}, function (user) {
                            console.log(user);
                        });
                    }}>Get self</button>
                    <ChatForm name={this.props.self.name} socket={this.props.socket} roomID={this.props.roomID} />
                    <AttendeeList attendees={this.props.attendees} />
                </div>
            );
        } else {
            return (<div>Getting Self</div>);
        }
    }
}

ChatRoom.propTypes = {
    socket: PropTypes.object.isRequired,
    roomID: PropTypes.string.isRequired,
    attendees: PropTypes.array.isRequired,
    leaveRoom: PropTypes.func.isRequired,
    self: PropTypes.instanceOf(Person)
};

export default ChatRoom;
