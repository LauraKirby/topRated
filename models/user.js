var mongoose = require("mongoose"); 
var Favorite = require("./favorite"); 

var userSchema = new mongoose.Schema({
	name: String, 
	email: Number,
	password: String, 
	//i won't need this if i set up the routes like miles showed me for the reddit app
	// comments:[{
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: "Comment"
	// }]  
});

var User = mongoose.model("User", resultSchema); 
module.exports = User; 