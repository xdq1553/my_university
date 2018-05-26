//前后端交互处理数据
//引入express模块
const express = require("express");
//调用路由方法
const router = express.Router();
//引入数据库模型
const User = require("../models/User");
const Content = require("../models/Content");
const Category = require("../models/Category");
const Usercontent = require("../models/Usercontent")
//定义一个统一的数据返回
var responseData;
//全局的路由
router.use(function(req,res,next){
    responseData = {
        code: 0,
        message: "",

    }

    next();
})
//监听/user/register请求并处理
router.post("/user/register",function(req,res,next){
    //处理post提交过来的数据

    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;
    var check = req.body.check;
    //表单验证
    if(username == ""){
        responseData.code = 1;
        responseData.message = "用户名不能为空";
        res.json(responseData);
        return;
    }else if(username.length >18 || username.length < 6){
        responseData.code = 10;
        responseData.message = "用户名长度必须为6~18位";
        res.json(responseData);
        return;
    }else if(!/[a-zA-Z]/.test(username[0])){
        responseData.code = 11;
        responseData.message = "用户名首字母必须为字母";
        res.json(responseData);
        return;
    }else if(/\W/.test(username)){
        responseData.code = 12;
        responseData.message = "用户名必须由数字字母下划线组成";
        res.json(responseData);
        return;
    }else if(check != "验证成功"){
      responseData.code = 13;
      responseData.message = "请拖动滑块验证";
      res.json(responseData);
      return;
    }
    //密码不能为空
    if(password == ""){
        responseData.code = 2;
        responseData = "密码不能为空";
        res.json(responseData);
        return;
    }
    //两次输入密码不一致
    if(password != repassword){
        responData.code = 3;
        responseData.message = "两次输入的密码不一致";
        res.json(responseData);
        return;
    }
    //验证数据库
    User.findOne({
        username: username
    }).then(function(userInfo){

    if(userInfo){
    //表示数据库有该记录
        responseData.code = 4;
        responseData.message = "用户名已经被注册了";
        res.json(responseData);
        return;
    }
    //保存userInfo
    var user = new User({
        username: username,
        password: password
    });
    //保存数据
    return user.save();

    }).then(function(newUserInfo){
        responseData.message = "注册成功";
        res.json(responseData);
        return;
    })

})

//监听user/login请求并处理
router.post("/user/login", function(req, res, next){
    var username = req.body.username;
    var password = req.body.password;

    if(username == "" || password == ""){
        responseData.code = 1;
        responseData.message = "用户名和密码不能为空";
        res.json(responseData);
        return;
    }
//数据库验证
    User.findOne({
        username: username,
        password: password
    }).then(function(userInfo){
        if(!userInfo){
            responseData.code = 2;
            responseData.message = "用户名或密码错误";
            res.json(responseData);
            return;
        }
        //用户名和密码都正确
        //将登录信息返回前端页面
        responseData.message = "登录成功";
        responseData.userInfo = {
            _id: userInfo._id,
            username: userInfo.username
        };
        //将cookies存储
        req.cookies.set("userInfo", JSON.stringify({
            _id: userInfo._id,
            username: userInfo.username
        }))
        res.json(responseData);
        return;
    })
})
//退出的路由
router.get("/user/logout", function(req, res,next){
    //将cookie删除
    req.cookies.set("userInfo", null);
    res.json(responseData);
    next();
})

/*
    评论提交
*/
router.post("/comment/post", function(req, res){
    //内容id
    var contentId = req.body.contentid || "";
    var content = req.body.content || "";
    console.log(content);

    var postData = {
        username: req.userInfo.username,
        postTime: new Date(),
        content: content
    }

    //查询当前这篇内容的信息
    Content.findOne({
        _id: contentId
    }).then(function(content){
        //插入本次提交的数据，并保存
        content.comments.push(postData);
        return content.save();
    }).then(function(newContent){
        // alert(1);
        responseData.message = "评论成功";
        responseData.data = newContent;
        res.json(responseData);
    })
})

// 用户写帖子
router.post("/usercontent/plus",function(req,res){
    console.log(req.body.categoryid);
    var userid = req.body.userid;
    var categoryid = req.body.categoryid;
    var title = req.body.title;
    var description = req.body.description;
    var content = req.body.content;
    //验证数据是否为空
    if(categoryid == ""){
        responseData.message = "分类不能为空";
        responseData.code = 20;
        res.json(responseData);
        return;
    }else if(title == ""){
        responseData.message = "标题不能为空";
        responseData.code = 21;
        res.json(responseData);
        return;
    }else if(description == ""){
        responseData.message = "简介不能为空";
        responseData.code = 22;
        res.json(responseData);
        return;
    }else if(content == ""){
        responseData.message = "内容不能为空";
        responseData.code = 23;
        res.json(responseData);
        return;
    }

    //保存数据库
   new Content({
        category: categoryid,
        user: userid,
        addTime: new Date(),
        content: content,
        title:title,
        description: description,
    }).save().then(function(newContent){
        responseData.message = "发表成功";
        responseData.data = newContent;
        res.json(responseData);
    })


})


//点赞
router.post("/usercontent/good",function(req,res){
  var goodNum = req.body.goodNum;
  var contentid = req.body.contentid;
  if(req.userInfo.username){
    if(contentid){
    // console.log(goodNum);
      Content.findOne({_id: contentid}).then(function(content){

        content.good++;
        return content.save();
      }).then(function(newContent){
        responseData.data = newContent;
        res.json(responseData);
      })
    }
  }
})

// 点击收藏
router.post("/usercontent/collect",function(req,res){
  var collectNum = req.body.collectNum;
  var contentid = req.body.contentid;
  if(req.userInfo.username){
    if(contentid){
      Content.findOne({_id: contentid}).then(function(content){
        content.collect++;
        return content.save();
      }).then(function(newContent){
        responseData.data = newContent;
        res.json(responseData);
      })
      //保存到个人库
      Content.findOne({_id: contentid}).then(function(content){
        if(Usercontent.collectid == content._id){
          console.log("收藏过了")
        }else{
          User.find({username:req.userInfo.username }).then(function(user){
            user.collectid.push(content._id);
            return user.save();
          })
        }
      })
    }
  }
})

module.exports = router;
