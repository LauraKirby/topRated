var mongoose = require("mongoose"); 

var favoriteSchema = new mongoose.Schema({
	yelpBusId: String,
	user: String,
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

// {
// 		type: mongoose.Schema.Types.ObjectId, 
// 		ref: "User"
// 	}