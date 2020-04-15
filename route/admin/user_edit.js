const { User } = require("../../model/user");
module.exports = async(req, res) => {
    //标识当前访问页的Active(css样式是否应用)
    req.app.locals.currentActive = "user";
    //接受get请求参数
    let { message, id } = req.query;
    let user = await User.findOne({ _id: id });
    if (user) {
        //修改操作
        let link = "/admin/modify?id=" + id;
        let btn = "修改";
        //渲染
        res.render("admin/user_edit", {
            message: message,
            user: user,
            link: link,
            btn: btn
        });
    } else {
        //添加操作
        let link = "/admin/user_edit";
        let btn = "添加";
        //渲染
        res.render("admin/user_edit", {
            message: message,
            link: link,
            btn: btn
        });
    }

}