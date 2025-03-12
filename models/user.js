const mongoose = require('mongoose');
const todoSchema = require('./todo');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username required!"]
    },
    password: {
        type: String,
        require: [true, "password required!"]
    },
    completetToDos: {
        type: Number,
        default: 0
    },
    totalTimeWorked: {
        type: Number,
        default: 0
    },
    toDo: [todoSchema]
})

const User = mongoose.model("User", userSchema);

module.exports = User;