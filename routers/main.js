var express=require('express');
var router=express.Router();
var Category=require('../models/Category')
router.get('/',(req,res,next) => {
  //从数据库中读取分类信息
  Category.find().then((categories) => {
    res.render('main/index',{
      userInfo:req.userInfo,
      categories
    })
  })

})

module.exports=router;
