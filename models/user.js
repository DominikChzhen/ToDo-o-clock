const mongoose = require("mongoose");
const toDoSchema = new mongoose.Schema({
    id: Number,
    text: String,
    important: Boolean,
    dueDate: Date,
    timeRequired: Number,
})

const userSchema = new mongoose.Schema({
    name: String,
    slogan: String,
    toDo: [toDoSchema],
})

const User = mongoose.model("User", userSchema);

module.exports = User;