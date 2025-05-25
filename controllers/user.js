const User=require("../models/user.js");
const passport = require("passport");
module.exports.signup=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signupaction=async(req,res,next)=>{
    try{
    let {username,email,password}=req.body;
    let newUser=new User({username,email});
    let regUser=await User.register(newUser,password);
    req.login(regUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","User was registered successfully");
        res.redirect("/listings");
    })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}
module.exports.loginform=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.loginaction=async(req,res)=>{
    req.flash("success","Welcome back to WanderLust!!");
    const redirectUrl = res.locals.redirectURL || "/listings";
    res.redirect(redirectUrl);
}
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out now!");
        res.redirect("/listings");
    })
}