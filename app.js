var express = require('express'),
app = express(),
engines = require('consolidate'),
bodyParser = require('body-parser'),
mysql = require('mysql'),
assert = require('assert');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '123456',
	database : 'phoneBook'
});

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true })); 

function errorHandler(err, req, res, next) {
	console.error(err.message);
	console.error(err.stack);
	res.status(500).render('error_template', { error: err });
}

connection.connect(function(err, db) {
	assert.equal(null, err);
	console.log("Successfully connected to MySQL.");

	app.get('/', function(req, res, next) {
		connection.query("SELECT * FROM contacts ORDER BY name_last, name_first", function(err, rows, fields){
			if(err){
				console.log('query problems');	
			} else {
				res.render('contacts_index', {rows: rows});
			}
		});
	});

	app.get('/contactinfo/:id', function(req, res, next) {
		console.log(req.params);
		connection.query("SELECT * FROM contacts WHERE id = " +  req.params.id, function(err, rows, fields){
			if(err){
				console.log('query problems');	
			} else {
				res.render('contact_info', {contact: rows[0]});
			}
		});
	});

	app.get('/addcontact/', function(req, res, next) {
		res.render('contact_add');
	});

	app.post('/savecontact/', function(req, res, next) {
		var query = "INSERT INTO contacts (name_first, name_last, phone_number) VALUES ('" + req.body.firstname + "', '" + req.body.lastname + "', '" + req.body.phonenumber +  "')";
		console.log(query);
		connection.query(query , function(err, rows, fields){
			if(err){
				console.log('query problems');	
			} else {
				connection.query("SELECT * FROM contacts ORDER BY name_last, name_first", function(err, rows, fields){
					if(err){
						console.log('query problems');	
					} else {
						res.redirect('/');
					}
				});
			}
		});
	});


	app.get('/deletecontact/:id', function(req, res, next) {
		var query = "DELETE FROM contacts WHERE id = " +  req.params.id;
		console.log(query);
		connection.query(query , function(err, rows, fields){
			if(err){
				console.log('query problems');	
			} else {
				connection.query("SELECT * FROM contacts ORDER BY name_first, name_first", function(err, rows, fields){
					if(err){
						console.log('query problems');	
					} else {
						res.redirect('/');
					}
				});
			}
		});
	});


	app.use(errorHandler);

	var server = app.listen(3000, function() {
		var port = server.address().port;
		console.log('Express server listening on port %s.', port);
	});

});
