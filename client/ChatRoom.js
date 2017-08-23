import React, {Component} from "react";
import PropTypes from "prop-types";
import ChatForm from "./ChatForm";
import AttendeeList from "./AttendeeList";
import Person from "../entities/Person";
import Room from "../entities/Room";

class ChatRoom extends Component {
    constructor (props) {
        super(props);
    }

    render () {
        if (this.props.self && this.props.room) {
            return (
                <div className="ma2 black-70">
                    <h1 className="w-60 mh-auto f1 lh-solid">Room {this.props.roomID}</h1>
                    <ChatForm
                        name={this.props.self.name}
                        socket={this.props.socket}
                        roomID={this.props.room.id}
                        messages={this.props.room.messages}
                    />
                    <AttendeeList attendees={this.props.room.attendees} />
                    <button onClick={this.props.leaveRoom}>Leave</button>
                </div>
            );
        } else {
            return (<div>Getting Self</div>);
        }
    }
}

ChatRoom.propTypes = {
    socket: PropTypes.object.isRequired,
    room: PropTypes.instanceOf(Room),
    leaveRoom: PropTypes.func.isRequired,
    self: PropTypes.instanceOf(Person)
};

export default ChatRoom;
