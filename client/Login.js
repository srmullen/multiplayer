import React, {Component} from "react";
import PropTypes from "prop-types";

class Login extends Component {
    constructor (props) {
        super(props);
        this.state = {
            name: "",
            roomID: ""
        };
    }

    render () {
        return (
            <div className="login-form">
                <form onSubmit={e => {
                    e.preventDefault();
                    this.props.joinRoom(this.state.roomID, this.state.name);
                }}>
                    <div>
                        <label>Name: <input type="text" value={this.state.name} onChange={e => {
                            this.setState({name: e.target.value});
                        }} /></label>
                    </div>
                    <div>
                        <label>Room ID: <input type="text" value={this.state.roomID} onChange={e => {
                            this.setState({roomID: e.target.value});
                        }} /></label>
                    </div>
                    <input type="submit" value="Join Room" />
                </form>
                <button onClick={this.props.createRoom}>Create Room</button>
            </div>
        );
    }
}

Login.propTypes = {
    joinRoom: PropTypes.func.isRequired,
    createRoom: PropTypes.func.isRequired
};

export default Login;
