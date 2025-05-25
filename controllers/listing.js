const Listing=require("../models/listing.js");
const mongoose=require("mongoose");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken=process.env.MAP_API_KEY;

const geocodingClient = mbxGeocoding({ accessToken:maptoken});
module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({})
    res.render("./listings/index.ejs",{allListings});
}
module.exports.rendernewform=async(req,res)=>{
    res.render("listings/new.ejs");
}
module.exports.showlist=async (req,res)=>{
    
    let {id}=req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ExpressError(404, 'Page Not Found');
    }
    let listing = await Listing.findById(id)
  .populate({
    path: "reviews",
    populate: {
      path: "author"
    }
  })
  .populate("owner");
    if(!listing){
        req.flash("error","Listing does not exist!");
        return res.redirect("/listings");
    }else
    res.render("listings/show.ejs",{listing});
}
module.exports.createlisting=async(req,res)=>{
    let response=await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
})
  .send()
    let url=req.file.path;
    let filename=req.file.filename;
    const listing=req.body.listing;
    listing.owner=req.user._id;
    listing.image={url,filename};
    listing.geometry=response.body.features[0].geometry;
    const newlisting=new Listing(listing);
    await newlisting.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}
module.exports.rendereditform=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exist!");
        return res.redirect("/listings");
    }
    let originalimage=listing.image.url;
    originalimage.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listing,originalimage});
}
module.exports.updatelist=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file!=="undefined"){
    let url=req.file.url;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    req.flash("success","Listing Edited!");
    res.redirect(`/listings/${id}`);
}
module.exports.deletelist=async(req,res)=>{
     let {id}=req.params;
     await Listing.findByIdAndDelete(id);
     req.flash("success","Listing Deleted!");
     res.redirect("/listings");
}