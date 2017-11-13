let mongoose=require('mongoose');

//内容的表结构
module.exports=new mongoose.Schema({

  //分类信息 内容分类的id 关联字段
  category:{
    //类型
    type:mongoose.Schema.Types.ObjectId,
    //引用
    ref:'Category'

  },
  title:String,//标题
  description:{//简介
    type:String,
    defalut:''
  },
  //内容
  content:{
    type:String,
    default:''
  }
})
