const express=require("express");
const router=express.Router();
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
const listingcontroller=require("../controllers/listing.js");
const multer=require('multer');
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});

const validatelisting=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(',');
        throw new ExpressError(400,errmsg);
    }else{
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
const isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
router
.route("/")
.get(wrapAsync(listingcontroller.index))
.post(isLoggedin,validatelisting,upload.single("listing[image]"),wrapAsync(listingcontroller.createlisting));

router.get("/new",isLoggedin,wrapAsync(listingcontroller.rendernewform));
router.get("/check",wrapAsync(async(req,res)=>{
    let {category}=req.query;
    const allListings=await Listing.find({category:category});
    if(allListings.length==0){
        req.flash("error","No place in this category yet. Please try later!");
        return res.redirect("/listings");
    }
    res.render("listings/index.ejs",{allListings});
}))
router.get("/search",wrapAsync(async(req,res)=>{
    let maybe=req.query.maybe;
    let allListings = await Listing.find({$or: [{title:maybe},{location:maybe}]});
    if(!allListings){
        req.flash("error","Listing not found");
        return res.redirect("/listings");
    }
    res.render("listings/index.ejs",{allListings});
}))

router
.route("/:id")
.get(wrapAsync(listingcontroller.showlist))
.put(isLoggedin,isOwner,validatelisting,upload.single("listing[image]"),wrapAsync(listingcontroller.updatelist))
.delete(isLoggedin,isOwner,wrapAsync(listingcontroller.deletelist));

router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(listingcontroller.rendereditform));
module.exports=router;