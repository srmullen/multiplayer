import React, {Component} from "react";
import PropTypes from "prop-types";

const Message = ({name, message}) => {
    return <div>{name}: {message}</div>
}

class ChatForm extends Component {
    constructor (props) {
        super(props);
        this.state = {
            chatInput: "",
            messages: []
        }

        props.socket.on("broad", (data) => {
            this.setState({messages: this.state.messages.concat(data)});
        });
    }

    render () {
        const messages = this.state.messages.map((message, i) => {
            return <Message key={i} name={message.name} message={message.message} />;
        });
        return (
            <div>
                <div id="future">{messages}</div>
                <form id="chat_form" onSubmit={e => {
                    e.preventDefault();
                    const message = this.state.chatInput;
                    this.props.socket.emit("messages", {name: this.props.name, message});
                    this.setState({
                        chatInput: "",
                        messages: this.state.messages.concat({name: this.props.name, message})
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
