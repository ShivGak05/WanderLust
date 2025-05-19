const mongoose=require("mongoose");
const Listing=require("../models/listing.js");
const data=require("./data.js");
const MONGOURL="mongodb://127.0.0.1:27017/WanderLust";
main().then(()=>{
    console.log("Connection successful!")
}).catch(err=>console.log(err));
async function main(){
    await mongoose.connect(MONGOURL);
}
const initDB=async()=>{
     await Listing.deleteMany({});
     await Listing.insertMany(data.data);
     console.log("done!!");
}
initDB();