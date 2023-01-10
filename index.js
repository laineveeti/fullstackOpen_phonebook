const express = require('express');
const app = express();

const contacts = [
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

app.get('/api/persons', (req, res) => {
    console.log("sending all contacts");
    res.json(contacts);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log('listening on port ', PORT);
})