var express=require('express');
var router=express.Router();
var Category=require('../models/Category')
var Content=require('../models/Content')

var data;
//处理能用的数据
router.use((req,res,next) => {
  data={
    userInfo:req.userInfo,
    categories:[],
  }
    Category.find().then((categories) => {
      data.categories=categories;
      next();
    });
})

//首页
router.get('/',(req,res,next) => {
  data={
    ...data,
    ...{
      category:req.query.category || '',
      page:Number(req.query.page) || 1,
      limit:3,
      pages:0,
      count:0
    }
  }
  var where={};
  if(data.category){
    where.category=data.category
  }
  //从数据库中读取分类信息
  Content.where(where).count().then((count) => {
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
    res.render('main/index',data)
  })

})

//阅读全文
router.get('/view',(req,res) => {
  let {contentid}=req.query;
  Content.findOne({
    _id:contentid
  }).then((content) => {
    data.content=content;
    content.views++;
    content.save();
    res.render('main/view',data)
  })
})

module.exports=router;
