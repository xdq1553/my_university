//引入express模块
const express = require("express");
//调用路由方法
const router = express.Router();var mongoose = require('mongoose');
//引入数据库模型
var Category = require("../models/Category");
var Content = require("../models/Content");
var Usercontent = require("../models/Usercontent");
var User = require("../models/User");

var persondata = {};
  var collectid = "";
router.use(function(req, res, next){
    persondata = {
        userInfo: req.userInfo,
        content:[],
        user: [],
        content_1 : []
    }

    Content.find({user:{_id: req.userInfo._id}}).then(function(content){
      persondata.content= content;
        // console.log(content);
        next();
    })
    User.find({username:req.userInfo.username}).then(function(user){
      collectid= user.collectid;

    })
    Content.find({_id:collectid}).then(function(content){
      persondata.content_1 = content;
      console.log(persondata.content_1)
    })

})
//渲染个人页面
router.use("/",function(req,res,next){
    res.render("personcenter/index",persondata);
    // 不会阻塞

})

module.exports = router;
