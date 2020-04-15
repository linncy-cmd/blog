const express = require("express");
const home = express.Router();
const { Article } = require("../model/article");
const { Common } = require("../model/common");
const pagination = require("mongoose-sex-page");
home.get("/default", async(req, res) => {
    req.app.locals.currentPage = "default";
    let page = req.query.page;
    let article = await pagination(Article).find().page(page).size(4).display(3).populate("author").exec();
    res.render("home/default", {
        article: article
    });
});
home.get("/article", async(req, res) => {
    req.app.locals.currentPage = "article"
    let id = req.query.id;
    let article = await Article.findOne({ _id: id }).populate("author");
    let common = await Common.find({ aid: id }).populate("uid");
    console.log(common);
    res.render("home/article", {
        article: article,
        common: common,
    });
});
home.get("/logout", require('./admin/logout'));
home.post("/article", async(req, res) => {
    let { uid, aid, content } = req.body;
    Common.create(req.body);
    res.redirect(`/home/article?id=${aid}`);


});
module.exports = home;