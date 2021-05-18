const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaidScheama = new Schema({
    username:{
        type:String,
        required:true
    },
    overall_amount:{
        type:Number,
        required:true
    },
    Paid_date:{
        type:String,
        required:true
    },
    bill_no:{
        type:Number,
        required:true
    }
},{
    timestamps:true
});

var paids = mongoose.model("Paid" , PaidScheama);

module.exports = paids;
