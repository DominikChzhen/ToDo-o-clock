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

let isWrongPassword = false;
let isUserTaken = false;
let isNoMatch = false;

//login page
app.get("/", (req, res) => {
    res.render("start", {isWrongPassword});
    isWrongPassword = false;
})

//signup page
app.get("/signup", (req, res) => {
    res.render("signup", {isUserTaken, isNoMatch})
    isUserTaken = false;
    isNoMatch = false;
})

//Calendo Home when logged in
app.get("/calendo", async (req, res) => {
    if(!req.session.user_id){
        return res.redirect("/");
    }
    const user = await User.findOne({_id:req.session.user_id});
    res.render("signedin", {user});
    //res.render("Calendo")
})

//create new User
app.post("/signup", async (req,res) => {
    const { username, password, password2} = req.body;
    //if the fields are empty just rerender
    if(username == "" || password == ""){
        return res.redirect("/signup");
    }
    //logik für nur ein username 
    const userWithSameName = await User.findOne({username});
    if(userWithSameName) isUserTaken = true;
    //logik für password1 und password2 muss überein stimmen
    if(password!==password2){
        isNoMatch = true;
    }
    
    if(isUserTaken||isNoMatch){
        return res.redirect("/signup");
    }

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

//login 
app.post("/login", async (req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username});
    if(user == null){
        isWrongPassword = true;
        return res.redirect("/");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if(isValidPassword){
        req.session.user_id = user._id;
        return res.redirect("/calendo");
    } else {
        isWrongPassword = true;
         return res.redirect("/");
    }
})

//logout
app.post("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
})

//TODO CRUD
//create
app.post("/createToDo", async (req, res) => {
    //save new todo to DB
    try{
    await User.updateOne(
        {_id:req.session.user_id},
        {$push: {toDo: {
            name: req.body.name,
            dueDate: req.body.dueDate,
            done: false
        }}
        }
    );
    } catch {
        return res.send("Wrong date!");
    }
    return res.redirect("/calendo");
    /*name: String,
    dueDate: Date,
    wichtig: Boolean,
    dringend: Boolean,
    addedTime: Number,
    icon: Number
    */
});

//Update completet Status
app.get("/completeToDo/:id", async (req, res) => {
    const { id } = req.params;
    const user = await User.findOne({_id: req.session.user_id});
    const toDo = user.toDo.find(item => item._id == id);
    const status = toDo.done;
    try 
    {
        await User.updateOne
        (
            { _id: req.session.user_id, "toDo._id": id},  // Find user
            {
                $set:
                {
                    "toDo.$.done": !status
                }
            }
        );

    } catch (err) {
        console.error(err);
        return res.status(500).send("Error deleting To-Do.");
    }
    return res.redirect("/calendo");
})

//delete
app.get("/deleteToDo/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await User.updateOne(
            { _id: req.session.user_id },  // Find user
            { $pull: { toDo: { _id: id } } } // Remove toDo
        );
    } catch (err) {
        console.error(err);
        return res.status(500).send("Error deleting To-Do.");
    }
    return res.redirect("/calendo");
})

//404 Route
app.use((req, res) => {
    res.status(404).send("404 NOT FOUND!");
})

app.listen(3000, () => {
    console.log("Server is listening...");
})