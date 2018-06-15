var express = require('express'),
    app = express(),
    engines = require('consolidate'),
    bodyParser = require('body-parser'),
    //MongoClient = require('mongodb').MongoClient,
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

// Handler for internal server errors
function errorHandler(err, req, res, next) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500).render('error_template', { error: err });
}

//MongoClient.connect('mongodb://localhost:27017/video', function(err, db) {
	connection.connect(function(err, db) {
		assert.equal(null, err);
		console.log("Successfully connected to MySQL.");

		app.get('/', function(req, res, next) {
			connection.query("SELECT * FROM contacts", function(err, rows, fields){
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
			//res.send(req.params.id);
		});

		/*app.post('/add_movie', function(req, res, next) {
			var title = req.body.title;
			var year = req.body.year;
			var imdb = req.body.imdb;

			if ((title == '') || (year == '') || (imdb == '')) {
				next('Please provide an entry for all fields.');
			} else {
				db.collection('movies').insertOne(
					{ 'title': title, 'year': year, 'imdb': imdb },
					function (err, r) {
						assert.equal(null, err);
						res.send("Document inserted with _id: " + r.insertedId);
					}
					);
			}
		});
	});*/
    
    app.use(errorHandler);
    
    var server = app.listen(3000, function() {
        var port = server.address().port;
        console.log('Express server listening on port %s.', port);
    });
    
});
