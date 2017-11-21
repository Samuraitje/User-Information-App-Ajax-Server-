const express = require("express");
const app = express();
const fs = require('fs');
const bodyParser = require("body-parser");
app.use(express.static('public'));
app.use(bodyParser.urlencoded());
app.set('view engine', 'pug');

//Home page route
app.get('/', (req, res) => {
	res.render('index', {
		title: 'Home'
	}); 
});

app.get('/users', (req, res) => {
		fs.readFile("allusers.json", (err, userData) => {
			if (err) {
				console.log('File not found!');
			}
			let parsedData = JSON.parse(userData);
			data = parsedData;
		res.render('users', {
			title: 'Users',
			data: data
		});
	});
});		

app.get('/search', (req, res) => {
	res.render('search', {
		title: 'Search Bar',
		searchResult: []
	});
});

app.post('/search', (req, res) => {
	fs.readFile("allusers.json", (err, userData) => {
		if (err) {
			console.log('File not found!')
		}
		let parsedData = JSON.parse(userData);
		let searchResult = [];
		parsedData.forEach(function(user){
			if (user.firstname.toLowerCase() === req.body.search.toLowerCase() || user.lastname.toLowerCase() === req.body.search.toLowerCase()) {
				searchResult.push(user);
			}
		});
		res.render('search', {
		title: 'results',
		searchResult: searchResult
	});
	});
});

app.post('/search', (req, res) => {
	let suggest = req.body.suggest;
	console.log(suggest);
		fs.readFile('allusers.json', function(err, data){
			if (err) {
				console.log("This file cannot be read.")
			}
		})

		let parsedData = JSON.parse(data);
		let searchResult = [];
		console.log(searchResult);
		for (i = 0; i < parsedData.length; ++i) {
			if (parsedData[i].firstname.slice(0, suggest.length) === suggest || parsedData[i].lastname.slice(0, suggest.length) === suggest || parsedData[i].email.slice(0, suggest.length) === suggest){
				searchResult.push(users[i].firstname + " " + user[i].lastname);
			};
			res.json({status: 200, finder: searchResults})
		};
});

app.get('/adduser', (req, res) => {
	res.render('adduser', {
		title: 'Add User'
	});
});

app.post('/adduser', (req, res) => {
	fs.readFile("allusers.json", (err, userData) => {
		if (err) {
			console.log('File not found!');
		}
		let userFile = JSON.parse(userData);
  		userFile.push({ firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email }); 
  		fs.writeFile("allusers.json", JSON.stringify(userFile), function(err){
    		if (err) throw err;
    	console.log('The data was appended to file!');
    	res.redirect('/users');
	   	});
	});
});

//Initiated a local server on port 4000
app.listen(4000, () => {
    console.log('listening');
});
