var mongoose = require("mongoose");

//定义用户的集合结构，对外的接口
module.exports = new mongoose.Schema({
	//分类名称
  content: {
    //类型
    type: mongoose.Schema.Types.ObjectId,
    //引用，我们分类表中的ID
    ref: "Content"
  },
  user: {
    //类型
    type: mongoose.Schema.Types.ObjectId,
    //引用，我们分类表中的ID
    ref: "User"
  },
  total: {
    type: Number,
    default: 0
  },
  collectid:{
    type: String,
    default:""
  }

})
