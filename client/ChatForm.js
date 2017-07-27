import React, {Component} from "react";
import PropTypes from "prop-types";

const Message = ({name, message}) => {
    return <div>{name}: {message}</div>
}

class ChatForm extends Component {
    constructor (props) {
        super(props);
        this.state = {
            chatInput: ""
        }
    }

    render () {
        const messages = this.props.messages.map((message, i) => {
            return <Message key={i} name={message.name} message={message.message} />;
        });
        return (
            <div className="chat-form">
                <div id="future">{messages}</div>
                <form id="chat_form" onSubmit={e => {
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
                    <input type="text" value={this.state.chatInput} onChange={e => {
                        this.setState({chatInput: e.target.value});
                    }} />
                    <input type="submit" value="Send" />
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
