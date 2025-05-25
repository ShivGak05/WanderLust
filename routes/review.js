const express=require("express");
const router=express.Router({mergeParams:true});
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const mongoose=require("mongoose");
const MONGOURL="mongodb://127.0.0.1:27017/WanderLust";
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../Schema.js");
const {reviewSchema}=require("../Schema.js");
const reviewcontroller=require("../controllers/review.js");
const validatereview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((e)=>e.message).join(',');
        throw new ExpressError(400,errmsg);
    }
    else{
        next();
    }
}
const isLoggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectURL=req.originalUrl;
        req.flash("error","You must be logged in first!");
        return res.redirect("/login");
    }
    next();
}
const isAuthor=async(req,res,next)=>{
    let {id,reviewid}=req.params;
    let review=await Review.findById(reviewid);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
router.post("/",isLoggedin,validatereview,wrapAsync(reviewcontroller.createreview));


router.delete("/:reviewid",isLoggedin,isAuthor,wrapAsync(reviewcontroller.deletereview));
module.exports=router;