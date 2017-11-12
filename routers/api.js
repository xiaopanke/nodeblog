var express=require('express');
var router=express.Router();
let User=require('../models/User')

//统一返回格式
var responseDate;
router.use(function(req,res,next) {
  responseDate={
    code:0,
    message:''
  }
  next();
})
/*
注册逻辑
1.用户名不能为空
2.密码不能为空
3.两次输入密码必须一致

1.用户是否已经被 注册
数据库查询
*/
router.post('/user/register',(req,res,next) => {
  let {username,password,repassword}=req.body;
  if(username==''){
    responseDate.code=1;
    responseDate.message='用户名不能为空';
    res.json(responseDate);
    return;
  }
  if(password==''){
    responseDate.code=1;
    responseDate.message='密码不能为空';
    res.json(responseDate);
    return;
  }
  if(password !=repassword){
    responseDate.code=1;
    responseDate.message='两次输入的密码不一致';
    res.json(responseDate);
    return;
  }
  //用户名是否已经被 注册，
  User.findOne({ //findOne生成的是promise对象
    username:username
  }).then(function(userInfo) {
    if(userInfo){
      responseDate.code=4;
      responseDate.message='用户名已经被注册了';
      res.json(responseDate);
      return;
    }else{//保存用户注册的信息到数据库中
      var user=new User({
        username:username,
        password:password
      });
      return user.save()
    }
  }).then(function(newUserInfo) {
    //注册之后种上cookies，前台收到消息后，reload页面就是已经登陆的了
    req.cookies.set('userInfo',JSON.stringify({
      _id:newUserInfo._id,
      username:newUserInfo.username
    }))
    responseDate.message='注册成功';
    res.json(responseDate);
  })


})
/*
  登陆
*/
router.post('/user/login',(req,res) => {
  let {username,password}=req.body;
  if(username=='' || password==''){
    responseDate={
      code:1,
      message:'用户名和密码不能为空'
    }
    res.json(responseDate)
    return;
  }
  //查询数据库相同的用户和密码的记录是否存在 ，如果存在则登陆成功
  User.findOne({username,password}).then((userInfo) => {
      if(!userInfo){
        responseDate={
          code:2,
          message:'用户名或密码错误'
        }
      }else{
        responseDate.message='登陆成功';
        responseDate.userInfo=userInfo
      }
      req.cookies.set('userInfo',JSON.stringify({
        _id:userInfo._id,
        username:userInfo.username
      }))
      res.json(responseDate)
      return;
  })
})
router.get('/user/logout',(req,res) => {
  req.cookies.set('userInfo',null)
  responseDate.message='退出成功';
  res.json(responseDate)
})

module.exports=router;
