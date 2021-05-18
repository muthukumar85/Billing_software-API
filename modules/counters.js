const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection("mongodb://localhost:27017/Billing");
 
autoIncrement.initialize(connection);
var CounterSchema = new Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});
CounterSchema.plugin(autoIncrement.plugin , {
    model:'counter',
    field:'seq',
    startAt:1000,
    incrementBy:1
})
var counter = mongoose.model('counter', CounterSchema);
module.exports = counter;