const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const overallSchema = new Schema({
    brand_name:{
        type:String,
        required:true
    },
    product_name:{
        type:String,
        required:true
    },
    prod_id:{
        type:String,
        required:true
    },
    overall_quantity:{
        type:String,
        required:true
    }
});

var overall = mongoose.model('Overall' , overallSchema);

module.exports = overall;