import React, {Component} from "react";
import PropTypes from "prop-types";

class ChatRoom extends Component {
    constructor (props) {
        super(props);
    }

    render () {
        return <h1>Chat Room</h1>
    }
}

ChatRoom.propTypes = {
    roomID: PropTypes.string.isRequired,
    name: PropTypes.string
};

export default ChatRoom;
