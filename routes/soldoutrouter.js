const express = require('express');
const soldoutrouter = express.Router();
const soldout = require('../modules/soldout');
const product = require('../modules/product');
const bodyParser = require('body-parser');
const cors = require('./cors');
const authenticate = require('../authenticate');

soldoutrouter.use(bodyParser.json());

soldoutrouter.route('/soldout')
.options(cors.corsWithOptions , (req, res) => {res.sendStatus(200); })
.get(cors.cors ,(req, res, next)=>{
    soldout.find({})
    .then((sold)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'application/json');
        res.json({success:true , sold});
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions , authenticate.verifyUser,(req, res, next)=>{
    product.findById(req.body.prod_id)
    .then((products)=>{
        console.log(products.quantity - req.body.soldout_quantity);
        products.quantity = products.quantity - req.body.soldout_quantity;
        products.save()
        .then((sold)=>{
            soldout.create({"brand_name":sold.brand_name ,"product_id":sold.product_id, "product_name" : sold.product_name , "prod_id": sold._id , "soldout_quantity": req.body.soldout_quantity , "soldout_date":Date.now() , "mrp":sold.mrp * req.body.soldout_quantity})
            .then((soldouts)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type' , 'application/json');
                res.json({success:true , sold:soldouts});
            })
        },(err)=>next(err));
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put((req, res, next)=>{
    res.statusCode = 403;
    res.end('PUT Operation does not supported on soldout operation'); 
})
.delete((req, res, next)=>{
    res.statusCode = 403;
    res.end('PUT Operation does not supported on soldout operation');
});

soldoutrouter.route('/soldout/:id')
.options(cors.corsWithOptions , (req, res) => {res.sendStatus(200); })
.get(cors.cors ,(req, res, next)=>{
    soldout.find({product_id:req.params.id})
    .then((sold)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'application/json');
        res.json({success:true , sold});
    },(err)=>next(err))
    .catch((err)=>next(err));
});
module.exports = soldoutrouter;