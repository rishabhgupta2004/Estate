const mogoose=require("mongoose")
const Schema=mongoose.Schema;
const reviewSchema=new Schema({
    comment:String,
    rating:{

        type:Number,
        min:1,
        max:5,
    },
    createdat:{
        type:Date,
        default:Date.now()
    }

});
module.export=mongoose.model("Review",reviewSchema)