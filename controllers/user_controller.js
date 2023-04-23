const passport = require("passport");
const User = require("../models/user")
const path = require("path");
const fs = require("fs");

module.exports.profile=function(req, res){

    User.findById(req.params.id, function(err, user){
        return res.render("user_profile", {
            title: user.name + " || Codeial",
            profile_user: user,
            auth: true
        });
    })
    
}

module.exports.update = async function(req, res){

    // if (req.user.id == req.params.id){
    //     // User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
    //     //     req.flash("success", "Profile Updated");
    //     //     return res.redirect("back");
    //     // })
    // } 
    
    if (req.user.id == req.params.id){

        try{

            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if (err){
                    console.log("***** Multer Error: ", err);
                    return res.redirect("back");
                }
                
                user.name = req.body.name
                user.email = req.body.email

                if (req.file){

                    if (user.avatar){
                        let filePath = path.join(__dirname , ".." , user.avatar);
                        if (fs.existsSync(filePath)){
                            fs.unlinkSync(filePath);
                        }
                            // fs.unlinkSync(path.join(__dirname , ".." , user.avatar));
                        
                    }
                    user.avatar = User.avatarPath + "/" + req.file.filename 
                }
                user.save();
                return res.redirect("back");
            })
        }catch{
            req.flash("Error in updating. Please try again", err);
            console.log(err);
            return res.redirect("back");
        }
    } else{
        req.flash("error", "You are not authorized");
        return res.status(401).send("Unauthorized");
    }
}

// render sign page
module.exports.signIn=function(req, res){
    if (req.isAuthenticated()){
        return res.redirect("/users/profile");
    }
    return res.render("user_sign_in", {
        title: "Codeial | Sign In",
        auth: false
    })
}

// render sign up page
module.exports.signUp=function(req, res){
    if (req.isAuthenticated()){
        return res.redirect("/users/profile");
    }
    return res.render("user_sign_up", {
        title: "Codeial | Sign up",
        auth: false
    })
}

// action on sign up
module.exports.create=function(req, res){
    if (req.body.password != req.body.confirm_password){
        req.flash("error", "Password doesn't match");
        return res.redirect("back");
    }

    User.findOne({email: req.body.email}, function(err, user){
        if (err){console.log("Error in finding the user"); return; }

        if (!user){
            User.create(req.body, function(err, user){
                if (err){
                    req.flash("error", "Error in creating the User")
                    return;
                }

                return res.redirect("/users/sign-in");
            })
        }
        else{
            req.flash("success", "User already Exists");
            return res.redirect("/users/sign-in");
        }
    })
}

// action on sign in
module.exports.createSession=function(req, res){
    req.flash("success", "Logged In Successfully");
    return res.redirect("/");
}

// sign out 
module.exports.destoySession=function(req, res, next){
    req.logout(function(err) {
        if (err) { return next(err); }
    })
    req.flash("success", "You have Logged Out!")
    return res.redirect("/")
}