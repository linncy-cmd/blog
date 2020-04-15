//退出登录
module.exports = (req, res) => {
    //删除session
    req.session.destroy(function() {
        //删除cookie
        res.clearCookie("connect.sid");
        //清空userInfo对象
        req.app.locals.userInfo = null;
        //重定向到用户登录页面
        res.redirect("/admin/login");
    });
    console.log(req.session);
}