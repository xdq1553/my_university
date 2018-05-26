//加载express模块
const express = require("express");
//加载ejs模块
const ejs = require("ejs");
//加载数据库模块
const mongoose = require("mongoose");
//引入path模块
const path = require("path");
//引入body模型
const bodyParser = require("body-parser");
//引入cookie模型
const Cookies = require("cookies");
//找到表模型
const User = require("./models/User");
//创建APP应用
var app = express();

//设置在路由上面
app.use(bodyParser.urlencoded({extended: true}));
//设置模板文件的存储位置,当前文件目录路径下的views
app.set('views',path.join(__dirname,'views'));
//将模板的后缀改为html
// app.engine('html',ejs.__express);
app.engine('.html', require('ejs').__express);
//使用ejs的引擎模板
app.set('view engine','ejs');
//ejs模板清除缓存
// ejs.config({cache: false});


ejs.clearCache();

//设置cookie
app.use(function(req,res,next){
    req.cookies = new Cookies(req,res);
    //定义一个全局对象userInfo
    req.userInfo = {};
    if(req.cookies.get("userInfo")){
        try{
            req.userInfo = JSON.parse(req.cookies.get("userInfo"));
            //获取当前用户是否管理员
            User.findById(req.userInfo._id).then(function(userInfo){
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            })
        }catch(err){
            console.log(err);
        }
    }else{
        next();
    }
})
//设置静态文件托管
app.use("/public",express.static(__dirname + "/public"));
//根据功能进行模块的划分
//前后端交互，ajax的路由
app.use("/api",require("./routers/api"));
//blog页面
app.use("/blog",require("./routers/blog"));
//后台管理的路由
app.use("/admin",require("./routers/admin"));
//博文页面的路由
app.use("/view",require("./routers/blogview"));
// 个人中心页面
app.use("/personcenter",require("./routers/personcenter"));
//前端页面的路由
app.use("/",require("./routers/main"));
//监听
//监听请求
//链接数据库
mongoose.connect("mongodb://127.0.0.1:27017",function(err){
    try{
      console.log("数据库连接成功");
      //监听http请求
      app.listen(8088);
    }catch(err){
      console.log("数据库连接失败:" + err);
    }
})
