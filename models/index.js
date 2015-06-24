var mongoose = require("mongoose"); 
mongoose.connect("mongodb://localhost/topRated"); 

mongoose.set("debug", true); 

module.exports.favorite = require("./favorite")
module.exports.User = require("./user")