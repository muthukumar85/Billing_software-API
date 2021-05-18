const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ProductSchema = new Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    }
})
const UpStockSchema = new Schema({
    upstock_quantity:{
        type:Number,
        required:true
    },
    upstock_date:{
        type:Date
    },
    products:[ProductSchema]
},{
    timestamps:true
});

var Upstock = mongoose.model('UP' , UpStockSchema);
module.exports = Upstock;