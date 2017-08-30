import React, {Component} from "react";
import PropTypes from "prop-types";
import moment from "moment";

let interval = null;

function timer (fn, rate) {
    interval = setInterval(fn, rate);
}

function stopTimer () {
    clearInterval(interval);
}

class Countdown extends Component {
    constructor (props) {
        super(props);
        this.state = {
            time: props.expireAt - new Date().getTime()
        };
    }

    componentDidMount () {
        timer(() => {
            const time = this.props.expireAt - new Date().getTime();
            if (time <= 0) {
                stopTimer(interval);
                this.props.onTimeout();
            } else {
                this.setState({time});
            }
        }, 500);
    }

    render () {
        return (
            <div className="f3 ma3">{formatMilliseconds(this.state.time)}</div>
        );
    }

    componentWillUnmount () {
        stopTimer(interval);
        interval = null;
    }
}

function formatMilliseconds (milliseconds) {
    var m = moment.duration(milliseconds, "ms");
    const seconds = m.seconds();
    return `${m.minutes()}:${seconds < 10 ? "0" + seconds : seconds}`;
}

Countdown.propTypes = {
    expireAt: PropTypes.number.isRequired
};

export default Countdown;
