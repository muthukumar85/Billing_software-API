const express = require('express');
const bodyParser = require('body-parser');
const PaidRouter = express.Router();
const cors = require('./cors');
const paid = require('../modules/paid');
const authenticate = require('../authenticate');
PaidRouter.use(bodyParser.json());

PaidRouter.route('/paid')
.options(cors.corsWithOptions , (req, res) => {res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser , authenticate.verifyAdmin , (req , res , next )=>{
    paid.find({paid_date:req.body.date})
    .then((pai) => {
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'application/json');
        res.json({success:true , paid:pai});
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions , authenticate.verifyUser , (req , res , next)=>{
    paid.create(req.body)
    .then((pai) => {
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'application/json');
        res.json({success:true , paid:pai});
    },(err)=>next(err))
    .catch((err)=>next(err));
});
PaidRouter.route('/getpaid')
.options(cors.corsWithOptions , (req, res) => {res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser , authenticate.verifyAdmin , (req , res , next )=>{
    paid.find({})
    .then((pai) => {
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'application/json');
        res.json({success:true , paid:pai});
    },(err)=>next(err))
    .catch((err)=>next(err));
});
PaidRouter.route('/paid/:bill_no')
.options(cors.corsWithOptions , (req, res) => {res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser , authenticate.verifyAdmin , (req , res , next )=>{
    paid.find({bill_no:req.params.bill_no})
    .then((pai) => {
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'application/json');
        res.json({success:true , paid:pai});
    },(err)=>next(err))
    .catch((err)=>next(err));
});
module.exports = PaidRouter;