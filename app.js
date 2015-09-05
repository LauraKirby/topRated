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
	userFavs = require("./getUserFavs");

app.use(morgan('tiny'));
app.set('view engine', 'ejs'); 
app.use(methodOverride('_method')); 
app.use(express.static(__dirname + '/public')); 
app.use(bodyParser.urlencoded({extended:true})); 
app.use(loginMiddleware);
app.use(userFavs);

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
	var pic = "images/getsmitten.jpg";
	res.render("landingPage", {errorStr: undefined, pic:pic});
});

//----------- USER ROUTES -------------------//
//Login
app.post('/login', function(req, res) { //do not need middleware bc of authenticate
	db.User.authenticate(req.body.user, 
		function(err, user){
			if (err) {
				res.render("landingPage", {errorStr: err}); 
			} else if(!err && user !== null) {
				if (user.userImage === null) {
					newUser.userImage = "public/images/user-default.png";
				}
				req.login(user); 
				res.redirect("/users/" + user._id); //here we are stating that it is clearly a mongo id - should i update to a session id
			} else {
				res.render("landingPage", {errorStr: "Error: Could not authenticate"}); 
			}
	});
});

//Signup - show sign up form
app.get('/signup', function(req, res){
	var signUpPic = "images/Robyn_Smitten.jpeg";
	res.render("users/signup", {signUpPic:signUpPic});
});

//CREATE User -- Send data to server 
app.post('/signup', function(req, res){ 
	var newUser = req.body.user; //"user" is from ejs
	db.User.create(newUser, function(err, savedUser){ //savedUser refers to the new user created and saved. save has a callback function with (err and newUser)
		//create saves to database
		//savedUser is what gets created from the save function (save function is within the create function)
		if (err) {
			console.log(err);
		} else if (savedUser){
			if(newUser.userImage === null){
				newUser.userImage = "public/images/user-default.png";
			}
			req.login(savedUser); //user is now logged in, we have access to req.session.id
			res.redirect('/users/' + req.session.id);
		} 													
		else {
			console.log("something else happend");
		}
	});
});

//------------------- USER SHOW - Profile Page -------------------------------//
app.get('/users/:user_id', routeMiddleware.ensureLoggedIn, function(req, res){
	//within User collection, find a user with user_id and store to oneUser
	//ensure user exists
	db.User.findById(req.params.user_id, function(err, oneUser){
		if (err) throw err;
		//within Favorite collection, find key 'user' with property value of 'req.params.user_id'
		db.Favorite.find({user: req.params.user_id}, 
			//return favorites in an array and save to 'favoritesByUserId'
			function(err, favoritesByUserId) {
				if (err) throw err;
				//where is the empty array 'favorites' coming from
				//adding a property to our object. this property will only be available for the scope of this function.
				//the favorites property will create an association on the user, to access the favorites
				oneUser.favorites = favoritesByUserId;
				//console.log(favoritesByUserId);
				//console.log("one favorite ", oneUser.favorites[0]);
				db.Comment.find({user: req.params.user_id},
					function(err, commentsByUserId) {
						if (err) {
							console.log(err); 
							res.render("errors/404");
						}
						else {
							oneUser.favorites.forEach(function(favorite) {
								commentsByUserId.forEach(function(comment) {
									if (favorite.yelpBusId === comment.busId) {
										favorite.comment = comment.content;
									}
								});
							});
						res.render('users/show', {oneUser:oneUser, id:req.session.id});
					}
				});
			});
	});
});

//------------------- USER EDIT -------------------------------//
app.get('/users/:user_id/edit', routeMiddleware.ensureLoggedIn, function(req, res){
	db.User.findById(req.params.user_id, 
		function(err, user){
			// console.log(req.session.id);
			res.render("users/edit", {user:user, id: req.session.id});
		});
});

//UPDATE	User
app.put('/users/:user_id', routeMiddleware.ensureLoggedIn, function(req, res){
	db.User.findByIdAndUpdate(req.params.user_id, req.body.user, function(err, user){
		if(err){
			if (err)throw err; 
		} else {
			res.redirect("/users/" + req.session.id);
		}
	});
});

//LOGOUT
app.get('/users/:user_id/logout', function(req, res){
	req.logout(); 
	res.redirect("/"); 
});


//------------------- YELP SEARCH & RESULTS -------------------------------//

//Search
app.get('/users/:user_id/search', routeMiddleware.ensureLoggedIn, function(req, res){
	var term = req.query.term;
	yelp.search({
		term: term, 
		location: req.query.location, 
		limit: 10 
	}, 
	//find all where user_id == comments.user_id && comment.businessId == yelp.businessId
	function(err, results){
		if (err) {
			console.log(err); 
			res.render("errors/404");
		} else {
			db.User.findById(req.session.id, function(err, foundUser){ //foundUser is an object
				if (err) {
					console.log(err); 
					res.render("errors/404");
				} else {
					// CALL FIND USER FAVS 
					// maybe all i really wanted was more middleware similar to loginHelper?
					app.get("/getUserFavs/");
					var favs = findFavsForResults({user: req.params.user_id}, results, function(resultsDataArg){
						console.log(resultsDataArg);
						res.render("search/results", {results:results, foundUser:foundUser, term:term, id:req.session.id, favs:favs});
					});

				} // else find user 
			}); // db.User.findById(.. {..
		} // else results 
   } // search callback, params
  ); // search params
}); // app.get

// ---------------- REMOVED FIND USER FAVS (see getUserFavs.js) ----------------
function findFavsForResults(paramsUserId, results, annonFunc){
	var trueArr = [];
	db.Favorite.find(paramsUserId, 
		function(err, favoritesByUserId) {
			if (err) {
				console.log(err); 
				//res.render("errors/404");
			} else {
				results.businesses.forEach(function(business){
					business.isFavorited = false; 
					favoritesByUserId.forEach(function(favorite){
						if (business.id === favorite.yelpBusId){
							business.isFavorited = true; 
							//trueArr.push(business.id);
						} 
					});
				});
		  } // end lse favoritesByUserId
		  annonFunc(results);
		return results;
	 }
	); // end db.Favorite.find(.. {..
}

// function resRender(route, data) {
// 	res.render(route, data); 
// }

// function findCommsForResults(paramsUserId, results){
// 	db.Comment.find(paramsUserId, 
// 	//question: can i search by session id only? would be safer, so you not just any number can be typed in? 
// 	//answer: you should be checking for 'is logged in' at the route, thus if someone types in a random number they cannot access someone else's data
// 	//ansser: you could search by {user: req.params.user_id} but then you wouldn't need user_id in your route, and then your route wouldn't be restful
// 		function(err, commentsByUserId) {
// 			if(err){
// 				console.log(err); 
// 				//res.render("errors/404");
// 			  } 
// 			  else {
// 			  	results.businesses.forEach(function(business) {
// 			  		commentsByUserId.forEach(function(comment) {
// 			  			if (business.id === comment.busId) {
// 			  				business.comment = comment.content;
// 			  			}
// 			  		});
// 			  	});
// 			  	//res.render("search/results", {results:results, foundUser:foundUser, term:term, id:req.session.id});
// 			 } //end else commentsByUserId
// 			 return commentsByUserId;
// 			}
// 		);

// }




//---------------- Favorites -------------------------//

//INDEX -- Click "Favorites in Menu Bar" -- See all Favorites
app.get('/users/:user_id/favorites', routeMiddleware.ensureLoggedIn, function(req, res){
	db.User.findById(req.params.user_id).exec(function(err, user){
		if (err) throw err;
		//user below refers to the key within the Favorite model
		db.Favorite.find({user: req.params.user_id}, //can i do, find by id and just use req.params.user_id so that i get the entire object. i want access to user.name
			function(err, favoritesByUserId){
				if (err) throw err; 
				user.favorites = favoritesByUserId;
				console.log(user.favorites[0]); //why doesn't fav have favImage or reivew count?
				res.render('favorites/index', {user:user, id:req.session.id});
		});
	});
});

//CREATE favorite from AJAX
app.post('/users/:user_id/favorites', routeMiddleware.ensureLoggedIn, function (req, res){
	var favDataObj = req.body.fav;
	db.Favorite.create(favDataObj,
		function (err, savedFav){
			if (err) {
				console.log("savedFav ERROR" + err);
			} else {
				res.json({savedFav:savedFav}); 
				console.log("this is the saved fav" + savedFav);
			}
		});
}); 

//COMMENT - create comment from users/:user_id/search
app.post('/users/:user_id/comments', function (req, res){
	var commDataObj = req.body.comm;
	db.Comment.create(commDataObj, 
		function(err, savedComm){
			if (err){
				console.log("saved ERROR" + err); 
			} else {
				res.json({savedComm:savedComm}); 
				console.log("this is the saved comment" + savedComm);
			}
	 });
}); 
 

// CATCH ALL
app.get('*', function(req,res){
  res.render('errors/404');
});

// START SERVER
app.listen(process.env.PORT || 3000, function(){
  "Server is listening";
});


 
/* 
TO DO: 
view more - results - results.ejs 
implement user authority - app.js
fix err with url not clearing data
if favorite is clicked again, it will be removed from user's favorites
if click comment, leave comment field blank, then click save, 'comment' button should reappear
*/



