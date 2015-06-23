var mongoose = require("mongoose"); 

var favoriteSchema = new mongoose.Schema({
	restaurantName: String, 
	imageUrl: String, 
});

var Favorite = mongoose.model("Favorite", favoriteSchema); 
module.exports = Favorite; 