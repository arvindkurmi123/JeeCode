const express = require('express');
const app = express();
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
// define a port where we will run the application
let port = 3000;

// path settings
const path = require("path");
// add default paths to use ejs
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));

// public path
app.use(express.static(path.join(__dirname,'/public')));

// connecting to database
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'jeecode',
    password: 'password',
    port: 5432,
});

// to parse the post requests
app.use(express.urlencoded({express:true}));
app.use(express.json());
app.use(bodyParser.json());

// override with post having    ?_method=PATCH
app.use(methodOverride('_method'));

// add request listener
app.listen(port,()=>{
    console.log("listening on port no. 8080");
});

// testing 
app.get("/apple",(req,res)=>{
    res.send("this is apple reqest");
});
app.get("/",(req,res)=>{
    res.render("homeBefore.ejs");
});

// student register request getting  ----> start

app.get('/studentRegister',(req,res)=>{
    res.render('studentRegister.ejs');
});

app.post('/StudentRegistered',(req,res)=>{
    const {fullname, email, username, password} = req.body;
    pool.query(`INSERT INTO StudentRegistrations (fullname,email,username,password) VALUES ('${fullname}', '${email}', '${username}', '${password}')`, (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).render('homeBefore.ejs');
    });
});

// student registration end <------


// teacher register request getting  ----> start

app.get('/teacherRegister',(req,res)=>{
    res.render('teacherRegister.ejs');
});

app.post('/TeacherRegistered',(req,res)=>{
    const {fullname, email,experience, gradYear, username, password} = req.body;
    console.log(`('${fullname}', '${email}',${experience},${gradYear},'${username}', '${password}')`);
    pool.query(`INSERT INTO TeacherRegistrations (fullname,email,experience,gradYear,username,password) VALUES ('${fullname}', '${email}',${experience},${gradYear}, '${username}', '${password}')`, (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).render('homeBefore.ejs');
    });
});

// teacher registration end <------


// Student login 

app.get('/studentLogin',(req,res)=>{
    res.render('loginStudent.ejs');
});

app.post('/StudentLogin',(req,res)=>{
    const {username,password} = req.body;
    pool.query('SELECT fullname FROM StudentRegistrations WHERE username = $1 AND password = $2', [username, password], function (err, result, fields) {
        if (err) throw err;
        if(result.rows.length === 1){
            let name = result.rows[0].fullname;
            console.log(name);
            res.render('homeAfter.ejs',{username});
        }else{
            let wrong = 'wrong credentials';
            res.render('loginStudent',{wrong});
        }
    });
});



// upload question

app.get('/uploadQuestion',(req,res)=>{
    res.render('uploadQuestion.ejs');
});

// abhi iski table banana bacha hai to error aayegi


app.post('/UploadQuestion', (req, res) => {
    console.log(req.body);
    const { name, description, optionA, optionB, optionC, optionD, correctAnswer, difficulty, subject } = req.body;
    // console.log(`("${name}", "${description}", "${optionA}", "${optionB}", "${optionC}", "${optionD}", "${correctAnswer}", "${difficulty}", "${subject}")`);
    pool.query(`INSERT INTO questions (name, description, optionA, optionB, optionC, optionD, correctAnswer, difficulty, subject) VALUES ('${name}', '${description}', '${optionA}', '${optionB}', '${optionC}', '${optionD}', '${correctAnswer}', '${difficulty}', '${subject}')`, (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).send(`Question uploaded successfully! </br> Back to home <a href="http://localhost:3000">back</a>`);
    });
});

