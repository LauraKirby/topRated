var mongoose = require("mongoose"); 
mongoose.connect("mongodb://localhost/topRated"); 

mongoose.set("debug", true); 

module.exports.Favorite = require("./favorite")
module.exports.User = require("./user")
module.exports.Comment = require("./comment")