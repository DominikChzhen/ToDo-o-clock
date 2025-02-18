const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const app = express();
const mongoose = require("mongoose");
const Subredditt = require("./models/subreddit");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '/views'));
mongoose.set("strictQuery", true);

mongoose.connect("mongodb://127.0.0.1:27017/redditDB")
.then(() => {
    console.log("connected");
})
.catch(err => {
    console.log("OH NO ERROR!!");
});


//Home
app.get("/", (req, res) => {
    res.render("Home");
})

//subreddit Search request
app.post("/subreddit", (req, res) => {
    let {subreddit} = req.body;

})

//new comment post request
app.post("/subreddit/comment", (req, res) => {

            res.redirect(`http://localhost:8080/r/${currentSubreddit}`)
            //res.render("subreddit", {subreddit, comments: subs.comments})
})

//pach to edit comment

app.listen(8080, () => {
    console.log("listening...");
})