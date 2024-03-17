const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const  ejsMate  = require("ejs-mate")
const wrapAsync=require("./utils/wrapAsync.js")
const ExpressError=require("./utils/expresserrors.js")
const MONGO_URL = "mongodb://127.0.0.1:27017/test";
const {listingschema}=require("./schema.js")
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate)
app.use(express.static(path.join(__dirname,"/public")))
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

//Index Route
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });

}));

//New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
})
);

//Create Route
// Assuming wrapAsync is a middleware that wraps asynchronous functions

// Import the wrapAsync middleware

// Your route definition using the wrapAsync middleware
app.post("/listings", wrapAsync(async (req, res, next) => {
 
    // Create a new listing based on the request body
    const newListing = new Listing(req.body.listing);
   
   
    await newListing.save();

    res.redirect("/listings");
}));


//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

//Update Route
app.put("/listings/:id", async (req, res) => {
  if(!req.body.listing){
    throw new ExpressError(400,"send valid data")
  }
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

//Delete Route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});

// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page not found"))
})
app.use((err,req,res,next)=>{
 
  let {statuscode =500,message="something went wrong"}=err;
  res.status(statuscode).render("error.ejs",{message})
  
  //res.status(statuscode).send(message)

});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});