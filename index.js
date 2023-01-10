const { response, json } = require('express');
const express = require('express');
const app = express();

app.use(express.json());

let contacts = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        nuber: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendic",
        number: "39-23-6423122"
    }
]

app.get('/info', (req, res) => {
    const info = `Phonebook has info for ${contacts.length} people<br>${new Date()}`
    console.log(info);
    res.send(info);
});

app.get('/api/persons', (req, res) => {
    console.log("sending all contacts");
    res.json(contacts);
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const contact = contacts.find(contact => contact.id === id);
    console.log('sending resource: ', contact);
    contact ? res.json(contact) : res.status(404).send();
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    contacts = contacts.filter(contact => contact.id !== id);
    console.log('deleted resource: ', id);
    res.status(204).end();
});

app.post('/api/persons', (req, res) => {
    const id = Math.floor(Math.random() * 10000);
    const data = req.body;
    if (!(data && data.name && data.number)) {
        return res.status(400).json({
            error: 'missing contact info'
        })
    }

    if(contacts.find(contact => contact.name === data.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const newContact = {
        id: id,
        name: data.name,
        number: data.number
    };

    contacts = contacts.concat(newContact);
    console.log('created person: ', newContact);
    res.json(newContact);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log('listening on port ', PORT);
});