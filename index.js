const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const app = express();
const mongoose = require("mongoose");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const session = require("express-session");

app.use(express.static(path.join(__dirname, '/views')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(session({secret: "secretplaceholder"}));

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '/views'));
mongoose.set("strictQuery", true);

mongoose.connect("mongodb://127.0.0.1:27017/calendoDB")
.then(() => {
    console.log("DB is connected");
})
.catch(err => {
    console.log("OH NO ERROR!!");
});


//Home
app.get("/", (req, res) => {
    res.render("start");
})

app.get("/signup", (req, res) => {
    res.render("signup")
})
//Calendo Home when logged in
app.get("/calendo", async (req, res) => {
    if(!req.session.user_id){
        return res.redirect("/");
    }
    const user = await User.findOne({_id:req.session.user_id});
    res.render("signedin", {user});
})

app.post("/signup", async (req,res) => {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 12);
    const user = new User({
        username,
        password: hash,
        toDo: [
            {
                name: "ExampleToDo1",
                wichtig: true,
                dringend: false,
                addedAtTime: 1434321,
                icon: 34
            }
        ]

    })
    await user.save();
    req.session.user_id = user._id;
    res.redirect("/calendo")
})

app.post("/login", async (req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username});
    if(user == null){
        return res.redirect("/");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if(isValidPassword){
        req.session.user_id = user._id;
        return res.redirect("/calendo");
    } else {
         return res.redirect("/");
    }
})

app.post("/logout", (req, res) => {
    //req.session.user_id = null;
    req.session.destroy();
    res.redirect("/");
})
    
app.post("/createToDo", async (req, res) => {
    //return res.send(req.body);
    //save new todo to DB
    //const user = await User.findOne({_id:req.session.user_id});
    await User.updateOne({_id:req.session.user_id}, {
        $push: {toDo: {
            name: req.body.name,
            dueDate: req.body.dueDate
        }}
    }).then(result => console.log("Comment added!", result))
    .catch(err => console.log(err));
    res.redirect("/calendo");
    /*name: String,
    dueDate: Date,
    wichtig: Boolean,
    dringend: Boolean,
    addedTime: Number,
    icon: Number
    */
})
/*
//subreddit Search request
app.post("/subreddit", (req, res) => {
    let {subreddit} = req.body;

})

//new comment post request
app.post("/subreddit/comment", (req, res) => {
            //res.redirect(`http://localhost:8080/r/${currentSubreddit}`)
            //res.render("subreddit", {subreddit, comments: subs.comments})
})

//pach to edit comment
*/
app.listen(8080, () => {
    console.log("Server is listening...");
})