const R = require("ramda");

const Room = function ({id=generateID(), attendees=[], messages=[], createdAt=getTime(), destroyed=false}) {
    this.id = id;
    this.createdAt = createdAt;
    this.destroyed = destroyed;
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

Room.destroy = function (room) {
    return Room.of(Object.assign({}, room, {destroyed: true}));
}

function generateID () {
    return Math.random().toString(36).substr(2, 9);
}

function getTime () {
    return  new Date().getTime();
}

module.exports = Room;
