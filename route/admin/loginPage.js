const { User } = require("../../model/user");
module.exports = async(req, res) => {
    console.log((req.body));
    let { email, password } = req.body;
    if (email.trim().length == 0 || password.trim().length == 0) {
        res.status(400).render("common/error", { msg: "邮箱或者密码不能为空" });
    }
    let user = await User.findOne({ email: email });
    if (user) {
        if (user.password == password) {
            //为了判断用户是否登录
            req.session.name = user.name;
            //防止普通用户访问管理员首页
            req.session.role = user.role;
            // 向所有模板开放userInfo
            req.app.locals.userInfo = user;
            if (user.role == "admin") {
                res.redirect("/admin/user");
            } else {
                res.redirect("/home/default");
                return;
            }

        } else {
            res.status(400).render("common/error", { msg: "密码错误" })
        }
    } else {
        res.status(400).render("common/error", { msg: "账号不存在" });
    }
}