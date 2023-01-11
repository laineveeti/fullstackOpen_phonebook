const morgan = require('morgan');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('react/build'));
morgan.token('data', (req, res) => req.method === 'POST' ? JSON.stringify(req.body) : '');
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));

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
    res.send(info);
});

app.get('/api/persons', (req, res) => {
    res.json(contacts);
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const contact = contacts.find(contact => contact.id === id);
    contact ? res.json(contact) : res.status(404).send();
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    contacts = contacts.filter(contact => contact.id !== id);
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
    res.json(newContact);
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};
  
app.use(unknownEndpoint);

const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});