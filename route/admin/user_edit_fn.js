const { User } = require("../../model/user");
//用于描述规则和设置验证器
const Joi = require("joi");
module.exports = async(req, res, next) => { //当接受到来自/admin/user_edit地址的post请求时触发
    // res.send(req.body);req.body为接受来的post请求参数
    // 定义对象的验证规则
    let schema = {
        name: Joi.string().min(2).max(20).required().error(new Error("name 属性没有符合规则")),
        email: Joi.string().email().required().error(new Error("请输入正确的邮箱地址格式")),
        password: Joi.string().required().min(6).regex(/^[a-zA-Z0-9]{3,30}$/).error(new Error("密码格式不正确")),
        role: Joi.string().valid("admin", "normal").required().error(new Error("角色值异常")),
        isUse: Joi.string().valid("0", "1").required().error(new Error("角色状态异常")),
    };
    try {
        await Joi.validate(req.body, schema);
    } catch (e) {
        //  //调用错误处理中间件,对象转字符串JSON.stringify(),next()传入参数只能是字符串
        // res.redirect(`/admin/user_edit?message=${e.message}`);
        return next(JSON.stringify({ path: "/admin/user_edit", message: e.message }));
    }
    //判断新增用户是否已经存在
    let user = await User.findOne({ email: req.body.email });
    console.log(user);
    // let user = User.find(email);
    if (user) {
        //调用错误处理中间件
        res.redirect(`/admin/user_edit?message=用户已经存在`);
    } else { //添加用户到数据库，然后渲染
        await User.create(req.body);
        res.redirect("/admin/user");
    }

}