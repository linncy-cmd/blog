const mongoose = require("mongoose");
const { User } = require("./user");
const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "请传入标题"],
    },
    author: {
        //关联User数据库
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "请传入作者"],
    },
    //发布时间
    publicData: {
        type: Date,
        default: Date.now,
    },
    //封面
    cover: {
        type: String,
    },
    content: {
        type: String,
    }
});
const Article = mongoose.model("Article", articleSchema);
// Article.create({ title: "三国演义", author: "5e47b58b667f51292853c0f8", }).then(() => console.log("创建成功"));
module.exports = {
    Article,
}