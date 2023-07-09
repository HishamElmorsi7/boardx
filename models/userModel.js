const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!']
    },

    email: {
        type: String,
        required: [true, 'Please tell us your email'],
        unique: true,
        // To store the email in lowercase
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },

    photo: String,

    password: {
        type: String,
        required: [true, 'Please provide a password' ],
        minlength: 8
    }, 
    passwordConfirm: {
        type: String,
        required: [true, 'Please provide a password' ],
        validate: {
            validator: function(el) {
                return el === this.password
            }, 
            message: "Passwords are not the same!"
        }
    }
})

// After validation against the schema that is the step before saving ;)
userSchema.pre('save', async function(next){
    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined;
    next()
})
// In the code you shared, the mongoose.model function is used to 
// create a model named User. The first argument 
// 'User' specifies the name of the collection in MongoDB 
// where the documents corresponding to this model will be stored.
const User = mongoose.model('User', userSchema);

module.exports = User;