const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = new Schema({

    brand_name:{
        type:String,
        required:true
    },
    variants:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    }

},{
    timestamps:true
});
const categorySchema = new Schema({
    category_name:{
        type:String,
        required:true
    },
    products:[productSchema]
},{
    timestamps:true
});

var category = mongoose.model('Category' , categorySchema);

module.exports = category;