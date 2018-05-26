//加载数据库模块
const mongoose = require("mongoose");
//定义表结构，设置字段，并对外提供接口
module.exports = new mongoose.Schema({
    //用户名
    username: String,
    //用户密码
    password: String,
    //是否管理员
    isAdmin: {
      type: Boolean,
      default: false
    },
    collectid:{
      type: Array,
      default: []
    }
})
