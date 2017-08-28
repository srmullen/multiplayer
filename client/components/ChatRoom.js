import React, {Component} from "react";
import PropTypes from "prop-types";
import ChatForm from "components/ChatForm";
import AttendeeList from "components/AttendeeList";
import Countdown from "components/Countdown";
import Person from "entities/Person";
import Room from "entities/Room";

class ChatRoom extends Component {
    render () {
        if (this.props.self && this.props.room) {
            return (
                <div className="ma2 black-70">
                    <div className="fl w-two-thirds ph4">
                        <div className="center lh-title">
                            <h1 className="f1 dib">Room {this.props.roomID}</h1>
                            <div className="fr dib ma4">
                                <Countdown expireAt={this.props.room.createdAt + 20 * 60 * 1000} />
                            </div>
                        </div>
                        <ChatForm
                            name={this.props.self.name}
                            socket={this.props.socket}
                            roomID={this.props.room.id}
                            messages={this.props.room.messages}
                        />
                    </div>
                    <div className="fr w-third">
                        <AttendeeList
                            self={this.props.self}
                            leaveRoom={this.props.leaveRoom}
                            attendees={this.props.room.attendees}
                        />
                    </div>
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