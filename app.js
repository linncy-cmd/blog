const express = require('express');
//处理路径
const path = require("path");
//创建网站服务器
const app = express();
//引入body-Parser 模块，用来处理post 请求参数
const bodyParser = require("body-parser");
//导入session 模块，用于记录cookie
const session = require("express-session");
// 导入art-template 模板引擎
const template = require("art-template");
//导入第三方时间处理模块dateformat
const dateformat = require("dateformat");
//告诉express 框架模板存放的位置
app.set("views", path.join(__dirname, "views"));
//告诉express 框架模板的默认后缀是什么
app.set("view engine", "art");
//告诉express默认使用模板引擎，express-art-template依赖于art-template
app.engine('art', require("express-art-template"));
//向所有模板开放dateformat 方法
template.defaults.imports.dateformat = dateformat;
//开放静态资源
app.use(express.static(path.join(__dirname, "public")));
//连接数据库
require('./model/connect');
const { User } = require("./model/user");
//拦截和处理post参数
app.use(bodyParser.urlencoded({ "extended": true }));
//记录用户是否登录,saveUninitialized:false 代表在没用session 对象时，不主动生成一个空的session 对象
app.use(session({ secret: "secret key", resave: false, saveUninitialized: false }));

const home = require("./route/home");
const { admin } = require('./route/admin');
//拦截请求，判断用户是否登录
app.use("/admin", (req, res, next) => {
    if (req.url != "/login" && !req.session.name) {
        res.redirect("/admin/login");
    } else {
        //如果登录状态是普通用户
        console.log(req.session.role);
        if (req.session.role == "normal") {
            //让它跳转到博客首页
            return res.redirect("/home/default");
        }
        next();
    }
});
app.use("/home", home);
app.use("/admin", admin);
//错误处理中间件有四个参数，而接受过来next()中的参数就是err
app.use((err, req, res, next) => {
    //next参数为字符串类型,转对象用JSON.parse()方法
    let result = JSON.parse(err);
    res.redirect(`${result.path}?message=${result.message}`);
})

app.listen(3000);
console.log("服务器启动成功");