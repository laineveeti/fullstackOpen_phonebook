const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;
mongoose.connect(url)
    .then(() => {
        console.log('connected to MongoDB');
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message);
    });

const contactSchema = mongoose.Schema({
    name: String,
    number: String
});

contactSchema.set('toJSON', {
    transform: (_, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Contact', contactSchema);