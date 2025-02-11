const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
mongoose.connect("mongodb://127.0.0.1:27017/Calendo1DB")
.then(() => {
    console.log("connected");
})
.catch(err => {
    console.log("OH NO ERROR!!");
});

const userSchema = new mongoose.Schema({
    username: String,
    age: Number,
})

const User = mongoose.model("User", userSchema);
const Konsti = new User({username: "Konstantin",
    age: 19});
Konsti.save();
//const user = new User(id:...);
//user.save().then;
//user.insertMany()
//.then(data => {
// worked!!!!
// });

//Movie.find({}).then(data => {
// log data})
//Movie.findById("1277371312").then();

const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '/views'));

let subreddits = [
    {
        name: "chicken",
        slogan: "Here we dont chicken your nutz",
        comments:  [
            {
                id: 1,
                username: "Tim",
                text: "I love Chickens MAMA"
            },
            {
                id: 2,
                username: "Alex",
                text: "Look at my chicken tho!!"
            }
        ]
    },
    {
        name: "memes",
        slogan: "let there be memes",
        comments:  [
            {
                id: 1,
                username: "Sam",
                text: "Me when... xd"
            }
        ]
    },
    {
        name: "funny",
        slogan: "memes but better",
        comments:  [
            {
                id: 1,
                username: "Lobert",
                text: "I AAM FUNNEYYA"
            }
        ]
    }
]

let isMatchingWithSub = null;
let currentSubreddit;
let currentComments;

//Home
app.get("/", (req, res) => {
    res.render("Home", {isMatchingWithSub});
})

//request comes from Search post request
//we cant directly do a get or post request 
//because the name of the sub is in the post req.body
app.get("/r/:subreddit", (req, res) => {
    let {subreddit} = req.params;
    //for(subs of subreddits){
        //if(subs.name = subreddit){
            //currentComments = subs.comments;
        //}
    //}
    res.render("subreddit", {subreddit, comments: currentComments});
})

//show details of one comment get request
app.get("/r/:subreddit/comment/:id", (req, res) => {
    let {subreddit} = req.params;
    let id = parseInt(req.params.id);
    for(subs of subreddits){
        if(subs.name == subreddit){
            for(com of subs.comments){
                if(com.id == id){
                    res.render("comment", {subreddit, com});
                    return;
                }
            }
            
        }
    }
})

//form to edit comment
app.get("/r/:subreddit/comment/:id/edit", (req, res) =>{
    let {subreddit} = req.params;
    let id = parseInt(req.params.id);
    for(subs of subreddits){
        if(subs.name == subreddit){
            for(com of subs.comments){
                if(com.id == id){
                    res.render("editComment", {subreddit, com});
                    return;
                }
            }
            
        }
    }
})

//subreddit Search request
app.post("/subreddit", (req, res) => {
    let {subreddit} = req.body;
    if(subreddit !== ""){

        for(subs of subreddits){
            if(subreddit == subs.name){
                currentSubreddit = subreddit;
                currentComments = subs.comments;

                //re.render only allows two params
                //res.render("subreddit", {subreddit, comments: subs.comments})
                isMatchingWithSub = null;
                res.redirect(`/r/${currentSubreddit}`);
                return;
            }
        }
        isMatchingWithSub = true;
        //res.render("Home", {isMatchingWithSub});
        res.redirect("/");
    } else {
        isMatchingWithSub = false;
        //res.render("Home", {isMatchingWithSub});
        res.redirect("/");
    }
    
})

//new comment post request
app.post("/subreddit/comment", (req, res) => {
    let {username, text} = req.body;
    let newComment = {username, text};
    for(subs of subreddits){
        if(currentSubreddit == subs.name){
            newComment.id = subs.comments.length +1;
            subs.comments.push(newComment);
            //let subreddit = subs.name;
            res.redirect(`http://localhost:8080/r/${currentSubreddit}`)
            //res.render("subreddit", {subreddit, comments: subs.comments})
        }
    }

})

//pach to edit comment
app.patch("/r/:subreddit/comment/:id", (req, res) => {
    let {subreddit} = req.params;
    let id = parseInt(req.params.id);
    let newCommentText = req.body.text;
    for(subs of subreddits){
        if(subs.name == subreddit){
            for(com of subs.comments){
                if(com.id == id){
                    com.text = newCommentText;
                    //res.render("comment", {subreddit, com});
                    res.redirect(`/r/${subreddit}/comment/${req.params.id}`);
                    return;
                }
            }
            
        }
    }
})

app.delete("/r/:subreddit/comment/:id", (req, res) =>{
    let {subreddit} = req.params;
    let id = parseInt(req.params.id);
    for(subs of subreddits){
        if(subs.name == subreddit){
            subs.comments = subs.comments.filter(c => c.id !== id);
            currentComments = subs.comments;
            //com.text = newCommentText;
            //res.render("comment", {subreddit, com});
            res.redirect(`/r/${subreddit}`);
            return;
            
        }
    }
})

app.listen(8080, () => {
    console.log("listening...");
})