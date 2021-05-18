const express = require('express');
const categoryrouter = express.Router();
const bodyParser = require('body-parser');
const category = require('../modules/category');
const cors = require('./cors');
const authenticate = require('../authenticate');

categoryrouter.use(bodyParser.json());  

categoryrouter.route('/category')
.options(cors.corsWithOptions , (req, res) => {res.sendStatus(200); })
.get(cors.cors , (req, res, next)=>{
    category.find({})
    .populate('products.variants')
    .then((categorys)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'application/json');
        res.json(categorys);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next)=>{
    res.statusCode = 403;
    res.end('PUT operation does not support');
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next)=>{
    if(req.user.account_type == 'admin'){
    category.create(req.body)
    .then((categorys)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'application/json');
        res.json({success:true , category:categorys});
    },(err)=>next(err))
    .catch((err)=>next(err));
}
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next)=>{
    category.remove({})
    .then((categorys)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'application/json');
        res.json(categorys);
    },(err)=> next(err))
    .catch((err)=>next(err));
});

categoryrouter.route('/category/:cat_id')
.options(cors.corsWithOptions , (req, res) => {res.sendStatus(200); })
.get(cors.cors ,(req, res, next)=>{
    category.findById(req.params.cat_id)
    .populate('products.variants')
    .then((cat)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'application/json');
        res.json(cat);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next)=>{
    res.statusCode = 403;
    res.json({Error:"Post Operation does not supported"});
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next)=>{
    if(req.user.account_type == 'admin'){
    category.findByIdAndUpdate(req.params.cat_id,{
        $set:req.body
    },{ new:true })
    .then((cat)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'application/json');
        res.json({success:true,category:cat});
    },(err)=>next(err))
    .catch((err)=>next(err));
}
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res,next)=>{
    if(req.user.account_type == 'admin'){
    category.findByIdAndRemove(req.params.cat_id)
    .then((cat)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'application/json');
        res.json({success:true,category:cat});
    },(err)=>next(err))
    .catch((err)=>next(err));
}
});


categoryrouter.route('/category/:cat_id/product')
.get((req , res, next)=>{
    category.findById(req.params.cat_id)
    .populate('products.variants')
    .then((cat)=>{
        if(cat!=null){
            res.statusCode = 200;
            res.setHeader('Content-Type' , 'application/json');
            res.json(cat.products);
        }
        else{
            var err = new Error('Product not found');
            err.status = 404;
            next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put((req, res , next)=>{
    res.statusCode = 403;
    res.end('PUT Operation does not supported on /category/:category_id/product');
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin ,(req, res, next)=>{
    if(req.user.account_type == 'admin'){
    category.findById(req.params.cat_id)
    .then((cat)=>{
        if(cat!=null){
            for(const [key, value] of Object.entries(req.body.prod_id)){
            req.body.variants = value;
            cat.products.push(req.body);
            if(req.body.prod_id.length -1 == key){
            cat.save()
            .then((dish)=>{
                category.findById(cat._id)
                .populate('products.variants')
                .then((cats)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type' , 'application/json');
                    res.json({success:true , category:cats});
                });
            },(err)=>next(err));
        }
        }
        }
        else{
            var err = new Error('Category not found');
            err.status = 404;
            next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
}
})
.delete((req, res, next)=>{
    category.findById(req.params.cat_id)
    .then((cat)=>{
        if(cat!=null){
            for(var i = cat.products.length -1; i>=0 ; --i){
                cat.products.id(cat.products[i]._id).remove();
            }
            cat.save()
            .then((cats)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type' , 'application/json');
                res.json(cats);
            },(err)=>next(err));
        }
        else{
            err = new Error('product ' + req.params.cat_id + " not found");
            err.status= 404;
            next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
});
categoryrouter.route('/searchProduct/:prod_id')
.options(cors.corsWithOptions ,authenticate.verifyUser, (req, res ) => {res.sendStatus(200); })
.get(cors.cors , (req , res, next)=>{
    category.find({})
    .populate('products.variants')
    .then((cat)=>{
        for(const [key , value] of Object.entries(cat)){
            var pro = JSON.parse(JSON.stringify(value.products.toObject()));
            console.log('key' , key , pro.length)
            for(const [key1 , value1] of Object.entries(pro)){
            if(value1.variants.product_id == req.params.prod_id){
                res.statusCode = 200;
                res.setHeader('Content-Type' , 'application/json');
                res.json({success:true ,category:value.category_name , product:value1});
            }
        }
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
});
categoryrouter.route('/category/:cat_id/product/:prod_id')
.options(cors.corsWithOptions , (req, res) => {res.sendStatus(200); })
.get(cors.cors ,(req, res, next)=>{
    category.findById(req.params.cat_id)
    .populate('products.variants')
    .then((cat)=>{
        if(cat!=null && cat.products.id(req.params.prod_id) != null){
            res.statusCode = 200;
            res.setHeader('Content-Type' , 'application/json');
            res.json(cat.products.id(req.params.prod_id));
        }
        else if(cat ==null){
            err = new Error('category ' + req.params.cat_id + " not found");
            err.status= 404;
            next(err);
        }
        else{
            err = new Error('product ' + req.params.prod_id + " not found");
            err.status= 404;
            next(err);    
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin ,(req , res, next)=>{
    if(req.user.admin=='admin'){
    category.findById(req.params.cat_id)
    .then((cat)=>{
        if (cat!=null && cat.products.id(req.params.prod_id) != null) {
            if(req.body.brand_name){
                cat.products.id(req.params.prod_id).brand_name = req.body.brand_name;
            }
            cat.save()
            .then((cats)=>{
               category.findById(cats._id)
                    .populate('products.variants')
                    .then((catss)=>{
                        res.statusCode = 200;
                        res.setHeader('Content-Type' , 'application/json');
                        res.json(catss);
                    })
            },(err)=>next(err));
        }
        else if(cat ==null){
            err = new Error('category ' + req.params.cat_id + " not found");
            err.status= 404;
            next(err);
        }
        else{
            err = new Error('products ' + req.params.prod_id + " not found");
            err.status= 404;
            next(err);    
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
}
})
.post((req, res, next)=>{
    res.statusCode = 403;
    res.end('PUT operation does not support');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin ,(req, res, next)=>{
    if(req.user.account_type == 'admin'){
    category.findById(req.params.cat_id)
    .then((cat)=>{
        if(cat!=null && cat.products.id(req.params.prod_id) != null){
            cat.products.id(req.params.prod_id).remove();

            cat.save()
            .then((cats)=>{
                category.findById(cats._id)
                .populate('products.variants')
                .then((catss)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type' , 'application/json');
                    res.json({success:true , cat:catss});
                })
            },(err)=> next(err));
        }
        else if(cat ==null){
            err = new Error('category ' + req.params.cat_id + " not found");
            err.status= 404;
            next(err);
        }
        else{
            err = new Error('products ' + req.params.prod_id + " not found");
            err.status= 404;
            next(err);    
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
}
});


module.exports = categoryrouter;