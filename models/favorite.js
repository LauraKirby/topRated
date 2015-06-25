var mongoose = require("mongoose"); 

var favoriteSchema = new mongoose.Schema({
	favName: String, 
	favUrl: String, 
	favImage: String, 
	favNumReviews: String, 
	favRating: String, 
});

var Favorite = mongoose.model("Favorite", favoriteSchema); 
module.exports = Favorite; 
