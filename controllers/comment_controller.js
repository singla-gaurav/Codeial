const e = require("express");
const Comment = require("../models/comment");
const Post = require("../models/post");

module.exports.create = async function(req, res){

	try{
		let post = await Post.findById(req.body.post)

		if (post){
			let comment = await Comment.create({
				content: req.body.content,
				post: req.body.post,
				user: req.user._id
			})

			post.comments.push(comment);
			post.save();

			comment = await comment.populate("user", "name email");
			post = await post.populate("user", "name email");
			

			req.flash("success", "Comment Added");
			return res.redirect("/");
		}
	}
	catch(err){
		req.flash("error", err)
		return;
	}
	
}

module.exports.destroy = async function(req, res){
	try{
		let comment = await Comment.findById(req.params.id)
		
		var postId = comment.post;
		comment.remove();
	
		await Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}})

		req.flash("success", "Comment Deleted");
		return res.redirect("back");
	}
	catch(err){
		req.flash("error", "Error in deleting the comment");
		return;
	}
	
}