var express=require('express');
var router=express.Router();

var User=require('../models/User');
var Category=require('../models/Category');
var Content=require('../models/Content');

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
        limit,
        type:'user'
      })
    });
  });
})

/*分类首页*/
router.get('/category',(req,res) => {
  let page2=Number(req.query.page) || 1;
  console.log(page2);
  let limit2=10;

  let pages2=0
  //获取数据库里的所有记录
  Category.count().then((count2) => {
    //总页数
    pages2=Math.ceil(count2/limit2);
    //取值不能超过pages
    page2=Math.min(page2,pages2)
    //取值不能小于1
    page2=Math.max(page2,1)
    let skip2=(page2-1)*limit2;
    Category.find().sort({_id:-1}).limit(limit2).skip(skip2).then((categories) => {
      res.render('admin/category_index',{
        userInfo:req.userInfo,
        categories,
        page:page2,
        count:count2,
        pages:page2,
        limit:limit2,
        type:'category'
      })
    });
  });
})

/*分类的添加*/
router.get('/category/add',(req,res) => {
  res.render('admin/category_add',{
    userInfo:req.userInfo
  })
})
/*分类的保存*/
router.post('/category/add',(req,res) => {
  var name=req.body.name || '';
  if(!name){
    res.render('admin/error',{
      userInfo:req.userInfo,
      message:'名称不能为空'
    });
    return
  }
  //数据库中是否已经存在同名分类名称
  Category.findOne({
    name
  }).then((rs) => {
    if(rs){
      res.render('admin/error',{
        userInfo:req.userInfo,
        message:'分类已经存在'
      });
      return Promise.reject();
    }else{
      //数据库中不存在该分类，可以保存
      return new Category({
        name
      }).save();
    }
  }).then((newCategory) => {
    res.render('admin/success',{
      userInfo:req.userInfo,
      message:'分类保存成功',
      url:'/admin/category'
    });
  })
})

//分类修改
router.get('/category/edit',(req,res) => {
  //获取要修改的分类的信息，并且用静音的形式展现出来
  var id=req.query.id || '';
  Category.findOne({
    _id:id
  }).then((category) => {
    if(!category){
      res.render('admin/error',{
        userInfo:req.userInfo,
        message:'分类信息不存在'
      });
      return Promise.reject();
    }else{
      res.render('admin/category_edit',{
        userInfo:req.userInfo,
        category
      });
    }
  })
})
//分类的修改保存
router.post('/category/edit',(req,res) => {
  //获取要个性的分类的信息，并且用静音的形式展现出来
  var id=req.query.id || '';
  //获取post提交过来的名称
  var name=req.body.name || '';
  Category.findOne({
    _id:id
  }).then((category) => {
    if(!category){
      res.render('admin/error',{
        userInfo:req.userInfo,
        message:'分类信息不存在'
      });
      return Promise.reject();
    }else{
      //当用户没有做任何的修改提交的时候
      if(name == category.name){
        res.render('admin/success',{
          userInfo:req.userInfo,
          message:'修改成功',
          url:'/admin/category'
        });
        return Promise.reject();
      }else{
          //要修改的分类名称是否已经在数据库中存在
        return   Category.findOne({
            _id:{$ne:id},
            name
          })
      }

    }
  }).then((sameCategory) => {
      if(sameCategory){
        res.render('admin/error',{
          userInfo:req.userInfo,
          message:'数据库中已经存在同名分类'
        });
        return Promise.reject();
      }else{
        return Category.update({
          _id:id
        },{
          name
        })
      }
  }).then(() => {
    res.render('admin/success',{
      userInfo:req.userInfo,
      message:'修改成功',
      url:'/admin/category'
    });
  })
})
//分类删除
router.get('/category/delete', (req,res) => {
  var id=req.query.id || '';
  Category.remove({
    _id:id
  }).then(() => {
    res.render('admin/success',{
      userInfo:req.userInfo,
      message:'删除成功',
      url:'/admin/category'
    });
  })
})
//内容首页
router.get('/content',(req,res) => {
  let page3=Number(req.query.page) || 1;
  console.log(page3);
  let limit3=10;

  let pages3=0
  //获取数据库里的所有记录
  Content.count().then((count3) => {
    pages3=Math.ceil(count3/limit3);
    page3=Math.min(page3,pages3)
    page3=Math.max(page3,1)
    let skip3=(page3-1)*limit3;
    Content.find().sort({_id:-1}).limit(limit3).skip(skip3).populate('category').then((contents) => {
      console.log(contents);
      res.render('admin/content_index',{
        userInfo:req.userInfo,
        contents,
        page:page3,
        count:count3,
        pages:page3,
        limit:limit3,
        type:'content'
      })
    });
  });
})
//内容添加
router.get('/content/add',(req,res) => {
  Category.find().sort({_id:-1}).then((categories) => {
    res.render('admin/content_add',{
      userInfo:req.userInfo,
      categories
    })
  })

})
//内容保存
router.post('/content/add',(req,res) => {
  if(!req.body.category){
    res.render('admin/error',{
      userInfo:req.userInfo,
      message:'内容分类不能为空',
    });
    return;
  }
  if(!req.body.title){
    res.render('admin/error',{
      userInfo:req.userInfo,
      message:'内容标题不能为空',
    });
    return;
  }
  //保存到数据库
  new Content({
    ...req.body
  }).save().then((rs) => {
    res.render('admin/success',{
      userInfo:req.userInfo,
      message:'内容保存成功',
      url:'/admin/content'
    });
  })
})

module.exports=router;
