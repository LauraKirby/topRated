$(function(){
	
	

	
	$("#favorite").submit(function(e){
		e.preventDefault();
		var user = $("#data").val(); 
		console.log("THIS IS USER FROM AJAX " + user)

 
		console.log(user)
		//var favName = $('#favName').val();
		var reviewCount = $('#favReviewCount').val(); 
		var address = $('favAddress').val(); 
		var favData = {fav: {favReviewCount: reviewCount, favAddress: address}}; 
		$.ajax({
			type: 'POST', 
			url: '/users/' + user + '/favorites',
			data: favData, 
			dataType: 'json'
		}).done(function(favData){
			console.log ("inside the DONE function")
			$("#favorite").removeClass("ui blue labeled button").addClass("ui yellow labeled button");
		})
	})




}); //closes initial jQuery function on Line: 1