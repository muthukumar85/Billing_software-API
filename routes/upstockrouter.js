const express = require('express');
const bodyParser = require('body-parser');
const cors = require('./cors');
const authenticate = require('../authenticate');
const upstock = require('../modules/upstock');
const product = require('../modules/product');
const UpstockRouter = express.Router();

UpstockRouter.use(bodyParser.json());

UpstockRouter.route('/upstock')
.options(cors.corsWithOptions , (req, res) => {res.sendStatus(200); })
.get(cors.cors ,(req, res, next)=>{
    upstock.find({})
    .populate('products.product')
    .then((up)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'application/json');
        res.json({success:true , upstock:up});
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions , authenticate.verifyUser ,authenticate.verifyAdmin, (req , res , next)=>{
    if(req.user.account_type == "admin"){
    product.findById(req.body.prod_id)
    .then((products)=>{
        console.log(products.quantity + req.body.upstock_quantity);
        products.quantity = products.quantity + req.body.upstock_quantity;
        products.save()
        .then((pro)=>{
            upstock.create(req.body)
            .then((up)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type' , 'application/json');
                res.json({success:true , upstock:up});
            },(err)=>next(err))
        },(err)=>next(err))
    },(err)=>next(err))
    .catch((err)=>next(err));
}
    else{
        var err = new Error('You are not authorized to perform this operation');
        err.status = 401;
        next(err);
    } 
});

UpstockRouter.route('/upstock/:up_id/product')
.options(cors.corsWithOptions , (req, res) => {res.sendStatus(200); })
.get(cors.cors ,(req , res, next)=>{
    upstock.findById(req.params.up_id)
    .populate('products.product')
    .then((up)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'application/json');
        res.json({success:true,upstock:up});
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions , authenticate.verifyUser , authenticate.verifyAdmin , (req , res, next)=>{
    if(req.user.account_type == "admin"){
        upstock.findById(req.params.up_id)
        .then((up)=>{
            req.body.product = req.body.prod_id;
            up.products.push(req.body);
            up.save()
            .then((ups)=>{
                upstock.findById(up._id)
                .populate('products.product')
                .then((upstocks)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type' , 'application/json');
                    res.json({success:true , upstock:upstocks});
                },(err)=>next(err));
            })
        },(err)=>next(err))
        .catch((err)=>next(err));
    }
    else{
        var err = new Error('You are not authorized to perform this operation');
        err.status = 401;
        next(err);
    }
})

module.exports = UpstockRouter;