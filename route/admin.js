const express = require('express');
//创建子路由
const admin = express.Router();
//用于描述规则和设置验证器
const Joi = require("joi");
//路径处理模块
const path = require("path");
//解析复杂表单参数，如上传文件
const formidable = require("formidable");
//实现分页功能，导入模块
const pagnation = require("mongoose-sex-page");
//导入系统模块
const fs = require("fs");
//导入数据库规则模型函数
const { User } = require("../model/user");
const { Article } = require("../model/article");
//渲染登录界面
admin.get("/login", require("./admin/login"));
//接受并处理登录请求操作
admin.post("/login", require("./admin/loginPage"));
//渲染用户列表界面
admin.get("/user", require("./admin/user"));
//点击退出登录
admin.get("/logout", require("./admin/logout"));
//渲染用户添加和修改界面
admin.get("/user_edit", require("./admin/user_edit"));
admin.post("/user_edit", require("./admin/user_edit_fn"));
//实现列表界面修改功能
admin.post("/modify", async(req, res) => {
    let user = req.body;
    let id = req.query.id;
    let data = await User.findOne({ _id: id });
    let password = data.password;
    if (password == user.password) {
        User.updateOne({ _id: id }, req.body).then(() => console.log("修改成功"));
        res.redirect("/admin/user");
    } else {
        res.redirect(`/admin/user_edit?message=密码验证失败，修改失败&&id=${id}`);
    }

});
//实现删除模块
admin.get("/delect", async(req, res) => {
    let id = req.query.id;
    let role = req.query.role;
    console.log(role);
    if (role == "user") {
        await User.deleteOne({ _id: id });
        res.redirect("/admin/user");
    } else {
        await Article.deleteOne({ _id: id });
        res.redirect("/admin/article");
    }

});
//渲染文章管理页面
admin.get("/article", async(req, res) => {
    //标识当前访问页的Active
    req.app.locals.currentActive = "article";
    //获取当前页
    let page = req.query.page;
    //page()指定当前页
    //size()指定每页显示的数据条目
    //display()指定客户端要显示的页码数量
    //exec()向数据库发送查询请求
    let article = await pagnation(Article).find().page(page).size(2).display(3).populate("author").exec();
    // res.send(article);
    res.render("admin/article", { article: article });

});
//article的添加模块 
admin.post("/article", (req, res) => {
    //创建表单解析对象
    const form = new formidable.IncomingForm();
    //设置文件上传路径,__dirname 获取当前文件所在目录,
    form.uploadDir = path.join(__dirname, "../", "public", "uploads");
    //保留上传文件的后缀,一般都保留，否则文件打不开
    form.keepExtensions = true;
    //解析表单
    form.parse(req, (err, fields, files) => {
        //err错误对象，如果表单解析失败 err里面存储错误信息，如果表单解析成功 err为null
        //fields 对象类型 保存普通表单数据
        //files 对象类型 保存了和上传文件相关的数据
        Article.create({
            title: fields.title,
            author: fields.author,
            publicData: fields.publicData,
            cover: files.cover.path.split("public")[1],
            content: fields.content
        });
        res.redirect("/admin/article");
    });

});
//渲染article的用户添加和修改界面
admin.get("/article_edit", async(req, res) => {
    //标识当前访问页的Active
    req.app.locals.currentActive = "article";
    let id = req.query.id;
    let article = await Article.findOne({ _id: id });
    //修改操作
    if (article) {
        let link = "/admin/midify_article?id=" + id;
        res.render("admin/article_edit", {
            article: article,
            link: link,
        });
    } else {
        let link = "/admin/article";
        res.render("admin/article_edit", {
            link: link,
        })
    }

});
//article的修改功能
admin.post("/midify_article", async(req, res) => {
    //获取传过来的get请求的id参数
    let id = req.query.id;
    let article = await Article.findOne({ _id: id });
    //创建表单解析对象
    const form = new formidable.IncomingForm();
    //设置文件上传路径,__dirname 获取当前文件所在目录,
    form.uploadDir = path.join(__dirname, "../", "public", "uploads");
    //保留上传文件的后缀,一般都保留，否则文件打不开
    form.keepExtensions = true;
    //解析表单
    form.parse(req, async(err, fields, files) => {
        //err错误对象，如果表单解析失败 err里面存储错误信息，如果表单解析成功 err为null
        //fields 对象类型 保存普通表单数据
        //files 对象类型 保存了和上传文件相关的数据
        //article.cover.size 上传文件大小
        let isTrue = fs.existsSync(path.join(__dirname, "../", "public", article.cover));
        console.log("上传前istrue=" + isTrue);
        if (files.cover.size > 0) {
            // 又上传了文件删除原来服务器上的该用户之前上传文件
            if (isTrue) {
                fs.unlinkSync(path.join(__dirname, "../", "public", article.cover));
            }
            console.log("上传了");
        } else {
            fs.unlinkSync(files.cover.path);
            console.log("没传了");
        }
        isTrue = fs.existsSync(path.join(__dirname, "../", "public", article.cover));
        console.log("上传后istrue=" + isTrue);
        await Article.updateOne({ _id: id }, {
            title: fields.title,
            author: fields.author,
            publicData: fields.publicData,
            cover: isTrue ? article.cover : files.cover.path.split("public")[1],
            content: fields.content
        }).then("修改密码成功");
        res.redirect("/admin/article");
    });



});
module.exports = {
    admin: admin,
}