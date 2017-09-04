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
            <div className="pa4 w-100 measure-ns dt center">
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        this.props.joinRoom(this.state.roomID, this.state.name);
                    }}>
                    <fieldset className="ba b--transparent v-mid ph3">
                        <div>
                            <label className="db lh-copy" htmlFor="name-input">Name</label>
                            <input
                                className="input-reset pa2 ba w-100"
                                id="name-input" type="text"
                                value={this.state.name} onChange={e => {
                                    this.setState({name: e.target.value});
                                }} />
                        </div>
                        <div className="mt3">
                            <label className="db lh-copy" htmlFor="room-input">Room ID</label>
                            <input
                                className="input-reset pa2 ba w-100"
                                id="room-input" type="text"
                                value={this.state.roomID} onChange={e => {
                                    this.setState({
                                        roomID: e.target.value,
                                        joinRoomDisabled: !e.target.value.length
                                    });
                                }} />
                        </div>
                        <div className="lh-copy mt3">
                            <input
                                className="input-reset ba b--black-80 pa2 bg-transparent ma2 ml0 hover-bg-black hover--white hover"
                                type="submit"
                                value="Join Room"
                                disabled={this.state.joinRoomDisabled} />
                            <button
                                className="input-reset ba b--black-80 pa2 bg-transparent ma2 hover-bg-black hover--white hover"
                                onClick={(e) => {
                                    e.preventDefault();
                                    this.props.createRoom(this.state.name);
                                }}>
                                Create Room
                            </button>
                        </div>
                    </fieldset>
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
