const express = require('express');
const billrouter = express.Router();
const bodyParser = require('body-parser');
const bill = require('../modules/bill');
const cors = require('./cors');
const authenticate = require('../authenticate');

billrouter.use(bodyParser.json());  

billrouter.route('/bill')
.options(cors.corsWithOptions , (req, res) => {res.sendStatus(200); })
.get(cors.cors , (req , res, next)=>{
    bill.find(req.query)
    .populate('products.product')
    .then((bills)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'application/json');
        res.json(bills);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser,(req, res, next)=>{
    bill.create(req.body)
    .then((bills)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'application/json');
        res.json({success:true , bill:bills});
    },(err)=>next(err))
    .catch((err)=>next(err));  
})
.delete(cors.corsWithOptions, authenticate.verifyUser,(req , res, next)=>{
    bill.remove({})
    .then((bills)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'application/json');
        res.json(bills);
    },(err)=>next(err))
    .catch((err)=>next(err));
});
billrouter.route('/billfind/:bill_no')
.options(cors.corsWithOptions , (req, res) => {res.sendStatus(200); })
.get(cors.cors , (req , res , next)=>{
    bill.find({bill_no:req.params.bill_no})
    .populate('products.product')
    .then((bills)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'application/json');
        res.json({success:true , bill:bills});
    },(err)=>next(err))
    .catch((err)=>next(err));
});
billrouter.route('/bill/:bill_id')
.options(cors.corsWithOptions , (req, res) => {res.sendStatus(200); })
.get(cors.cors , (req , res , next)=>{
    bill.findById(req.params.bill_id)
    .populate('products.product')
    .then((bills)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'application/json');
        res.json(bills);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.delete(cors.corsWithOptions , authenticate.verifyUser ,(req , res , next)=>{
    bill.findByIdAndRemove(req.params.bill_id)
    .then((bills)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'application/json');
        res.json(bills);
    },(err)=>next(err))
    .catch((err)=>next(err));
});

billrouter.route('/bill/:bill_id/product')
.options(cors.corsWithOptions , (req, res) => {res.sendStatus(200); })
.get(cors.cors , (req, res, next)=>{
    bill.findById(req.params.bill_id)
    .populate('products.product')
    .then((bills)=>{
        if(bills!=null){
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'application/json');
        res.json(bills);
        }
        else{
            var err = new Error('Product not found');
            err.status = 404;
            next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions , authenticate.verifyUser , (req, res, next)=>{
    bill.findById(req.params.bill_id)
    .then((cat)=>{
        if(cat!=null){
            for(const [key, value] of Object.entries(req.body.prod_id)){
            req.body.product = value;
            cat.products.push(req.body);
            if(req.body.prod_id.length -1 == key){
            cat.save()
            .then((dish)=>{
                bill.findById(cat._id)
                .populate('products.product')
                .then((cats)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type' , 'application/json');
                    res.json({success:true , bill:cats});
                });
            },(err)=>next(err));
        }
        }
        }
        else{
            var err = new Error('Products not found');
            err.status = 404;
            next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
});

module.exports = billrouter;