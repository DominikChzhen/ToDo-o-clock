const express = require('express');
const app = express(); // Erstellt den Express-Server
const mongoose = require('mongoose'); // Mongoose für MongoDB
const port = 3000; // Port, auf dem der Server läuft
//const Todo = require('./models/todo'); // Importiert das Todo-Modell
const methodOverride = require('method-override') // Für PUT- und DELETE-Requests
const User = require('./models/user'); // Importiert das User-Modell
const bcrypt = require('bcrypt'); // Importiert Verschlüsselungs-Package fürs speichern von Passwörtern
const session = require('express-session'); // Importiert Session-Package
require('dotenv').config();
const sessionSecret = process.env.SESSION_SECRET;
const dbUrl = process.env.DB_URL;
let useLocalDB = false;
// Verbidnung zur MongoDB
//'mongodb://127.0.0.1:27017/calendo'
if(!useLocalDB){
    mongoose.connect(dbUrl)
    .then(() => {
        console.log("Verbunden mit MongoDB!")
    })
    .catch(err => {
        console.error("Etwas lief schief mit der Datenbank:", err)
    })  
} else {
    mongoose.connect('mongodb://127.0.0.1:27017/calendo')
    .then(() => {
        console.log("Verbunden mit MongoDB!")
    })
    .catch(() => {
        //statt localhost 127.0.0.1 probieren:
        console.log("Verbindung mit Mongo druch localhost lief schief! Probieren wir 127.0.0.1")
        mongoose.connect('mongodb://localhost:27017/calendo')
            .then(() => {
                console.log("Verbunden mit MongoDB!")
            })
            .catch(err => {
                console.error("Etwas lief schief mit der Datenbank:", err)
            })  
    })
}



// Middleware
app.use(express.json());  // Für JSON-Daten
app.use(express.urlencoded({ extended: true }));  // Für Formulardaten
app.use(express.static("public")); // Statische Dateien (css, js) im Ordner "public"
app.use(methodOverride('_method')); // Für PUT- und DELETE-Requests
app.use(session({secret: sessionSecret}));

app.set('view engine', 'ejs'); // EJS als View-Engine

//Variablen 
let isWrongPassword = false;
let isUserTaken = false;
let isNoMatch = false;

//Routen
// GET-Routen

//login page
app.get('/', (req, res) => {
    res.render("start", {isWrongPassword});
    isWrongPassword = false;
})

//signup page
app.get("/signup", (req, res) => {
    res.render("signup", {isUserTaken, isNoMatch})
    isUserTaken = false;
    isNoMatch = false;
})

//Homepage
app.get('/todos', async (req, res) => {
    if(!req.session.user_id){       //überprüft ob wir angemeldet sind
        return res.redirect("/");
    }

    try {
        //const todos = await Todo.find(); // Holt alles Todos aus der Datenbank
        const user = await User.findOne({_id:req.session.user_id});
        const todos = user.toDo
        let activeToDos = 0;
        for (const todo of todos) {
            if(!todo.isCompleted)
            activeToDos++;
        }
        return res.render('calendo', { todos, com: user.completetToDos, activeToDos, ttt: user.totalTimeWorked }); // Rendert die ejs-Datei "calendo" und übergibt die Todos
    } catch (err) {
        console.error(err);
        return res.status(500).send("Fehler beim finden des Users!");
    }
})

//tracks totalTimeWorked
app.get('/timeWorked/:workedTime', async (req, res) => {
    const { workedTime } = req.params;
    //console.log('Received workedTime:', workedTime);  // This will log "Received workedTime: 6"
    
    // Respond with a JSON message or any other data you need
            const updatedUser = await User.findOneAndUpdate
        (
            { _id: req.session.user_id},  // Find user
            {
                $inc: {totalTimeWorked: workedTime}
            }, 
            { new: true }
        );
        
        if(!updatedUser){
            return res.send("User nicht gefunden!");
        }
    //console.log(updatedUser.totalTimeWorked)
    //res.status(200).json({ message: `Received worked time: ${workedTime}` });
    return res.redirect('/todos');
    })

//Leaderboard
app.get("/leaderboard", async (req, res) => {
let users;
    try{
        users = await User.find({});
        users.sort((a, b) => b.totalTimeWorked - a.totalTimeWorked);
       // return res.send(users[50]);
        //users[50] = users[2];

    } catch {
        res.send("error")
    }
    return res.render('leaderboard', {users});
})
// POST-Route

//neuen User erstellen
app.post("/signup", async (req,res) => {
    const { username, password, password2} = req.body;
    //Wenn eines der Felder leer ist einfach Seite neu laden
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
    
    //Wenn der Username schon vergeben ist oder die Passwörter nicht übereinstimmen wird kein User erstellt
    if(isUserTaken||isNoMatch){ 
        return res.redirect("/signup");
    }

    const hash = await bcrypt.hash(password, 12);
    const user = new User({
        username,
        password: hash,
        /*toDo: [
            {
            name: 'Bespiel ToDo',
            duration: 30, 
            isImportant: false,
            isUrgent: false
            }
        ],*/
        completetToDos: 0

    })
    await user.save();
    req.session.user_id = user._id;
    return res.redirect("/todos")
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
        return res.redirect("/todos");
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

//neues ToDo einem User hinzufügen
app.post('/todos', async (req, res) => {
    try {
        const { name, duration, isImportant, isUrgent } = req.body; // Holt die Daten aus dem Request-Body

        // Neues Todo erstellen
        const newTodo = {
            name,
            duration: duration ? parseInt(duration) : 0, // Wenn duration nicht leer ist, dann in Integer umwandeln, sonst 0
            isImportant: isImportant === 'on', // Wenn isImportant 'on' ist, dann true, sonst false
            isUrgent: isUrgent === 'on' // Wenn isUrgent 'on' ist, dann true, sonst false
        };

        // Neues Todo dem User hinzufügen
        const updatedUser = await User.findOneAndUpdate(
            {_id:req.session.user_id},
            {$push: {toDo: newTodo}}, 
            { new: true }
        );

        if(!updatedUser){
            return res.send("User nicht gefunden!");
        }

        return res.redirect('/todos');
    } catch (err) {
        console.error(err);
        return res.status(500).send("Fehler beim Erstellen des To-Dos!");
    }
});

// PUT-Route zum Anpassen des Namen, der Dauer, der Wichtigkeit und/oder der Dringlichkeit
app.put('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, duration, isImportant, isUrgent } = req.body; // Holt die Daten aus dem Request-Body

        const updatedUser = await User.findOneAndUpdate
        (
            { _id: req.session.user_id, "toDo._id": id},  // Find user
            {
                $set:
                {
                    "toDo.$.name": name,
                    "toDo.$.duration": duration ? parseInt(duration) : 0, // Wenn duration nicht leer ist, dann in Integer umwandeln, sonst 0
                    "toDo.$.isImportant": isImportant === 'on',
                    "toDo.$.isUrgent": isUrgent === 'on'
                }
            }, 
            { new: true }
        );
        
        if(!updatedUser){
            return res.send("User oder todo nicht gefunden!");
        }
        
        return res.redirect('/todos');
    } catch (err) {
        console.error(err);
        return res.status(500).send("Fehler beim Aktualisieren des To-Dos!");
    }
});

//PUT-Route zum Anpassen des Erledigungsstatus
app.put('/todos/:id/complete', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({_id: req.session.user_id});
        if(!user){
            return res.status(500).send("Fehler beim finden des Users!");
        }

        const toDo = user.toDo.find(item => item._id == id);

        const status = toDo.isCompleted;
        const incrementValue = status ? -1 : 1;
        
        const updatedUser = await User.findOneAndUpdate(
            { _id: req.session.user_id, "toDo._id": id },
            { $set: { "toDo.$.isCompleted": !status },
             $inc: { completetToDos: incrementValue}}, 
            { new: true } // Gib das aktualisierte Dokument zurück
        );
    
        if (!updatedUser) {
            return res.status(404).send({ error: "User oder To-Do nicht gefunden" });
        }
        return res.redirect('/todos');
    } catch (err) {
        console.error(err);
        res.status(500).send("Fehler beim Aktualisieren des To-Dos!");
    }
});

// DELETE-Route
app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await User.updateOne(
            { _id: req.session.user_id },  // Find user
            { $pull: { toDo: { _id: id } } } // Remove toDo
        );
        res.redirect('/todos');
    } catch (err) {
        console.error(err);
        return res.status(500).send("Error deleting To-Do.");
    }
});


app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await User.updateOne(
            { _id: req.session.user_id },  // Find user
            { $pull: { toDo: { _id: id } } } // Remove toDo
        );
        res.redirect('/todos');
    } catch (err) {
        console.error(err);
        return res.status(500).send("Error deleting To-Do.");
    }
});
//404 Route
app.use((req, res) => {
    res.status(404).send("404 NOT FOUND!");
})

//Server starten
app.listen(port, () => {
    console.log(`Server läuft auf Port ${port}!`);
    console.log('warte auf MongoDB Verbindung...');
});