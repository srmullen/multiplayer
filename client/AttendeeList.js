import React from "react";
import PropTypes from "prop-types";
import Person from "entities/Person";

const Attendee = ({name, leaveRoom, isSelf}) => {
    return (
        <li className="lh-copy pv3 ba bt-0 bl-0 br-0 b--dotted b--black-40">
            {name}
            {isSelf ?
                <button
                    className="input-reset ba b--black-20 black-70 pa1 bg-transparent mh3 hover-bg-black hover--white hover f6 fr"
                    onClick={leaveRoom}>
                    Leave
                </button> : ""}
        </li>
    );
};

const AttendeeList = (props) => {
    const attendees = props.attendees.reduce((acc, attendee, i) => {
        const isSelf = attendee.id === props.self.id;
        const el = (<Attendee key={i} {...attendee} isSelf={isSelf} />);
        if (isSelf) {
            return [el, ...acc];
        } else {
            return acc.concat(el);
        }
    }, []);
    return (
        <div className="ma2 pa4">
            <h2 className="f4 pl4 ma2">Attendees</h2>
            <ul className="list">
                {attendees}
            </ul>
        </div>
    );
};

AttendeeList.propTypes = {
    attendees: PropTypes.array.isRequired,
    self: PropTypes.instanceOf(Person).isRequired,
    leaveRoom: PropTypes.func.isRequired
};

export default AttendeeList;
