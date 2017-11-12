// 应用程序的入口文件
let express=require('express');
let swig=require('swig'); //加载模板处理模块
let mongoose=require('mongoose'); //加载数据库模块
let bodyParser=require('body-parser'); //处理post提交过来的数据
let Cookies=require('cookies'); //加载cookies模块
var app=express();//创建app应用  =>Node js Http.screateHttp();


var User=require('./models/User')
//设置表态文件托管
//当用户访问的url以/public 开始，那么直接返回__dirname+'/public'下的文件
app.use('/public',express.static(__dirname+'/public'))

//定义当前应用所使用的模板引擎，第一个参数表示模板引擎的名称，也是模板文件的后缀，可以改（eg:tpl） 第二个参数是解析处理模板内容的方法
app.engine('html',swig.renderFile)

//设置模板文件存放的目录 ,第一个参数必须是views,第二个参数是目录
app.set('views','./views')

//注册模块，第一个参数必须是view engine 第二个参数和app.engine方法中定义的模板引擎的名称一致的
app.set('view engine','html')
//在开发过程中，需要取消模板缓存
swig.setDefaults({cache:false})
//bodyParser设置
app.use(bodyParser.urlencoded({extended:true}))

//设置cookie 无论用户访问哪个接口，都会走这个中间件
app.use((req,res,next) => {
  req.cookies=new Cookies(req,res);

  //解析登录用户的cookie信息
  req.userInfo={};
  if(req.cookies.get('userInfo')){
    try{
      req.userInfo=JSON.parse(req.cookies.get('userInfo'));
      //获取当前登录用户的类型，是否是管理员
      User.findById(req.userInfo._id).then((userInfo) => {
        req.userInfo.isAdmin=!!userInfo.isAdmin;
        next();
      })
    }catch(e){
      next();
    }
  }else{
    next();
  }
  console.log(typeof req.cookies.get('userInfo'));//string

})

//根据不同的功能划分模块
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));
// app.get('/main.css',(req,res,next) => {
//   res.setHeader('content-type','text/css')
//   res.send('body{background:red;}')
// })

//监听http请求
mongoose.connect('mongodb://localhost:27018/blog',(err) => {
  if(err){
    console.log('数据库连接失败');
  }else{
    console.log('数据库连接成功');
    app.listen(8081);
  }
});


//用户发送http请求->url ->解析路由->找到匹配的规则->执行绑定的函数，返回对应的内容至用户
//public ->静态文件 ->直接读取指定目录下的文件，返回给用户
//->动态->处理业务逻辑
