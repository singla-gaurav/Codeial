const Post=require("../models/post");
const User=require("../models/user");

module.exports.home= async function(req, res){

    try{
        let posts = await Post.find({})
        .sort("-createdAt")
        .populate("user")
        .populate({
            path: "comments",
            populate:{
                path: "user"
            }
        })
        
        let users = await User.find({})
        auth = false
        if (req.isAuthenticated()){
            auth = true
        }
        return res.render("home", {
            title: "Codeial | Home",
            posts: posts,
            all_users: users,
            auth : auth
        });
    }
    catch(err){
        console.log(err);
        return;
    }
    
        
}