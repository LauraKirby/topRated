var db = require("../models"); 

var routeHelpers = {
	ensureLoggedIn: function(req, res, next) {
		if(req.session.id !== null && req.session.id !== undefined){
			return next(); 
		}
		else {
			//how can i change the url to not having any additional info, 
			//don't think that i can due a redirect with an object
			res.render('landingPage', {errorStr: "you must be must be signed up to login"}); 	 
		}
	}, 

//to do - add authority check at edit profile
	ensureCorrectUser: function(req, res, next) {
		db.User.findById(req.params.id, function(err, user) {
			if(user.ownerId !== req.session.id) {
				//res.render('users/show', {errorMessage: "you do not have authority, discuss permissions with account admin"});
				res.redirect('/'); 
			}
			else {
				return next(); 
			}
		});
	},

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