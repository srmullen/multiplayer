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

        socket.on("broad", (data) => {
            this.setState({messages: this.state.messages.concat(data)});
        });
    }

    render () {
        const messages = this.state.messages.map((message, i) => <Message key={i} name="Sean" message={message} />);
        return (
            <div>
                <h1>Chat!</h1>
                <div id="future">{messages}</div>
                <form id="chat_form" onSubmit={e => {
                    e.preventDefault();
                    const message = this.state.chatInput;
                    socket.emit("messages", message);
                    this.setState({
                        chatInput: "",
                        messages: this.state.messages.concat(message)
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
