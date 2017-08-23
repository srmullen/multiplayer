import React, {Component} from "react";
import PropTypes from "prop-types";

class Login extends Component {
    constructor (props) {
        super(props);
        this.state = {
            name: "",
            roomID: "",
            joinRoomDisabled: true
        };
    }

    render () {
        return (
            <div className="pa4 w-50 measure center">
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        this.props.joinRoom(this.state.roomID, this.state.name);
                    }}>
                    <div>
                        <label className="db lh-copy" htmlFor="name-input">Name</label>
                        <input id="name-input" type="text" value={this.state.name} onChange={e => {
                            this.setState({name: e.target.value});
                        }} />
                    </div>
                    <div>
                        <label className="db lh-copy" htmlFor="room-input">Room ID</label>
                        <input id="room-input" type="text" value={this.state.roomID} onChange={e => {
                            this.setState({
                                roomID: e.target.value,
                                joinRoomDisabled: !e.target.value.length
                            });
                        }} />
                    </div>
                    <div className="lh-copy mt3">
                        <input className="ma1" type="submit" value="Join Room" disabled={this.state.joinRoomDisabled} />
                        <button className="ma1" onClick={(e) => {
                            e.preventDefault();
                            this.props.createRoom(this.state.name);
                        }}>Create Room</button>
                    </div>
                </form>
            </div>
        );
    }
}

Login.propTypes = {
    joinRoom: PropTypes.func.isRequired,
    createRoom: PropTypes.func.isRequired
};

export default Login;
