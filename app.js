const express=require("express");
const app=express();
const Listing=require("./models/listing.js");
const mongoose=require("mongoose");
const MONGOURL="mongodb://127.0.0.1:27017/WanderLust";
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./Schema.js");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"public")));
main().then(()=>{
    console.log("Connection successful!")
}).catch(err=>console.log(err));
async function main(){
    await mongoose.connect(MONGOURL);
}
const validatelisting=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(',');
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
}
app.get("/listings",wrapAsync(async(req,res)=>{
    const allListings=await Listing.find({})
    res.render("./listings/index.ejs",{allListings});
}))
app.get("/listings/new",wrapAsync(async(req,res)=>{
    res.render("listings/new.ejs");
}))
app.get("/listings/users",(req,res)=>{
    res.send("Hello All!");
})
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    
    let {id}=req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ExpressError(404, 'Page Not Found');
    }
    let listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
}))

app.post("/listings",validatelisting,wrapAsync(async(req,res)=>{
    const listing=req.body.listing;
    const newlisting=new Listing(listing);
    await newlisting.save();
    res.redirect("/listings");
}))
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}))
app.put("/listings/:id",validatelisting,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}))
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
     let {id}=req.params;
     await Listing.findByIdAndDelete(id);
     res.redirect("/listings");
}))

app.get("/",(req,res)=>{
    res.send("Hi,I am Shivangi");
})


app.use((req, res, next) => {
  next(new ExpressError(404, 'Page Not Found!'));
});



app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong!"}=err;
    res.status(statusCode).render("error.ejs",{message});
    //res.statuscode(statuscode).send(message);
})


app.listen(8000,()=>{
    console.log("server is listening");
})