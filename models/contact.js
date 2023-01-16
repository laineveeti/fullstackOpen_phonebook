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
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    number: {
        type: String,
        minlength: 8,
        required: true,
        validate: {
            validator: number => /\d{3}-\d{5,}/.test(number) || /\d{2}-\d{6,}/.test(number),
            message: props => `${props.value} is not a valid phone number!`
        }
    }
});

contactSchema.set('toJSON', {
    transform: (_, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Contact', contactSchema);