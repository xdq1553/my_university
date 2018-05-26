var mongoose = require("mongoose");
var usersSchema = require("../schemas/usercontents");


//完成模型类
module.exports = mongoose.model("Usercontent", usersSchema);
