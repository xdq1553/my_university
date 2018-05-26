//创建模型类
const mongoose = require("mongoose");
//引入创建的表
var usersSchema = require("../schemas/users");

//完成一个模型类，可以对表中数据进行操作
module.exports = mongoose.model("User",usersSchema);

