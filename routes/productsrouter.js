const express = require('express');
const productrouter = express.Router();
const product = require('../modules/product');
const bodyParser = require('body-parser');
const cors = require('./cors');
const authenticate = require('../authenticate');

productrouter.use(bodyParser.json());

productrouter.route('/product')
.options(cors.corsWithOptions , (req, res) => {res.sendStatus(200); })
.get(cors.cors , (req, res, next)=>{
    product.find({})
    .then((products)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'application/json');
        res.json(products);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put((req, res, next)=>{
    res.statusCode = 403;
    res.end('PUT Operation does not supported on /products');
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin , (req, res, next)=>{
    if(req.user.account_type == 'admin'){
    product.create(req.body)
    .then((products)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'application/json');
        res.json({success:true , pro:products});
    },(err)=>next(err))
    .catch((err)=>next(err));
}
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next)=>{
    product.remove({})
    .then((products)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'application/json');
        res.json(products);
    },(err)=>next(err))
    .catch((err)=>next(err));
});

productrouter.route('/product/:prod_id')
.options(cors.corsWithOptions , (req, res) => {res.sendStatus(200); })
.get(cors.cors , (req, res, next)=>{
    product.findById(req.params.prod_id)
    .then((products)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'application/json');
        res.json(products);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next)=>{
    res.statusCode = 403;
    res.end('POST Operation does not supported on /products/:product_id');
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next)=>{
    if(req.user.account_type == 'admin'){
    product.findByIdAndUpdate(req.params.prod_id , {
        $set:req.body
    } , { new:true })
    .then((products)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'application/json');
        res.json(products);
    },(err)=>next(err))
    .catch((err)=>next(err));
}
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next)=>{
    if(req.user.account_type == 'admin'){
    product.findByIdAndRemove(req.params.prod_id)
    .then((products)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'application/json');
        res.json(products);
    },(err)=>next(err))
    .catch((err)=>next(err));
    }
});

module.exports = productrouter;