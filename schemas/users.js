let mongoose=require('mongoose');

//用户的表结构
module.exports=new mongoose.Schema({
  //用户名，密码
  username:String,
  password:String,
  //是否是管理员
  isAdmin:{
    type:Boolean,
    default:false //新增用户默认是非管理用户
  }
})
