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

router.post("/",validatereview,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let review=req.body.review;
    let newreview=new Review(review);
    let listing=await Listing.findById(id);
    await listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    res.redirect(`/listings/${id}`);
}))


router.delete("/:reviewid",wrapAsync(async(req,res)=>{
    let{id,reviewid}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    res.redirect(`/listings/${id}`);
}))
module.exports=router;