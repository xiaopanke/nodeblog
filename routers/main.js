var express=require('express');
var router=express.Router();
var Category=require('../models/Category')
var Content=require('../models/Content')
//首页
router.get('/',(req,res,next) => {
  var data={
    userInfo:req.userInfo,
    category:req.query.category || '',
    categories:[],
    page:Number(req.query.page) || 1,
    limit:3,
    pages:0,
    count:0
  }
  var where={};
  if(data.category){
    where.category=data.category
  }
  //从数据库中读取分类信息
  Category.find().then((categories) => {
    data.categories=categories;
    return Content.where(where).count();
  }).then((count) => {
    data.count=count;
    data.pages=Math.ceil(count/data.limit);
    //取值不能超过pages
    data.page=Math.min(data.page,data.pages)
    //取值不能小于1
    data.page=Math.max(data.page,1)
    let skip=(data.page-1)*data.limit;

    return Content.where(where).find().limit(data.limit).skip(skip).populate(['category','user']).sort({addTime:-1})
  }).then((contents) => {
    data.contents=contents;
    console.log(data);
    res.render('main/index',data)
  })

})

module.exports=router;
