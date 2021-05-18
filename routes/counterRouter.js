const express = require('express');
const bodyParser = require('body-parser');
const CashiersRouter = express.Router();
const User = require('../modules/counters');


CashiersRouter.use(bodyParser.json());


CashiersRouter.route('/counter')
.post((req, res, next)=>{
   
        User.create(req.body)
        .then((cashs)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type' , 'application/json');
            res.json(cashs);
        },(err)=>next(err))
    .catch((err)=>next(err));
});

module.exports = CashiersRouter;