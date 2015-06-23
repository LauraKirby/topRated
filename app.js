var express = require("express"), 
	app = express(), 
	bodyParser = require("body-parser"), 
	methodOverride = require("method-override"), 
	db = require("./models"),
	session = require("cookie-session"), 
	loginMiddleware = require("./middleware/loginHelper"), 
	routeMiddleware = require("./middleware/routeHelper"), 
	morgan = require("morgan");

app.use(morgan('tiny'));
app.set('view engine', 'ejs'); 
app.use(methodOverride('_method')); 
app.use(express.static(__dirname + '/public')); 
app.use(bodyParser.urlencoded({extended:true})); 
app.use(loginMiddleware);

//--------Create Search Routes-----------//
app.get('/searches/:search_id/', function(req, res){
	//.populate('comments') - we did this my hand with post.comments
	//here doing two reads 
	//instead of two writes and one read
	db.Post.findById(req.params.post_id).exec(function(err,post){
		if (err) throw err
		db.Comment.find({post: req.params.post_id}, function(err, comments){
			if (err) throw err
			post.comments = comments;
			res.render("comments/index", {post:post});
		});
	});
});


// CATCH ALL
app.get('*', function(req,res){
  res.render('404');
});

// START SERVER
app.listen(3000, function(){
  "Server is listening on port 3000";
});