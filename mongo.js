const mongoose = require('mongoose');

if(process.argv.length < 3) {
    console.log('give password as argument');
    process.exit(1);
}
const password = process.argv[2];
const url = `mongodb+srv://vlaine:${password}@cluster0.rdcvhso.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.connect(url);

const contactSchema = mongoose.Schema({
    name: String,
    number: String
})

const Contact = mongoose.model('Contact', contactSchema);

if(process.argv.length === 3) {
    Contact.find({}).then(results => {
        results.forEach(contact => {
            console.log(contact);
        });
        mongoose.connection.close();
    })
}
if(process.argv.length === 5) {
    const newName = process.argv[3];
    const newNumber = process.argv[4];
    const newContact = Contact({
        name: newName,
        number: newNumber
    })
    newContact.save().then(() => {
        console.log(`added ${newName} number ${newNumber} to phonebook`)
        mongoose.connection.close();
    })
}