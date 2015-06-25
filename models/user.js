var mongoose = require("mongoose"); 
var Favorite = require("./favorite"); 

var userSchema = new mongoose.Schema({
	userFirstName: String, 
	userLastName: String, 
	userImage: String, 
	email: String,
	password: String, 
	//i won't need this if i set up the routes like miles showed me for the reddit app
	// favorites:[{
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: "Favorite"
	// }]  
});

var User = mongoose.model("User", userSchema); 
module.exports = User; 