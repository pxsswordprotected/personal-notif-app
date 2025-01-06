const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database('./notifications.db');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

db.run(`CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY,
  label TEXT,
  content TEXT,
  time TEXT
)`);

app.listen(3000, () => console.log('Server running at http://localhost:3000'));

app.get('/', (req, res) => {
    db.all(`SELECT * FROM notifications`, (err, rows) => {
      if (err) throw err;
      res.render('index', { notifications: rows });
    });
  });
  