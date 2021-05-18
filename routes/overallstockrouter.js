const express = require('express');
const overallstockrouter = express.Router();
const overall = require('../modules/overallStock');
const product = require('../modules/product');
const soldout = require('../modules/soldout');
const bodyParser = require('body-parser');
const { GatewayTimeout } = require('http-errors');

overallstockrouter.route('/overallstock')
.get((req, res, next)=>{
    var Gt='top';
    soldout.find({})
    .then((sold)=>{
        
        for(const [key,value] of Object.entries(sold)){
            product.findById(value.product_id)
            .then((products)=>{
                if(products!=null && products.quantity!=null){
                    overall.find({"prod_id":value.product_id})
                    .then((pro)=>{
                        console.log(pro);
                        var pross = JSON.parse(JSON.stringify(pro));
                        console.log(pross); 
                    if(pro.length==0){ 
                        console.log('1');
                        overall.create({"brand_name":value.brand_name , "product_name":value.product_name , "prod_id":value.product_id , "overall_quantity":products.quantity+value.soldout_quantity})
                        .then((over)=>{
                            res.statusCode = 200;
                            res.setHeader('Content-Type' , 'application/json');
                            res.json(over);
                           
                        },(err)=>next(err));
                       
                    }
                    else if(pro.length!=0){
                        console.log('2' , 'quantity ' , pross[0].overall_quantity , value.soldout_quantity);
                        pross[0].overall_quantity =parseInt(pross[0].overall_quantity) + parseInt(value.soldout_quantity);
                        overall.findByIdAndUpdate(pross[0]._id,{
                            $set:pross[0]
                        } , { new:true })
                        .then((pros)=>{
                            res.statusCode = 200;
                            res.setHeader('Content-Type' , 'application/json');
                            res.json(pros);
                        },(err)=>next(err))
                        .catch((err)=>next(err));
                    }
                    })
                    
                }
                else{
                    var err = new Error('Wrong sold out product is stored in database');
                    err.status = 403;
                    next(err);
                }
            },(err)=>next(err));
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post((req, res, next)=>{
    res.statusCode = 403;
    res.end('PUT Operation does not supported on soldout operation');
})
.put((req, res, next)=>{
    res.statusCode = 403;
    res.end('PUT Operation does not supported on soldout operation');
})
.delete((req, res, next)=>{
    res.statusCode = 403;
    res.end('PUT Operation does not supported on soldout operation');
});

module.exports = overallstockrouter;