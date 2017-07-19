import React from "react";
import PropTypes from "prop-types";

const Attendee = ({name}) => {
    return (
        <li>{name}</li>
    );
};

const AttendeeList = (props) => {
    const attendees = props.attendees.map((attendee, i) => <Attendee key={i} {...attendee} />);
    return (
        <ul className="attendees">
            {attendees}
        </ul>
    );
};

AttendeeList.propTypes = {
    attendees: PropTypes.array.isRequired
};

export default AttendeeList;
