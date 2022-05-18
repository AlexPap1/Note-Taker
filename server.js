const express = require('express');
const path = require("path");
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(express.static("public"));

function readDatabase() {
    const fileData = fs.readFileSync('./Develop/db/db.json', 'utf-8')
    //console.log(fileData)
    return JSON.parse(fileData) || [];
}

function writeToDatabase(data) {
    const json = JSON.stringify(data, null, '\t');
    fs.writeFileSync('./Develop/db/db.json', json);
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'Develop/public', 'index.html'))
});

app.get('/api/get-all', (req, res) => {
    const database = readDatabase();
    res.json(database);
});

app.post('/api/add-lead', (req, res) => {
    const newNote = {...req.body}
    
    const database = readDatabase();

    database.push(newNote);
    //console.log(newNote);

    writeToDatabase(database);

    res.json(newNote);

});

app.put('/api/update-note/:title', (req, res) => {
    const database = readDatabase();
    for (let i = 0; i < database.length; i ++) {
        const note = database[i]

        if(note.title == req.params.title) {
            //unsure if needed
            writeToDatabase(database);
            res.status(204);
                return
        }
    }
    res.status(404).end();
});

app.delete('/api/delete-note/:title', (req, res) => {
    const database = readDatabase();
    const newData = database.filter(note => note.title != req.params.title)
    if (database.length == newData.length) {
        res.status(404).end()
        return;
    }
    writeToDatabase(newData)
    res.status(200).end();
});

app.listen(PORT, () => {
    console.log(`🌐 listening at http://localhost:${PORT}`)
});