$(function(){

	$("#favorite").submit(function(e){
		e.preventDefault();
		storeFavData(favorited); 			
	})

	function storeFavData (callback){
		//var favName = $('#favName').val();
		var user = $("#data").val(); 
		var reviewCount = $('#favReviewCount').val(); 
		var address = $('favAddress').val(); 
		var favData = {fav: {favReviewCount: reviewCount, favAddress: address}};
		callback(user, favData)
	};

	function favorited(userFromSD, favDataFromSD){
		$.ajax({
			type: 'POST', 
			url: '/users/' + userFromSD + '/favorites',
			data: favDataFromSD,
			dataType: 'json'
		}).done(function(favDataFromSD){
			console.log ("inside the DONE function" + userFromSD)
			$("#favorited").removeClass("ui blue labeled button").addClass("ui yellow labeled button");
		})
	}

}); //closes initial jQuery function on Line: 1 