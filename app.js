var express = require("express"), 
	app = express(), 
	dotenv = require("dotenv").load(), 
	bodyParser = require("body-parser"), 
	methodOverride = require("method-override"), 
	db = require("./models"),
	session = require("cookie-session"), 
	loginMiddleware = require("./middleware/loginHelper"), 
	routeMiddleware = require("./middleware/routeHelper"), 
	morgan = require("morgan");

app.use(morgan('tiny'));
app.set('view engine', 'ejs'); 
app.use(methodOverride('_method')); 
app.use(express.static(__dirname + '/public')); 
app.use(bodyParser.urlencoded({extended:true})); 
app.use(loginMiddleware);

var yelp = require("yelp").createClient({
	consumer_key: process.env.CONSUMER_KEY,  
	consumer_secret: process.env.CONSUMER_SECRET, 
	token: process.env.TOKEN,  
	token_secret: process.env.TOKEN_SECRET 
}); 

app.use(session({
	maxAge: 360000, 
	secret: 'whoknows',
	name: "tcho chocolate"
}));

app.use(loginMiddleware);


//Root Dir & landing page
app.get('/', function(req, res){ //do not need routeMiddleware.preventLoginSignup bc the only login is a POST, user will be authenticated (or not) at this point
	//need to add logic for object
	var myObj = {errorStr: undefined};
	res.render("landingPage", myObj);
});

//----------- USER ROUTES -------------------//
//Login
app.post('/login', function(req, res) { //do not need middleware bc of authenticate
	db.User.authenticate(req.body.user, 
		function(err, user){
			if (err) {
				res.render("landingPage", {errorStr: err}); 
			} else if(!err && user !== null) {
				req.login(user); 
				res.redirect("/users/" + user._id); //here we are stating that it is clearly a mongo id
			} else {
				res.render("landingPage", {errorStr: "Error: Could not authenticate"}); 
			}
	});
});

//Signup - show sign up form
app.get('/signup', function(req, res){
	res.render("users/signup")
});

//CREATE User -- Send data to server 
app.post('/signup', function(req, res){ //does the route name really matter (other than it needs to match the button so it is accessed) since we are redirecting? 
	//maybe the route matters in terms of REST? 
	var newUser = req.body.user; //"user" is from ejs
	db.User.create(newUser, function(err, savedUser){ //savedUser refers to the new user created and saved. save has a callback function with (err and newUser)
		//create saves to database
		//savedUser is what gets created from the save function (save function is within the create function)
		if (err) {
			console.log(err);
		} else if (savedUser){
			req.login(savedUser); //user is now logged in, we have access to req.session.id
			res.redirect('/users/' + req.session.id)
		} 													
		else {
			console.log("something else happend")
		}
	});
});

//SHOW User - Profile Page
app.get('/users/:id', routeMiddleware.ensureLoggedIn, function(req, res){
	db.User.findById(req.params.id, function(err, oneUser){
		if (err) throw err;
		res.render('users/show', {oneUser:oneUser, id: req.session.id}); 
	});
});

//EDIT User 
app.get('/users/:id/edit', routeMiddleware.ensureLoggedIn, function(req, res){
	db.User.findById(req.params.id, 
		function(err, user){
			console.log(req.session.id)
			res.render("users/edit", {user:user, id: req.session.id})
		});
});

//UPDATE	User
app.put('/users/:id', routeMiddleware.ensureLoggedIn, function(req, res){
	db.User.findByIdAndUpdate(req.params.id, req.body.user, function(err, user){
		if(err){
			if (err)throw err; 
		} else {
			res.redirect("/users/" + req.session.id)
		}
	});
});

//LOGOUT
app.get('/users/:id/logout', function(req, res){
	req.logout(); 
	res.redirect("/"); 
});


//------------------- YELP ROUTES -------------------------------//

//Search
app.get('/users/:id/search', routeMiddleware.ensureLoggedIn, function(req, res){
	var term = req.query.term;
	yelp.search({
		term: term, 
		location: req.query.location, 
		limit: 10 
	}, 
		function(err, results){
			if (err) {
				console.log(err); 
			} else {
				userData = db.User.findById(req.session.id, function(err, foundUser){
					console.log(foundUser); 
				})
			}
			//console.log(results)
			//res.send(results)
			var data = "hello"
			console.log("first item from yelp API returned: " + results.businesses[0].name)
			res.render("search/results", {results:results, term:term, id:req.session.id, data:userData});
		});
});

//use .sort to put number of reviews from higher to lower


//---------------- Favorites -------------------------//


//INDEX -- Click "Favorites in Menu Bar" -- See all Favorites
app.get('/users/:id/favorites', routeMiddleware.ensureLoggedIn, function(req, res){
	db.User.findById(req.params.id).exec(function(err, user){
		if (err) throw err;
		db.Favorite.find({user: req.params.id}, 
			function(err, favoritesByUserId){
				if (err) throw err; 
				user.favorites = favoritesByUserId;
				res.render('favorites/index', {user:user, id:req.session.id})
		});
	});
});

//CREATE favorite from results page
// app.post('/users/:id/favorites', routeMiddleware.ensureLoggedIn, function (req, res){
// 	var newFav = req.body.business 
// 	db.Favorite.create({user: req.params.id, favName: newFav.name}, 
// 		function(err, savedFav){
// 			if (err){
// 				console.log(err)
// 			} else {
// 				res.redirect('/users/' + req.session.id + '/favorites');
// 				//res.send(savedFav) //will need to add res.format (3 types)
// 			} 
// 	});
// });

//CREATE favorite from AJAX in searches.js and form in results.ejs page 
app.post('/users/:user_id/favorites', function (req, res){
	var favData = req.body.fav
	db.User.create(
	{
		user: req.params.user_id, 
		favAddress: favData.address, 
		favReviewCount: favData.reviewCount
	}, 
		function (err, savedFav){
			//  if (err) thow err
			if (err) {
				console.log("savedFav ERROR" + err) 
			} else {
				res.json({savedFav:savedFav}); 
			}
		});
}); 


 



// CATCH ALL
app.get('*', function(req,res){
  res.render('errors/404');
});

// START SERVER
app.listen(3000, function(){
  "Server is listening on port 3000";
});

