import { useEffect, useState } from 'react';
import Persons from './components/Persons';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Notification from './components/Notification';
import phonebookServer from './services/jsonserver';

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newNumber, setNewNumber] = useState('');
    const [newName, setNewName] = useState('');
    const [filter, setFilter] = useState('');
    const [msg, setMsg] = useState(null);
    const [success, setSuccess] = useState(true);

    useEffect(() => {
        phonebookServer.getAll().then(data => setPersons(data));
    }, []);

    const addNew = (event) => {
        event.preventDefault();

        const existingContact = persons.find(person => person.name === newName);

        if (existingContact) {
            if (window.confirm(`${existingContact.name} is already added to phonebook, replace the old number with a new one?`)) {
                const updatedContact = { ...existingContact, number: newNumber};
                phonebookServer.update(existingContact.id, updatedContact)
                    .then(() => {
                        setMsg(`Replaced ${updatedContact.name}'s number with ${updatedContact.number}`);
                        setSuccess(true);
                        setTimeout(() => setMsg(null), 5000);
                    })
                    .catch(() => {
                        setMsg(`Information of ${existingContact.name} has already been removed from server`);
                        setSuccess(false);
                        setTimeout(() => setMsg(null), 5000);
                        setPersons(persons.filter(person => person.id !== existingContact.id));
                    });
                setPersons(persons.map(contact => contact.id === updatedContact.id ? updatedContact : contact));
            
                setNewName('');
                setNewNumber('');
            }
        
        } else {
            const newPerson = { name: newName, number: newNumber };
            phonebookServer.create(newPerson)
                .then(data => {
                    setMsg(`Added ${data.name}`);
                    setSuccess(true);
                    setTimeout(() => setMsg(null), 5000);
                    setPersons(persons.concat(data));
                });
    
            setNewName('');
            setNewNumber('');
        }
    };

    const removePerson = id => {
        const name = persons.find(person => person.id === id).name;
        if(window.confirm(`Delete ${name}?`)) {
            phonebookServer.remove(id)
                .then(() => {
                    setMsg(`Deleted ${name}`);
                    setTimeout(() => setMsg(null), 5000);
                    setSuccess(true);
                })
                .catch(() => {
                    setMsg(`Information of ${name} has already been removed from server`);
                    setSuccess(false);
                    setTimeout(() => setMsg(null), 5000)
                });
            setPersons(persons.filter(person => person.id !== id));
        }
    }

    const handleNameChange = (event) => {
        setNewName(event.target.value);
    }

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value);
    }

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification msg={msg} success={success} />
            <Filter filter={filter} handleFilterChange={handleFilterChange} />
            <h2>add a new</h2>
            <PersonForm
                addNew={addNew}
                handleNameChange={handleNameChange}
                handleNumberChange={handleNumberChange}
                newName={newName}
                newNumber={newNumber} />
            <h2>Numbers</h2>
            <Persons
                persons={persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))}
                removePerson={removePerson} />
        </div>
    );

}

export default App