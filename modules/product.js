const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const counter = require('./counters');
// require('mongoose-currency').loadType(mongoose);
// const Currency = mongoose.Types.Currency;
const autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection("mongodb://localhost:27017/Billing");
 
autoIncrement.initialize(connection);



const varientShema = new Schema({
    brand_name:{
        type:String,
        required:true
    },
    product_id:{
        type:Number,
        required:true
    },
    product_name:{
        type:String,
        required:true
    },
    color:{
        type:String
    },
    quantity:{
        type:Number,
        required:true,
        min:0
    },
    mrp:{
        type:Number,
        required:true
    }

},{
    timestamps:true
})
varientShema.plugin(autoIncrement.plugin,{
    model:'Product',
        field:'product_id',
        startAt:1000,
        incrementBy:1
})


var product = mongoose.model('Product' , varientShema);

module.exports = product;