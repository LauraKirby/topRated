var mongoose = require("mongoose"); 

var commentSchema = new mongoose.Schema({
	busId: String,
	user: {
		type: mongoose.Schema.Types.ObjectId, 
		ref: "User"
	},
	favName: String, 
	content: String
});

var Comment = mongoose.model("Comment", commentSchema); 
module.exports = Comment; 
