import mongoose from "mongoose";

const schema = mongoose.Schema();

const userSchema =mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'customer'
    },
});

export default mongoose.model('User', userSchema, 'users');