const express = require("express");
const app = express();
const fs = require('fs');
const bodyParser = require("body-parser");
app.use(express.static('public'));
app.use(bodyParser.urlencoded());
app.set('view engine', 'pug');

/*--------------------------------------Home page route-----------------------------------------*/

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

/*-------------------------------------Search page route-----------------------------------------*/

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
		if (req.body.search) {
			search = req.body.search.toLowerCase()
			parsedData.forEach(function(user){
				if (user.firstname.toLowerCase() === search || user.lastname.toLowerCase() === search) {
					searchResult.push(user);
				}
			});
		}
		res.render('search', {
		title: 'Search',
		searchResult: searchResult
		});
	});
});

/*-----------------------------Search page (suggestion) route-----------------------------------*/
//Part 1: Modify your form so that every time the user enters a key, it makes an AJAX call that populates the search results.

app.post('/suggestion', (req, res) => {						//Post request route for the autocomplete suggestions into the search bar.
	fs.readFile("allusers.json", (err, userData) => {		//Reads the JSON file allusers.json.
		if (err) {
			console.log('File not found!')					
		}
		let parsedData = JSON.parse(userData);				//Parsing the JSON file.
		let searchResult = [];								//Declaring an empty array to store up the suggestion results.
		if (req.body.input) {								//If statement that will loop through each element and compares the user input with the allusers.json elements.
			input = req.body.input.toLowerCase()
			parsedData.forEach(function(user){
				if (user.firstname.slice(0, input.length).toLowerCase() === input || user.lastname.slice(0, input.length).toLowerCase() === input) {
					searchResult.push(user);				//Each key value of the user input will be compared with the keys firstname or lastname by using the slice method, which essentially selects a given starting argument and ending argument of the selection, in this case the index 0 and the length of the input.
				}
			});
		} 
		res.status(200).json({								//res.json() sends a JSON response including a stringified version of the searchResult. Including the statuscode 200 (success).
			searchResult: searchResult
		});
	});
});

/*--------------------------------------Add user route------------------------------------------*/

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

//Initiated a local server on port 3000
app.listen(3000, () => {
	console.log('listening port 3000');
});