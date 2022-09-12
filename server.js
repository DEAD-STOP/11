const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const uuid = require('./helpers/uuid');

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended : true}));
app.use(express.static('public'));

const readDb = util.promisify(fs.readFile);
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );
const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        writeToFile(file, parsedData);
      }
    });
  };

  app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))

);

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request for db`);
    readDb('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

app.post('/api/notes', (req, res) => {
    // route to db
    // req will contain:
    /* {
            title:
            text:
        } */ 
    console.info(`${req.method} request for db`);
    let { title, text } = req.body;
    if (title && text) {

        const newNote = {
            title,
            text,
            id: uuid(),
          };
          readAndAppend(newNote, './db/db.json');
          res.json(``);
    } else {
        console.error("Something's missing.")
    }
});

app.delete('/api/notes/:id', (req, res) => {
    res.json(id);
});

app.listen(PORT, () => {
    console.log(`Listening to PORT ${PORT}.`);
});