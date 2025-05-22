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
const validatelisting=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(',');
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
}
router.get("/",wrapAsync(async(req,res)=>{
    const allListings=await Listing.find({})
    res.render("./listings/index.ejs",{allListings});
}))
router.get("/new",wrapAsync(async(req,res)=>{
    res.render("listings/new.ejs");
}))
router.get("/:id",wrapAsync(async (req,res)=>{
    
    let {id}=req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ExpressError(404, 'Page Not Found');
    }
    let listing=await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing does not exist!");
        return res.redirect("/listings");
    }else
    res.render("listings/show.ejs",{listing});
}))

router.post("/",validatelisting,wrapAsync(async(req,res)=>{
    const listing=req.body.listing;
    const newlisting=new Listing(listing);
    await newlisting.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}))
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}))
router.put("/:id",validatelisting,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Edited!");
    res.redirect(`/listings/${id}`);
}))
router.delete("/:id",wrapAsync(async(req,res)=>{
     let {id}=req.params;
     await Listing.findByIdAndDelete(id);
     req.flash("success","Listing Deleted!");
     res.redirect("/listings");
}))
module.exports=router;