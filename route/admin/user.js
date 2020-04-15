const { User } = require("../../model/user");
module.exports = async(req, res) => {
    //标识当前访问页的Active
    req.app.locals.currentActive = "user";
    //获取当前页数
    let page = req.query.page || 1;
    //设置每页最大显示条目
    let pageSize = 10;
    //获取总的数据条目
    let count = await User.countDocuments({});
    //获取总的页数
    let total = Math.ceil(count / pageSize);
    //页码对应查询数据的开始位置
    let start = (page - 1) * pageSize;
    let user = await User.find().limit(pageSize).skip(start);
    // res.send(user);
    res.render("admin/user", {
        user: user,
        page: page,
        total: total,
    })
}