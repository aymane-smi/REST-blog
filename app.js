//variables setup
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var expressSanitize = require("express-sanitizer");
//CONFIGURATION
mongoose.connect("mongodb://localhost/restful_blog_app", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
//always after bodyparser and JSON
app.use(expressSanitize());
app.use(methodOverride("_method"));
//DB setup
var blogSchema = new mongoose.Schema({
	 title: String,
	 image: String,
	 body: String,
	 created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema); 
//ROUTES
app.get('/', function(req, res){
	res.redirect("/blogs");
});
app.get('/blogs', function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log(err);
		}else{
			res.render("index", {blogs:blogs});
		}
	});
});
app.post('/blogs', function(req, res){
	console.log(req.body.blog.title);
	Blog.create(req.body.blog, function(err, newItem){
		if(err){
			res.render("/blogs/new");
		}else{
			res.redirect("/");
		}
	});
});
app.get('/blogs/new', function(req, res){
	res.render("new");
});
app.get('/blogs/:id', function(req, res){
	Blog.findById(req.params.id, function(err, item){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("show", {item, item});
		}
	});
});
app.get('/blogs/:id/edit', function(req, res){
	Blog.findById(req.params.id, function(err, item){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("edit", {item: item});
		}
	});
});
app.put('/blogs/:id', function(req, res){
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, item){
		if(err){
			console.log(err);
		}else{
			res.redirect("/blogs/"+item._id);
		}
	});
});
app.delete('/blogs/:id', function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	});
});
//start listening
app.listen(3000,function(){
	console.log("server strated!!!!"); 
});