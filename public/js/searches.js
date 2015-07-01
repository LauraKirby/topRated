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
		var businessId = $(this).find('.yelpBusId').val();
		var busName = $(this).parent().parent().find('.busName').html(); 
		var businessUrl = $(this).parent().parent().find('.busUrl').html(); 
		var busImage = $(this).parent().parent().find('.busImage').html(); 
		var reviewCount = $(this).parent().parent().find('.reviewCount').html(); 
		var rating = $(this).parent().parent().find('.rating').html(); 
		var address = $(this).parent().parent().find('.address').html(); 
		//user this.find() instead
		//$(this).parent().sibling('td').sibling('.favReviewCount').val(); 
		var favData = {fav: 
			{
				user: user, 
				yelpBusId: businessId,	
				favName: busName, 
				favUrl: businessUrl,  
				favImage: busImage, 
				favReviewCount: reviewCount, 
				favRating: rating, 
				favAddress: address,
			}
		};
		console.log("reviewCount " + reviewCount);
		console.log("busId  " + businessId);
		console.log("object ", favData);
		callback(user, favData);
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

////Text box appear for comment

	// $(".comment").submit(function(e){
	// 	e.preventDefault();
	// 	$('.commentButton').hide();
	// 	$('.hiddenField').show(); 
	// });


$( ".add" ).on( "click", function(e) {
	console.log($(this));
	e.preventDefault();
	$(this).hide();
  $(this).siblings(".textAreaComment").show(); 
  $(this).siblings('.save').show();

    
});



}); //closes initial jQuery function on Line: 1 