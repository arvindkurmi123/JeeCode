const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'jeecode',
    password: 'Jayeshsql',
    port: 5432,
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/uploadQuestion', (req, res) => {
    const { name, description, optionA, optionB, optionC, optionD, correctAnswer, difficulty, subject } = req.body;
    pool.query('INSERT INTO questions (name, description, optionA, optionB, optionC, optionD, correctAnswer, difficulty, subject) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [name, description, optionA, optionB, optionC, optionD, correctAnswer, difficulty, subject], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).send('Question uploaded successfully!');
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000.');
});
