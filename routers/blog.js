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
        usercontents: []
    }
    Category.find().sort({_id:-1}).then(function(categories){
        data.categories = categories;
        next();
    })
   // 博客的数量
    Content.find({user:{_id: req.userInfo._id}}).count().then(function(count){
      Usercontent.total = count;

      Usercontent.findOne({user:{_id: req.userInfo._id}}).then(function(result){
        if(result){
          // 保存数据库
          return Usercontent.update({user:{_id: req.userInfo._id}},{
              total: count
            });
          // return Promise.reject();
        }else {
          // 保存数据库
          return  new  Usercontent({
                  user:data.userInfo,
                  total: count
                }).save();
        }
      })

      console.log(Usercontent.total);
    })
})

//加载页面
router.use("/", function(req, res, next){

    // res.send("后台管理员页面");
    var where = {};
    if(data.currentCategory){
        where.category = data.currentCategory;
    }
    Content.where(where).then(function(){
        return  Content.where(where).find().sort({_id:-1}).populate(["category","user"]);
    }).then(function(contents){
        data.contents = contents;
        res.render("blog/index",data);
    })

})


module.exports = router;
