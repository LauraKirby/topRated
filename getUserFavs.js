//http://expressjs.com/guide/routing.html
var express = require('express');
var router = express.Router();

function findFavsForResults(paramsUserId, results, annonFunc){
	var trueArr = [];
	db.Favorite.find(paramsUserId, 
		function(err, favoritesByUserId) {
			if (err) {
				console.log(err); 
				//res.render("errors/404");
			} else {
				results.businesses.forEach(function(business){
					business.isFavorited = false; 
					favoritesByUserId.forEach(function(favorite){
						if (business.id === favorite.yelpBusId){
							business.isFavorited = true; 
							//trueArr.push(business.id);
						} 
					});
				});
		  } // end lse favoritesByUserId
		  annonFunc(results);
		return results;
	 }
	); // end db.Favorite.find(.. {..
}

module.exports = router;