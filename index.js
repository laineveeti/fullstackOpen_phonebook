require('dotenv').config();
const morgan = require('morgan');
const express = require('express');
const Contact = require('./models/contact');

const app = express();
app.use(express.static('build'));
app.use(express.json());

morgan.token('data', (req) => req.method === 'POST' ? JSON.stringify(req.body) : '');
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));

app.get('/info', (req, res) => {
    Contact.find({}).then(contacts => {
        const info = `Phonebook has info for ${contacts.length} people<br>${new Date()}`;
        res.send(info);
    });
});

app.get('/api/persons', (req, res) => {
    Contact.find({}).then(contacts => {
        res.json(contacts);
    });
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
    const { name, number } = req.body;
    if (!(req.body && name && number)) {
        return res.status(400).json({
            error: 'missing contact info'
        });
    }
    Contact.find({ name })
        .then(result => {
            if(result.length !== 0) {
                const error = new Error('name must be unique');
                error.name = 'ValidationError';
                throw error;
            }
        })
        .then(async () => {
            const newContact = Contact({ name, number });
            const savedContact = await newContact.save();
            res.json(savedContact);
        })
        .catch(error => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
    const { name, number } = req.body;

    Contact.findByIdAndUpdate(req.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
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
    console.error(error.message);
    console.log('got here');

    if(error.name === 'CastError') {
        res.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        res.status(400).json({ error: error.message });
    }
    next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});