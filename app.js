// Required Modules
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const schedule = require('node-schedule');
const Push = require('node-pushover');

// Initialize App and Database
const app = express();
const db = new sqlite3.Database('./notifications.db');
const pushover = new Push({
    token: 'ag7zoznf8yugfc4fhetgczwgei4cvq',
    user: 'uciypfwyvr83bytp1u3eknmebv8a4b'
});

// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


// Create the table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY,
  label TEXT,
  content TEXT,
  time TEXT
)`, (err) => {
  if (err) {
    console.error('Error creating table:', err.message);
  } else {
    console.log('Notifications table created or already exists.');
  }
});


// ROUTES

// Home Route: Display All Notifications
app.get('/', (req, res) => {
  db.all(`SELECT * FROM notifications`, (err, rows) => {
    if (err) throw err;
    res.render('index', { notifications: rows }); // Render index.ejs
  });
});

// Add Notification Form
app.get('/add', (req, res) => {
  res.render('add'); // Render add.ejs
});

// Handle New Notification Submission
app.post('/add', (req, res) => {
  const { label, content, time } = req.body;
  db.run(`INSERT INTO notifications (label, content, time) VALUES (?, ?, ?)`, [label, content, time], (err) => {
    if (err) throw err;
    res.redirect('/'); // Redirect to home page
  });
});

// SCHEDULE EXISTING NOTIFICATIONS ON STARTUP
db.each(`SELECT * FROM notifications`, (err, row) => {
  if (err) throw err;

  const notificationTime = new Date(row.time);
  schedule.scheduleJob(notificationTime, () => {
    pushover.send(row.label, row.content, (err) => {
      if (err) console.error('Error:', err);
      else console.log('Notification sent:', row.label);
    });
  });
});

// Start Server
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});



