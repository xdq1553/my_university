//引入express模块
const express = require("express");
//调用路由方法
const router = express.Router();
//引入数据库模型
var Category = require("../models/Category");
var Content = require("../models/Content");
var Usercontent = require("../models/Usercontent");
//定义需要的数据
var data = {};
router.use(function(req,res,next){
    data = {
        userInfo: req.userInfo,
        categories: [],
        currentCategory: req.query.category || "",

    }
    Category.find().sort({_id:-1}).then(function(categories){
        data.categories = categories;
        next();
    })
    //查找数据库，找到数据库中对用的数据数
    Usercontent.find({user:req.query.user}).then(function(Usercontents){
      data.num = Usercontents[0].total;
    })
})
//加载博文页面
router.use("/",function(req,res,next){

  //加载博文
  var contentId = req.query.contentid || "";
	//查询具体的数据，渲染页面
	Content.findOne({
		_id: contentId
	}).populate("user").then(function(content){
		content.comments.reverse()
		data.content = content;
		//设置阅读量
		content.views++;
		content.save();
    res.render("blogview/index",data);

})
})
module.exports = router;
