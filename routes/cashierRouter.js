const express = require('express');
const bodyParser = require('body-parser');
const CashierRouter = express.Router();
const User = require('../modules/user');
const authenticate = require('../authenticate');
const cors= require('./cors');

CashierRouter.use(bodyParser.json());


CashierRouter.route('/cashier/:cash_id')
.get((req, res, next)=>{
   
        User.findById(req.params.cash_id)
        .then((cashs)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type' , 'application/json');
            res.json(cashs);
        },(err)=>next(err))
    .catch((err)=>next(err));
});

module.exports = CashierRouter;