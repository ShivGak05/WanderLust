const express=require("express");
const router=express.Router({mergeParams:true});
const mongoose=require("mongoose");
const MONGOURL="mongodb://127.0.0.1:27017/WanderLust";
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const User=require("../models/user.js");
const passport = require("passport");
const usercontroller=require("../controllers/user.js");
const saveurl=(req,res,next)=>{
    if(req.session.redirectURL){
    res.locals.redirectURL=req.session.redirectURL;
    }
    next();
}
router
.route("/signup")
.get(usercontroller.signup)
.post(usercontroller.signupaction);

router.route("/login")
.get(usercontroller.loginform)
.post(saveurl,passport.authenticate("local",{failureFlash:true, failureRedirect:"/login"}),usercontroller.loginaction);

router.get("/logout",usercontroller.logout);
module.exports=router;
