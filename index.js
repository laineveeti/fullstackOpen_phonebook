require('dotenv').config();
const morgan = require('morgan');
const express = require('express');
const Contact = require('./models/contact');
const { response } = require('express');

const app = express();
app.use(express.static('build'));
app.use(express.json());

morgan.token('data', (req, res) => req.method === 'POST' ? JSON.stringify(req.body) : '');
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));

app.get('/info', (req, res) => {
    Contact.find({}).then(contacts => {
        const info = `Phonebook has info for ${contacts.length} people<br>${new Date()}`
        res.send(info);
    })
});

app.get('/api/persons', (req, res) => {
    Contact.find({}).then(contacts => {
        res.json(contacts);
    })
});

app.get('/api/persons/:id', (req, res, next) => {
    Contact.findById(req.params.id)
        .then(contact => {
            contact ? res.json(contact) : res.status(404).end();
        })
        .catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
    Contact.findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).end();
        })
        .catch(error => next(error));
});

app.post('/api/persons', (req, res, next) => {
    const data = req.body;
    if (!(data && data.name && data.number)) {
        return res.status(400).json({
            error: 'missing contact info'
        })
    }
    Contact.find({name: data.name})
        .then(result => {
            if(result.length !== 0) {
                throw 'name must be unique';
            }
        })
        .then(() => {
            const newContact = Contact({
                name: data.name,
                number: data.number
            });
            newContact.save().then(savedContact => {
                res.json(savedContact);
            })
        })
        .catch(error => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
    const data = req.body;

    const contact = {
        name: data.name,
        number: data.number
    }

    Contact.findByIdAndUpdate(req.params.id, contact, { new: true })
        .then(updatedContact => {
            res.json(updatedContact);
        })
        .catch(error => next(error));
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
    res.status(400).send({error});
}
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});