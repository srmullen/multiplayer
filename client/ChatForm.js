import React, {Component} from "react";
import PropTypes from "prop-types";
import Messages from "./Messages";

class ChatForm extends Component {
    constructor (props) {
        super(props);
        this.state = {
            chatInput: ""
        }
    }

    componentDidMount () {
        this.refs.chatInput.focus();
    }

    render () {
        return (
            <div className="bg-white pa2 w-60 mh-auto f4">
                <Messages messages={this.props.messages} />
                <form onSubmit={e => {
                    e.preventDefault();
                    const message = this.state.chatInput;
                    this.props.socket.emit("messages", {
                        name: this.props.name,
                        roomID: this.props.roomID,
                        message
                    }, (data) => {
                        console.log(data);
                    });
                    this.setState({
                        chatInput: ""
                    });
                }}>
                    <input
                        className="input-reset bt-none br-none bl-none w-100 bb black-70"
                        ref="chatInput" type="text" value={this.state.chatInput}
                        onChange={e => {
                            this.setState({chatInput: e.target.value});
                        }}
                    />
                </form>
            </div>
        );
    }
};

ChatForm.propTypes = {
    socket: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    roomID: PropTypes.string.isRequired
};

export default ChatForm;
