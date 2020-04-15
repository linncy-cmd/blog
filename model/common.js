const mongoose = require("mongoose");
const commonSchema = new mongoose.Schema({
    aid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article",
    },
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    content: {
        type: String,
    },
    publicData: {
        type: Date,
        default: Date.now,
    }
});
const Common = mongoose.model("Common", commonSchema);
module.exports = {
    Common,
}