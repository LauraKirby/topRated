var db = require("../models"); 

var routeHelpers = {
	ensureLoggedIn: function(req, res, next) {
		if(req.session.id !== null && req.session.id !== undefined){
			return next(); 
		}
		else {
			res.render('landingPage', {errorStr: "you must be must be signed up to login"}); 	 
		}
	}, 

	ensureCorrectUser: function(req, res, next) {
		db.User.findById(req.params.id, function(err, user) {
			if(user.ownerId !== req.session.id) {
				//res.render('posts/index', {errorMessage: "you must be logged in to write a post"});
				res.redirect('/'); 
			}
			else {
				return next(); 
			}
		});
	},

//Why did Tim say i don't need this?
//this won't be needed bc once login is clicked we send back a message if user is not found
	// preventLoginSignup: function(req, res, next){
	// 	if(req.session.id !== null && req.session.id !== undefined){
	// 		res.redirect('/'); 
	// 	}
	// 	else {
	// 		return next(); 
	// 	}
	// }
};

module.exports = routeHelpers; 