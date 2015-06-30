$(function(){

	$(".favButton").submit(function(e){
		e.preventDefault();
		storeFavData.apply(this, [favorited.bind(this)]); 			
	})

	function storeFavData (callback){
		//var favName = $('#favName').val();
		//use .find()
		console.log($(this).parent()); 
		var user = $('.data').val(); 
		var reviewCount = $(this).parent().sibling('td').sibling('.favReviewCount').val(); 
		console.log("this is reviewCount " + reviewCount)
		var address = $('.favAddress').val(); 
		var favData = {fav: {favReviewCount: reviewCount, favAddress: address}};
		callback(user, favData);
	};

	function favorited(userFromSD, favDataFromSD){
		console.log($(this))
		$.ajax({
			type: 'POST', 
			url: '/users/' + userFromSD + '/favorites',
			data: favDataFromSD,
			dataType: 'json'
		}).done(function(favDataFromSD){
			console.log ("inside the DONE function " + userFromSD)
			$(this).children('input.compact').removeClass("blue").addClass("yellow");
			console.log("inside the DONE function " + this) 
		}.bind(this))
	}

}); //closes initial jQuery function on Line: 1 