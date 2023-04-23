const passport = require("passport");
const Post = require("../models/post");
const Comment = require("../models/comment");
const Like = require("../models/like");

module.exports.create = async function(req, res){
	
	try{
		let post = await Post.create({
			content: req.body.content,
			user: req.user._id
		});
		post = await post.populate("user", "name email");

		if (req.xhr){
			req.flash("success", "Post Published!");
			return res.status(200).json({
				data: {
					post: post
				},
				message: "Post Created"
			});
		}
		res.redirect("/");
		req.flash("success", "Post Published!");
		return res.redirect("back");
	}
	catch(err){
		req.flash("error", err);
		console.log("error", err)
		return res.redirect("back");
	}
	
}

module.exports.destroy = async function(req, res){

	try{
		let post = await Post.findById(req.params.id)
		// .id means converting the object id into string
		if (post.user == req.user.id){
			post.remove();

			await Comment.deleteMany({post: req.params.id})
			await Like.deleteMany({likeable: req.params.id, onMode: "Post"});

			if (req.xhr){
				return res.status(200).json({
					data: {
						post_id: req.params.id
					},
					message: "Post Deleted"
				})
			}

			req.flash("success", "Post and associated comments Deleted");
			return 	res.redirect("back");
		}
		else{
			req.flash("error", "You cannot delete this Post");
			return res.redirect("back");
		}
	}
	catch(err){
		req.flash("error", "You cannot delete this Post");
		return;
	}	
}