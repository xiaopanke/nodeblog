var express=require('express');
var router=express.Router();

router.get('/',(req,res,next) => {
  res.render('main/index',{
    userInfo:req.userInfo
  })
})

module.exports=router;
