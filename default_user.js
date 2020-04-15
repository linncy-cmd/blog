//连接数据库
require("./model/connect");
const { User, vilidateUser } = require("./model/user");
const fs = require("fs");
const path = require("path");
async function origin() {
    let result = await User.findOne({ email: "admin@list.cn" });
    if (!result) {
        let user = new User({
            email: "admin@list.cn",
            name: "admin",
            role: "admin",
            password: "12345678",
            isUse: "1"
        });
        user.save();
        console.log("初始化管理员成功，你的管理员邮箱为admin@list.cn,密码为12345678");
    } else {
        console.log("初始化管理员成功，你的管理员邮箱为admin@list.cn,密码为12345678")
    }

}
origin();