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
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})
router.post("/signup",async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    let newUser=new User({username,email});
    await User.register(newUser,password);
    req.flash("success","User was registered successfully");
    res.redirect("/listings");
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
})
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})
router.post("/login",passport.authenticate("local",{failureFlash:true, failureRedirect:"/login"}),async(req,res)=>{
       req.flash("success","Welcome back to WanderLust!!");
       res.redirect("/listings");
})
module.exports=router;
