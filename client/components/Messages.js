import React, {Component} from "react";
import PropTypes from "prop-types";

const Message = ({name, message}) => {
    return <div>{name}: {message}</div>
}

const Messages = (props) => {
    const messages = props.messages.map((message, i) => {
        return <Message key={i} name={message.name} message={message.message} />;
    });

    return (
        <div>{messages}</div>
    );
}

Messages.propTypes = {
    messages: PropTypes.array.isRequired
};

export default Messages;
