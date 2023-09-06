const express = require('express');
const app = express();
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const {v4 : uuidv4} = require('uuid');


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
    console.log("listening on port no. 3000");
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
        let wrong = false;
        res.status(200).render('loginStudent.ejs',{wrong});
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
        let wrong = false;
        res.status(200).render('loginTeacher.ejs',{wrong});
    });
});

// teacher registration end <------
 

// Student login 

app.get('/studentLogin',(req,res)=>{
    let wrong = false;
    res.render('loginStudent.ejs',{wrong});
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
            let wrong = true;
            res.render('loginStudent',{wrong});
        }
    });
});


// Teacher login 

app.get('/teacherLogin',(req,res)=>{
    let wrong = false;
    res.render('loginTeacher.ejs',{wrong});
});

app.post('/TeacherLogin',(req,res)=>{
    const {username,password} = req.body;
    pool.query('SELECT fullname FROM TeacherRegistrations WHERE username = $1 AND password = $2', [username, password], function (err, result, fields) {
        if (err) throw err;
        if(result.rows.length === 1){
            let name = result.rows[0].fullname;
            console.log(name);
            res.render('homeAfter.ejs',{username});
        }else{
            let wrong = true;
            res.render('loginTeacher',{wrong});
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





let posts = [
    {   
        id : uuidv4(),
        username : 'arvind',
        content : 'hello i am arvind and i am from sirvaiya family'
    },
    {   
        id:uuidv4(),
        username : 'ankit',
        content : 'hello i am ankit and i am from patel family'
    },
    {   
        id:uuidv4(),
        username : 'jayesh',
        content : 'hello i am jayesh and i am from unde family'
    }
];


app.post('/post',(req,res)=>{
    console.log("new post addition working till post request");
    console.log(req.body);
    let {username,content}  = req.body;
    let id = uuidv4();
    posts.push({id,username,content});
    res.redirect('/posts');
})

app.get('/posts/new',(req,res)=>{
    res.render('new.ejs');
});

app.get('/posts',(req,res)=>{
    res.render('post.ejs',{posts});
});

app.get('/posts/:id',(req,res)=>{
    // console.log(req.params);
    let {id}=  req.params;
    let post = posts.find((p)=> id == p.id);
    res.render('show.ejs',{post});
});

app.get('/posts/:id/edit',(req,res)=>{
    let {id} = req.params;
    let post = posts.find((p)=> id===p.id);
    res.render('edit.ejs',{post});
});

app.patch('/posts/:id',(req,res)=>{
    let {id} = req.params;
    let newContent = req.body.content;
    let post = posts.find((p)=> id===p.id);
    post.content = newContent;
    res.redirect('/posts')
});

app.delete('/posts/:id',(req,res)=>{
    let {id} = req.params;
    posts = posts.filter((p)=> id!==p.id);
    res.redirect('/posts');
});
app.get('/loginChoice',(req,res)=>{
    let wrong = false;
    res.render('loginChoice.ejs',{wrong});
})

app.post('/loginAs',(req,res)=>{
    const {role} = req.body;
    console.log(role);
    let wrong = false;
    if(role == 'student'){
        res.render('loginStudent.ejs',{wrong});
    }else if(role=='teacher'){
        res.render('loginTeacher.ejs',{wrong});
    }else{
        wrong = true;
        res.render('loginChoice.ejs',{wrong});
    }
});
