
const express = require('express');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();

const app = express();
const port = 3000;

const db = pgp({
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: '1234',
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    await db.none('INSERT INTO users(username, password) VALUES($1, $2)', [username, password]);
    res.status(201).send('User registered successfully.');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Error registering user.');
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);

    if (user) {
      res.status(200).send('Login successful.');
    } else {
      res.status(401).send('Invalid credentials.');
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Error logging in.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
