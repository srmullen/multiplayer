function Person ({name="Anonymous", id}) {
    this.name = name;
    this.id = id;
}

Person.of = function (props) {
    return new Person(props);
}

// export default Person;
module.exports = Person;
