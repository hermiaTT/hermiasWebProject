//import all node modules
var express = require('express');
var http = require('http');
var mysql = require('mysql');
var bodyParser = require('body-parser');

var app =express();

//parser all form data
app.use(bodyParser.urlencoded({extended:true}));

//formating dates, install dateFormat if needed
// var dateFormat = require('dateformat');
// var now = new Date();

//view engine
app.set('view engine','ejs');

//import all related js and css file
app.use('/js',express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js',express.static(__dirname + '/node_modules/tether/dist/js'));
app.use('/js',express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css',express.static(__dirname + '/node_modules/bootstrap/dist/css'));

//database connection
const mysqlConnection = mysql.createConnection({
    host: '34.69.36.143',
    port:  3306,
    user: "remote_user",
    password:"123",
    database:"asn3DB"
});

mysqlConnection.connect((err)=>{
    if(!!err){
        console.log('There is error with connection');
    }
    else{
        console.log('connect to database');
    }
});

//the homepage setting
const siteTitle = "My application";
const baseURL = "http://localhost:3000/";

//get function
app.get('/',(req,res)=>{
    mysqlConnection.query("SELECT * FROM User ",(err,result)=>{
        res.render('pages/index',{
            siteTitle: siteTitle,
            pageTitle: "Assignment 3/4",
            items: result
        });
    });
});

//Add new user
app.get('/user/add',(req,res)=>{
        res.render('pages/addUser.ejs',{
            siteTitle: siteTitle,
            pageTitle: "Add new user",
            items: ''
        });
});

//post after user submit
app.post('/user/add',(req,res)=>{
    var query =  "INSERT INTO `User`(Name,Email,Age) VALUES(";
        query += " '"+req.body.Name + "',"; 
        query += " '"+req.body.Email + "',"; 
        query += " '"+req.body.Age + "')"; 

    mysqlConnection.query(query,(err,result)=>{
        res.redirect('/');
    });
});

//edit user
app.get('/user/edit/:id',(req,res)=>{
    mysqlConnection.query("SELECT * FROM User WHERE UserID = '"+ req.params.id + "'",(err,result)=>{
        res.render('pages/editUser.ejs',{
            siteTitle: siteTitle,
            pageTitle: "Editing User: "+ result[0].Name,
            item: result
        });
    });
});

//post edit
app.post('/user/edit/:id',(req,res)=>{
    var query =  "UPDATE `User` SET";
        query += "`Name` = '"+req.body.Name + "',"; 
        query += "`Email`= '"+req.body.Email + "',"; 
        query += "`Age` = '"+req.body.Age + "'";
        query += "WHERE `User`.`UserID` = " +req.body.UserID +"";
        
    mysqlConnection.query(query,(err,result)=>{
        if(result.affectedRows){
            res.redirect('/');
        }
    });
});

//delete user from mysql

//get
app.get('/user/delete/:id', (req,res)=>{

    mysqlConnection.query("DELETE FROM User WHERE UserID = '" + req.params.id +"'",(err,result)=>{
        if(result.affectedRows){
            res.redirect('/');
        }
    });
});

app.get('/display',(req,res)=>{
    mysqlConnection.query("SELECT * FROM User ",(err,result)=>{
        res.render('pages/display.ejs',{
            siteTitle: siteTitle,
            pageTitle: "Displaying all users",
            items: result
        });
    });
});

//connect to a server
var server = app.listen(3000,()=>{
    console.log("server is listening on 3000...")
});
