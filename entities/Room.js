
const Room = function ({id=generateID(), attendees=[]}) {
    this.id = id;
    this.attendees = attendees;
};

Room.of = function (props={}) {
    return new Room(props);
};

function generateID () {
    return Math.random().toString(36).substr(2, 9);
}

module.exports = Room;
