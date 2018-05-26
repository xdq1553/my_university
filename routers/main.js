//前台展示页面
//引入express模块
const express = require("express");
//调用路由方法
const router = express.Router();

var data = {};

router.use(function(req, res,next){
    data = {
        userInfo: req.userInfo
    }
  next();
})
//渲染前台首页
router.use("/",function(req,res,next){
    res.render("main/index",data);
    // 不会阻塞
    next();
})

module.exports = router;
