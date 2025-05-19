const express=require("express");
const app=express();
const Listing=require("./models/listing.js");
const mongoose=require("mongoose");
const MONGOURL="mongodb://127.0.0.1:27017/WanderLust";
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
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
app.get("/listings",async(req,res)=>{
    const allListings=await Listing.find({})
    res.render("./listings/index.ejs",{allListings});
})
app.get("/listings/new",async(req,res)=>{
    res.render("listings/new.ejs");
})
app.get("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
})
app.post("/listings",async(req,res)=>{
    const {title,description,image,price,location,country}=req.body;
    const newlisting=new Listing({
        title:title,
        description:description,
        price:price,
        image:image,
        location:location,
        country:country,
    })
    await newlisting.save();
    res.redirect("/listings");
})
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})
app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})
app.delete("/listings/:id",async(req,res)=>{
     let {id}=req.params;
     await Listing.findByIdAndDelete(id);
     res.redirect("/listings");
})
// app.get("/testListing",async (req,res)=>{
//     let sampletesting=new Listing({
//         title:"My new Villa",
//         description:"Nice place",
//         price:1300,
//         location:"Bengaluru",
//         country:"China",
//     });
//     await sampletesting.save();
//     console.log("document saved");
//     res.send("connection document saved");
// })
app.get("/",(req,res)=>{
    res.send("Hi,I am Shivangi");
})
app.listen(8000,()=>{
    console.log("server is listening");
})