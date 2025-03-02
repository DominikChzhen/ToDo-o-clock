const mongoose = require("mongoose");
const toDoSchema = new mongoose.Schema({
    name: String,
    dueDate: Date,
    wichtig: Boolean,
    dringend: Boolean,
    done: Boolean,
    addedAtTime: Number,
    icon: Number
})

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username required!"]
    },
    password: {
        type: String,
        require: [true, "password required!"]
    },
    toDo: [toDoSchema],
})

const User = mongoose.model("User", userSchema);

module.exports = User;