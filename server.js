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

function writeToDatabase(fileData) {
    const json = JSON.stringify;
    fs.writeFile('./Develop/db/db.json', json);
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'Develop/public', 'index.html'))
});

app.get('/api/get-all', (req, res) => {

});

app.post('/api/add-lead', (req, res) => {
    const newNote = {...req.body}
    
    const database = readDatabase();

    database.push(newNote);
    //console.log(newNote);

    writeToDatabase(database);

    res.json(newNote);

});

app.put('/api/update-lead/:id', (req, res) => {
    
});

app.delete('/api/delete-lead/:id', (req, res) => {
    
});

app.listen(PORT, () => {
    console.log(`🌐 listening at http://localhost:${PORT}`)
});