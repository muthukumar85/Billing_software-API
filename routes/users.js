var express = require('express');
var router = express.Router();
const BodyParser = require('body-parser');
const cors = require('./cors');
const User = require('../modules/user');
const passport = require('passport');
const authenticate = require('../authenticate');

router.use(BodyParser.json());
/* GET users listing. */
router.get('/',cors.corsWithOptions ,authenticate.verifyUser , authenticate.verifyAdmin , function(req, res, next) {
  if(req.user.account_type == 'admin'){
    User.find({'account_type':'user'})
      .then((users)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'application/json');
        res.json(users);
      },(err)=>next(err))
      .catch((err)=>next(err));
  }
  else{
    var err = new Error("You are not authorized to use this protocol");
    err.status = 403;
    next(err);
  }
});

router.get('/search',cors.corsWithOptions ,authenticate.verifyUser , authenticate.verifyAdmin , function(req, res, next) {
  if(req.user.account_type == 'admin'){
    User.find({'account_type':req.body.username})
      .then((users)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type' , 'application/json');
        res.json(users);
      },(err)=>next(err))
      .catch((err)=>next(err));
  }
  else{
    var err = new Error("You are not authorized to use this protocol");
    err.status = 403;
    next(err);
  }
});


router.post('/signup' , cors.corsWithOptions, authenticate.verifyUser,(req, res , next)=>{
  if(req.user.account_type == 'admin'){
  User.register(new User({username: req.body.username}) , req.body.password , (err , user)=>
      {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type' , 'application/json');
        res.json({err:err});
      }
      else{
        console.log(req.body);
        if (req.body.mobile) {
          user.mobile = req.body.mobile;
        }
        if (req.body.email) {
          user.email = req.body.email;
        }
        if (req.body.account_type) {
          user.account_type = req.body.account_type;
        }
        if (req.body.address) {
          user.address = req.body.address;
        }
        if (req.body.age) {
          user.age = req.body.age;
        }
        user.save((err , user)=>{
          if(err){
            res.statusCode = 500;
            res.setHeader('Content-Type' , 'application/json');
            res.json({err:err});
            // return ;
          }
          passport.authenticate('local')(req , res , ()=>{
            res.statusCode = 200;
            res.setHeader("Content-Type" , 'application/json');
            res.json({success:true , status: 'Registeration successful' });
           });
        });
      }
    });
  }
  else{
    var err = new Error("you are not authorized to perform this operation");
        err.status = 403;
        next(err);
  }
});

router.post('/login' ,cors.corsWithOptions ,(req , res , next)=>{
//  var token = authenticate.getToken({_id:req.user._id})
//  res.statusCode = 200;
//  res.setHeader('Content-Type' , 'application/json');
//  res.json({success:true , token:token,status :"You are successfully logged in!"});
passport.authenticate('local', (err, user, info) => {
  if (err)
    return next(err);

  if (!user) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, status: 'Login Unsuccessful!', err: info});
  }
  req.logIn(user, (err) => {
    if (err) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: false, status: 'Login Unsuccessful!', err: 'Could not log in user!'});          
    }

    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, status: 'Login Successful!', token: token});
  }); 
}) (req, res, next);
  
});

router.get('/checkJWTtoken', cors.corsWithOptions, (req, res) => {
  passport.authenticate('jwt', {session: false}, (err, user, info) => {
    if (err)
      return next(err);
    
    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT invalid!', success: false, err: info});
    }
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT valid!', success: true, user: user});

    }
  }) (req, res);
});

router.get('/logout' , (req, res, next)=>{
  if(req.session){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else{
    var err = new Error("you are not logged in");
    err.status = 403;
    next(err);
  }
})

module.exports = router;