$(function(){

	$(".favButton").submit(function(e){
		e.preventDefault();
		storeFavData.apply(this, [favorited.bind(this)]); 			
	});

	function storeFavData (callback){
		//var favName = $('#favName').val();
		//use .find()
		console.log($(this).parent()); 
		var user = $(this).find('.data').val(); //can we move through all levels of the tree? with .find()
		var businessId = $(this).find('.busId').val(); 
		var busName = $(this).find('.busName').val(); 
		var businessUrl = $(this).find('.busUrl').val(); 
		var busImage = $(this).find('.busImage').val(); 
		var reviewCount = $(this).find('.reviewCount').val(); 
		var rating = $(this).find('.rating').val(); 
		var address = $(this).find('.address').val(); 
		console.log("this is reviewCount " + reviewCount);
		//user this.find() instead
		//$(this).parent().sibling('td').sibling('.favReviewCount').val(); 
		var favData = {fav: 
			{
				busId: businessId,
				favName: busName, 
				favUrl: businessUrl,  
				favImage: busImage, 
				favReviewCount: reviewCount, 
				favRating: rating, 
				favAddress: address,
			}
		};
		//REVIEW COUNT NOT WORKING HERE <<<<<<<<<--------------
		console.log("favData.fav.reviewCount before callback " + favData.fav.favReviewCount);
		console.log("favData.fav.busId before callback " + favData.fav.busId);
		callback(user, favData);
		console.log("favData.fav.busId " + favData.fav.busId);
	}

	function favorited(userFromSD, favDataFromSD){
		console.log($(this));
		$.ajax({
			type: 'POST', 
			url: '/users/' + userFromSD + '/favorites',
			data: favDataFromSD,
			dataType: 'json'
		}).done(function(favDataFromSD){
			console.log ("inside the DONE function " + userFromSD);
			$(this).children('input.compact').removeClass("blue").addClass("yellow");
			console.log("inside the DONE function " + this); 
		}.bind(this));
	}

}); //closes initial jQuery function on Line: 1 