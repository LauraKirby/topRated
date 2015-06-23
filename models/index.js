var mongoose = require("mongoose"); 
mongoose.connect("mongodb://localhost/topRated"); 

mongoose.set("debug", true); 

module.exports.Search = require("./search")
module.exports.Result = require("./result")
module.exports.User = require("./user")