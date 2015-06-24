var mongoose = require("mongoose"); 

var favoriteSchema = new mongoose.Schema({
	favoriteName: String, 
	favoriteUrl: String, 
});

var Favorite = mongoose.model("Favorite", favoriteSchema); 
module.exports = Favorite; 
