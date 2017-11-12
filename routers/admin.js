var express=require('express');
var router=express.Router();

var User=require('../models/User');

router.use((req,res,next) => {
  if(!req.userInfo.isAdmin){//如果当前用户是非管理员
    res.send('对不起，只有管理员才可以进入后台管理 ');
    return;
  }else{
    next();
  }
})
//首页
router.get('/',(req,res,next) => {
  res.render('admin/index',{
    userInfo:req.userInfo
  })
})
//用户管理

router.get('/user',(req,res) => {
  /*
  limit(Number) 限制获取的数据条数  skip(2) 忽略数据的条数
  每页显示2条
  1：1-2 skip:0 ->（当前页-1）*limit
  2: 3-4  skip:2
  */

  let page=Number(req.query.page) || 1;
  let limit=10;

  let pages=0
  //获取数据库里的所有记录
  User.count().then((count) => {
    console.log(count);
    //总页数
    pages=Math.ceil(count/limit);
    //取值不能超过pages
    page=Math.min(page,pages)
    //取值不能小于1
    page=Math.max(page,1)
    let skip=(page-1)*limit;
    User.find().limit(limit).skip(skip).then((users) => {
      res.render('admin/user_index',{
        userInfo:req.userInfo,
        users,
        page,
        count,
        pages,
        limit
      })
    });
  });
})

/*分类首页*/
router.get('/category',(req,res) => {
  res.render('admin/category_index',{
    userInfo:req.userInfo
  })
})

/*分类的添加*/
router.get('/category/add',(req,res) => {
  res.render('admin/category_add',{
    userInfo:req.userInfo
  })
})
module.exports=router;
