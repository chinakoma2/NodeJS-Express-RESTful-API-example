//Initiallising node modules
const http = require('http');
const express = require('express');
var mysql = require('mysql')
var bodyParser = require("body-parser");
const app = express();

// support json encoded bodies
app.use(bodyParser.json()); 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Setting up server
const port = 3000;
const server = http.createServer(app);
server.listen(port, function () {
    console.log("App now running on port", port);
});

// Initiallising connection 
var connection = mysql.createConnection({
  host:     'localhost',
  user:     'root',
  password: '19961996',
  database: 'dbrestful'
});

// Connect to database
connection.connect( function (err) {
	if (err) { 
				throw err
				console.log("Error while connecting database :- " + err);           
             }
			 else {
					  console.log('You are now connected to database...');
		          }
});

// Function to execute query
var  executeQuery = function(result, query, msg){               
        // query to the database
        connection.query(query, function (err, res) {
            if (err) {
						throw err
                        console.log("Error while querying database :- " + err);
                        res.send(err);
                     }
                      else {
							  if(msg !== ''){
											  res =    { message : msg }; 
										    }
							  result.send(res);												
                           }
        });                    	  
}

// Function for finding a usser by id ** return 1 if the user exists in data base ,-1 if there is an error ,0 otherwise 
var  SelectQuery = function(id , callback){               
        // query to the database
        connection.query('SELECT * FROM user WHERE id = \''+id+'\'', function (err, res) {
            if (err) {
						throw err
                        console.log("Error while querying database :- " + err);
							  callback(null,-1); 						 
                     }
                      else {
							//console.log(res);
							  callback(null,res.length); 						 
                           }
        });                    	  
}


app.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'welcome in RESTful API'
    });
});

// Adding a user
app.post('/add', (req, res, next) => {	
var query = 'INSERT INTO `user`(`id`, `name`, `email`) VALUES (\'\',\''+req.body.name+'\',\''+req.body.email+'\')';
var message = 'User '+req.body.name+' successfully added in data base ...' ;
executeQuery (res, query, message);
});

// showing all users
app.get('/users', (req, res, next) => {	
var query = 'SELECT * FROM user';
	 executeQuery (res, query, '');
});

// Searching for a user by id
app.get('/users/:id', (req, res, next) => {	
var query = 'SELECT * FROM user WHERE id = \''+req.params.id+'\'';
	 executeQuery (res, query, '');
});

// Deleting a user by id
app.delete('/delete/:id', (req, res, next) => {	
	var query = 'DELETE FROM `user` WHERE id = \''+req.params.id+'\'';
	var message = 'User '+req.params.id+' successfully deleted from data base ...' ;
	SelectQuery(req.params.id, function(err,result){
		if ( result > 0 ){
			executeQuery (res, query, message);
		}
		else {
			res.status(200).json({
				message: 'No user have id = '+req.params.id
			});
		}	
	});
});

// Updating user email using id
app.patch('/updatemail/:id/:email', (req, res, next) => {
	var query = 'UPDATE `user` SET `email`=\''+req.params.email+'\' WHERE id = \''+req.params.id+'\'';
	var message = 'User '+req.params.id+' email is successfully updateded ...' ;
	SelectQuery(req.params.id, function(err,result){
		if ( result > 0 ){
			executeQuery (res, query, message);
		}
		else {
			res.status(200).json({
				message: 'No user have id = '+req.params.id
			});
		}	
	});
});