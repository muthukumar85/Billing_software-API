const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    mobile:{
        type:String
    },
    email:{
        type:String
    },
    account_type:{
        type:String,
        default:'admin'
    },
    address:{
        type:String
    },
    age:{
        type:Number
    }
},{
    timestamps:true
})

UserSchema.plugin(passportLocalMongoose);

var user = mongoose.model('User' , UserSchema);

module.exports = user;