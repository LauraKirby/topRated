var mongoose = require("mongoose"); 

var commentSchema = new mongoose.Schema({
	user: String,
	// {
	// 	type: mongoose.Schema.Types.ObjectId, 
	// 	ref: "User"
	// },
	//favName: String, 
	busId: String,
	content: String
});

var Comment = mongoose.model("Comment", commentSchema); 
module.exports = Comment; 
