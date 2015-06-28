var mongoose = require("mongoose"); 

var favoriteSchema = new mongoose.Schema({
	busId: String,
	user: {
		type: mongoose.Schema.Types.ObjectId, 
		ref: "User"
	},
	favName: String, 
	favUrl: String, 
	favImage: String, 
	favReviewCount: String, 
	favRating: String, 
	favAddress: String,
	favDistance: String
});

var Favorite = mongoose.model("Favorite", favoriteSchema); 
module.exports = Favorite; 
