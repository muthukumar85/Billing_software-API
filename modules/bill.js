const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection("mongodb://localhost:27017/Billing");
 
autoIncrement.initialize(connection);
const ProductSchema = new Schema({
    soldout_quantity:{
        type:Number
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    }
})
const BillSchema = new Schema({
    bill_no:{
        type:Number
    },
    bill_date:{
        type:Date
    },
    products:[ProductSchema]

},{
    timestamps:true
})

BillSchema.plugin(autoIncrement.plugin , {
    model:"Bill",
    field:"bill_no",
    startAt:1,
    incrementBy:1
})

var bills = mongoose.model('Bill' , BillSchema);

module.exports = bills;