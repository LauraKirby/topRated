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

//Root Dir
app.get('/', function(req, res){
	res.redirect("searches/index");
});

// app.get('/searches/index', function(req, res){
// 	var getUrl = "http://api.yelp.com/v2/search?term=food&location=San+Francisco"
// 	yelp.search(getUrl, function(err, data){
// 		console.log(data); 
// 		res.render("searches/index");
// 	});
// });

app.get('/searches/index', function(req, res){
	yelp.search({term: "food", location: "San Francisco", limit: 1}, function(err, yelpDataJson){
		if (err){
			res.render('404'); 
			console.log(err); 
		} else {
			console.log(yelpDataJson); 
			res.render("searches/index");
		}
	});
});

//Signup
app.get('/users/signup', function(req, res){
	res.render("users/signup")
});
 
// CATCH ALL
app.get('*', function(req,res){
  res.render('404');
});

// START SERVER
app.listen(3000, function(){
  "Server is listening on port 3000";
});