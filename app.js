var express = require("express"), 
	app = express(), 
	dotenv = require("dotenv").load(), 
	bodyParser = require("body-parser"), 
	methodOverride = require("method-override"), 
	db = require("./models"),
	session = require("cookie-session"), 
//	loginMiddleware = require("./middleware/loginHelper"), 
//	routeMiddleware = require("./middleware/routeHelper"), 
	morgan = require("morgan");

app.use(morgan('tiny'));
app.set('view engine', 'ejs'); 
app.use(methodOverride('_method')); 
app.use(express.static(__dirname + '/public')); 
app.use(bodyParser.urlencoded({extended:true})); 
//app.use(loginMiddleware);

//passport oauth yelp
var yelp = require("yelp").createClient({
	consumer_key: process.env.CONSUMER_KEY,  
	consumer_secret: process.env.CONSUMER_SECRET, 
	token: process.env.TOKEN,  
	token_secret: process.env.TOKEN_SECRET 
}); 

//--------Create Search Routes-----------//

//Root Dir & landing page
app.get('/', function(req, res){
	res.render("landingPage");
});

//Search
app.get('/search', function(req, res){
	yelp.search({
		term: req.query.term, 
		location: req.query.location, 
		limit: req.query.limit 
	}, 
		function(err, yelpData){
			if (err) throw err;
			console.log(yelpData)
			//console.log("req.query is " + req.query.location)
			//console.log("yelpDataJson.region.span.latitude_delta is " + yelpData.region.span.latitude_delta)
			var resultBusinesses = yelpData.businesses[0].name;
			console.log("Testing Business " + resultBusinesses);
			res.render("search/results", {yelpData:yelpData});
		});

});

//POST favorite
//business id
//user id

//Signup - show sign up form
app.get('/signup', function(req, res){
	res.render("users/signup")
});


//Profile Page - one user - users/index
app.get('/users/:id/profile', function(req, res){
	db.User.findById(req.params.id, function(err, oneUser){
		if (err) throw err;
		res.render('users/show', {oneUser:oneUser}); 

	});
});
 
//CREATE -- Send data to server 
app.post('/users', function(req, res){
	newUser = req.body.user; //"user" is from ejs
	db.User.create(newUser, function(err, userData){
		//create saves to database
		//userData is what gets created from the save function (save function is within the create function)
		if (err) {
			console.log(err);
		}
		res.redirect("/users/" + userData.id + "/profile")
	})
});


// CATCH ALL
app.get('*', function(req,res){
  res.render('errors/404');
});

// START SERVER
app.listen(3000, function(){
  "Server is listening on port 3000";
});

