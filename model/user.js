const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20,
    },
    email: {
        type: String,
        required: true,
        unique: true

    },
    password: {
        type: String,
        minlength: [6, "密码最小长度不小于6"],
    },
    //normal 表普通用户，admin表管理员
    role: {
        type: String,
        default: "normal"
    },
    // 状态，0表启用，1表禁用
    isUse: {
        type: String,
        default: "0"
    }
});
const User = mongoose.model("User", userSchema);
//  User.create({ name: "张三", email: "123@qq.com", password: "12345678" }).then(result => console.log(result));

module.exports = {
    User,
}