//standardized server const / dependencies
const express = require('express');
const path = require("path");
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(express.static("public"));

//connects server to database (reads data before making adjustments in get/post/put/delete)
function readDatabase() {
    const fileData = fs.readFileSync('./db/db.json', 'utf-8')
    //console.log(fileData)
    return JSON.parse(fileData) || [];
}

//modifies data within database (this function is called within post/put/delete -- not get b/c get sends existing data, no modifications)
function writeToDatabase(data) {
    const json = JSON.stringify(data, null, '\t');
    fs.writeFileSync('./db/db.json', json);
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, './public', 'index.html'))
});
//app.get above and below duplicated, will remove one
app.get("/notes", (req,res) => {
    res.sendFile(path.join(__dirname, './public', 'notes.html'))
});

// receives data from server
app.get('/api/get-all', (req, res) => {
    const database = readDatabase();
    res.json(database);
});

//adds new data to server
app.post('/api/add-note', (req, res) => {
    const newNote = {...req.body}
    
    const database = readDatabase();

    database.push(newNote);
    //console.log(newNote);

    writeToDatabase(database);

    res.json(newNote);

});

//updates exiting data to server (doesn't work - no activator to call put)
app.put('/api/update-note/:title', (req, res) => {
    const database = readDatabase();
    console.log(req.params.title);
    for (let i = 0; i < database.length; i ++) {
        const note = database[i]

        if(note.title == req.params.title) {
            //unsure if needed
            writeToDatabase(database);
            return res.status(204).end();
        }
    }
    res.status(404).end();
});

//deletes data from server
app.delete('/api/delete-note/:title', (req, res) => {
    const database = readDatabase();
    const newData = database.filter((note) => note.title != req.params.title)
    if (database.length == newData.length) {
        res.status(404).end()
        return;
    }
    writeToDatabase(newData)
    res.status(200).end();
});

//console log to notify localhost active
app.listen(PORT, () => {
    console.log(`🌐 listening at http://localhost:${PORT}`)
});