const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const soldoutSchema = new Schema({
    brand_name:{
        type:String,
        required:true
    },
    product_name:{
        type:String,
        required:true
    },
    product_id:{
        type:Number,
        required:true
    },
    prod_id:{
        type:String
    },
    soldout_quantity:{
        type:Number,
        required:true
    },
    soldout_date:{
        type:Date
    },
    mrp:{
        type:Number
    }
},{
    timestamps:true
});

var soldout = mongoose.model('Soldout' , soldoutSchema);
module.exports = soldout;