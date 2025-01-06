const Push = require('node-pushover');

const pushover = new Push({
  token: 'ag7zoznf8yugfc4fhetgczwgei4cvq',
  user: 'uciypfwyvr83bytp1u3eknmebv8a4b'
});

pushover.send('Test Notification', 'This is a test message', (err, response) => {
  if (err) console.error('Error:', err);
  else console.log('Notification sent:', response);
});
