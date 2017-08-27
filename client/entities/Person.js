import uuid from "uuid/v4";

function Person ({name="Anonymous", id=uuid()}) {
    this.name = name;
    this.id = id;
}

Person.of = function (props) {
    return new Person(props);
}

export default Person;
