const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
module.exports.createreview=async(req,res)=>{
    let {id}=req.params;
    let review=req.body.review;
    review.author=req.user._id;
    //review.isAnonymous=req.body.anonymous==="yes";
    let newreview=new Review(review);
    let listing=await Listing.findById(id);
    await listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${id}`);
}
module.exports.deletereview=async(req,res)=>{
    let{id,reviewid}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
}