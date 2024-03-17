
const mongoose=require("mongoose");

const schema=mongoose.Schema;

const listingschema=new  schema({
    title:{
        type:String,
        required : true,
    },
    description:String,
    image:{
        type:String,
        default:"https://wallpaperaccess.com/full/2315968.jpg",
        set:(v)=>
        v===""
        ?"https://wallpaperaccess.com/full/2315968.jpg"
        :v,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type: schema.Types.ObjectId,
            ref:"Review"
        }
    ],
});
const listing=mongoose.model("listing",listingschema);
module.exports = listing;
