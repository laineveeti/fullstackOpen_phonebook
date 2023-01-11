const Persons = ({persons, removePerson}) => (
    <div>
        {persons.map(person => <Person key={person.name} person={person} removePerson={removePerson} />)}
    </div>
);

const Person = ({person, removePerson}) => (
    <div>
        <p>{person.name} {person.number}</p>
        <button onClick={() => removePerson(person.id)}>delete</button>
    </div>
    
);

export default Persons;