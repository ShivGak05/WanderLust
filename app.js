const express=require("express");
const app=express();


const mongoose=require("mongoose");
const MONGOURL="mongodb://127.0.0.1:27017/WanderLust";
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");

const ExpressError=require("./utils/ExpressError.js");

const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
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
app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
    
    

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