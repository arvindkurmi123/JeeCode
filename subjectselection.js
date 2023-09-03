// server.js
const express = require('express');
const { Client } = require('pg');

const app = express();
const port = 3000;

app.use(express.static(__dirname)); // to serve static files

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'jeecode',
    password: 'Jayeshsql',
    port: 5432,
});
client.connect();
app.get('/getQuestionById/:id', async (req, res) => {
    const questionId = req.params.id;
    try {
        const result = await client.query('SELECT * FROM questions WHERE id = $1', [questionId]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Question not found.');
        }
    } catch (err) {
        res.status(500).send('Error fetching question.');
    }
});

app.get('/questions/:subject', async (req, res) => {
    const subject = req.params.subject;
    try {
        const result = await client.query('SELECT * FROM questions WHERE subject = $1', [subject]);
        let html = `<h2>${subject.charAt(0).toUpperCase() + subject.slice(1)} Questions:</h2>`;
        result.rows.forEach(question => {
            html += `<div class="question-card">
            <a href="/practicePage.html?questionId=${question.id}">${question.name}</a>
            <br>
                        <span class="difficulty">Difficulty: ${question.difficulty}</span>
                    </div>`;
        });
        res.send(`
            <html>
                <head>
                    <link rel="stylesheet" type="text/css" href="/questionpage.css">
                </head>
                <body>
                    ${html}
                </body>
            </html>
        `);
    } catch (err) {
        res.status(500).send('Error fetching questions.');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
