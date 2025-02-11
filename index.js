const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
mongoose.connect("mongodb://127.0.0.1:27017/moviesDB")
.then(() => {
    console.log("connected");
})
.catch(err => {
    console.log("OH NO ERROR!!");
});

const movieSchema = new mongoose.Schema({
    title: String,
    year: Number,
    score: Number,
    rating: String
})

const Movie = mongoose.model("Movie", movieSchema);
const amadeus = new Movie({title: "Amadeus",
    year: 1984, score: 8.2, rating: "R"});
amadeus.save();
//const user = new User(id:...);
//user.save().then;
//user.insertMany()
//.then(data => {
// worked!!!!
// });

//Movie.find({}).then(data => {
// log data})
//Movie.findById("1277371312").then();