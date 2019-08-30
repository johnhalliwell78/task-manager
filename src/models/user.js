const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        uppercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Invalid Password');
            }
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is Invalid');
            }
        }
    },
    age: {
        type: Number,
        default: 16
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, 'mynodejsproject');
    user.tokens = user.tokens.concat({token: token});
    await user.save();
    // mỗi lần tạo ra một token thì phải lưu vào user , hàm concat để nối các mảng lại với nhau
    return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});
    if (!user) {
        throw new Error('Unable to log in');
    }
    const isMatch = await bcrypt.compareSync(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to log in');
    }
    return user;
};
// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null);
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;