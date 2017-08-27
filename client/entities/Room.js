import R from "ramda";

const Room = function ({id=generateID(), attendees=[], messages=[]}) {
    this.id = id;
    // Set
    this.attendees = attendees;
    // List
    this.messages = messages
};

Room.of = function (props={}) {
    return new Room(props);
};

// Room -> Person -> Room
Room.enter = function (room, person) {
    return Room.of(Object.assign({}, room, {attendees: room.attendees.concat(person)}));
}

// Room -> Person -> Room
Room.leave = function (room, person) {
    return Room.of(Object.assign({}, room, {
        attendees: R.reject(attendee => attendee.id === person.id, room.attendees)
    }));
}

function generateID () {
    return Math.random().toString(36).substr(2, 9);
}

export default Room;
