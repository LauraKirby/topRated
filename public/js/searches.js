$(function(){

var user = $($(".userIdData")[0]).val();

console.log(user, " user id from session id");

// ------------------------- Add & Save Favorite -------------------------
//could use $.proxy to maintain the 'this' scope
//see article http://esbueno.noahstokes.com/post/77292606977/self-executing-anonymous-functions-or-how-to-write
	$(".favButton").submit(function(e){
		e.preventDefault();
		favData.apply(this, [postFavorite.bind(this)]); 			
	});
	function favData (callback){
		var businessId = $(this).find('.yelpBusId').val();
		var busName = $(this).find('.busName').val();
		var businessUrl = $(this).parent().parent().find('.busUrl').val(); 
		var busImage = $(this).parent().parent().find(".busImage").prop('outerHTML'); 
		var reviewCount = $(this).parent().parent().find('.reviewCount').html(); 
		var rating = $(this).parent().parent().find('.rating').html(); 
		var address = $(this).parent().parent().find('.address').html(); 
		var favDataObj = {fav: 
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
		callback(user, favDataObj);
	}

	function postFavorite(userFromSD, favDataFromSD){
		console.log($(this));
		$.ajax({
			type: 'POST', 
			url: '/users/' + userFromSD + '/favorites',
			data: favDataFromSD,
			dataType: 'json'
		}).done(function(favObjSaved){
			//console.log ("inside the DONE function " + userFromSD);
			$(this).children('input.compact').removeClass("grey").addClass("yellow");
			//console.log("inside the DONE function " + this); 
		}.bind(this));
	}

// ------------------------- Add & Save Comment -------------------------
$( ".add" ).on( "click", function(e) {
	console.log($(this));
	e.preventDefault();
	$(this).hide();
  $(this).siblings(".commentForm").children(".textAreaComment").show(); 
  $(this).siblings(".commentForm").children("#saveBtn").show();
});

$(".commentForm").submit(function(e) {
	console.log($(this, "line 73 from saveBtn click")); 
	e.preventDefault(); 
	commentData.apply(this, [postComment.bind(this)]);
});

	function commentData (callback) {
		var businessId = $(this).parent().parent().parent().parent().find('.yelpBusId').val();
		var content = $(this).children(".textAreaComment").val();
		//console.log(content, " ** commentData function");
		var commDataObj = {comm: 
			{
				user: user, 
				busId: businessId,	
				content: content, 
			}
		};
		callback(user, commDataObj);
	}

	function postComment(userFromSD, commObjFromSD){
		console.log($(this));
		$.ajax({
			type: 'POST', 
			url: '/users/' + userFromSD + '/comments',
			data: commObjFromSD,
			dataType: 'json'
		}).done(function(commObjSaved){
			var contentSaved = commObjSaved.savedComm.content; 
			$(this).hide();
			$(this).siblings(".hiddenComm").html('<p>' + contentSaved + '</p>').show();
		}.bind(this));
	}

}); //closes initial jQuery function on Line: 1 