const mongoose = require("mongoose");
const marked = require("marked");
const slugify = require("slugify");
const createDomPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const DomPurify = createDomPurify(new JSDOM().window);

//新建mongoose 的Schema
const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    }, //主題
    description: {
        type: String,
        required: true,
    }, //一般的內文的前段或者描述
    markdown: {
        type: String,
        required: true,
    }, //可使用markdown的寫法
    createdAt: {
        type: Date,
        default: Date.now,
    }, //創建日期使用在subtitle
    //讓網址列並不會雜亂而是與title一樣
    slug: {
        type: String,
        required: true,
        unique: true,
    }, //unique 確保不會有第二個出現
    sanitizedHtml: {
        type: String,
        required: true,
    },
});

articleSchema.pre("validate", function (next) {
    //每一次要使用到這個schema都會在這預先通過一次檢測
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true }); //將slug的值帶入成全小寫的title
    }

    if (this.markdown) {
        this.sanitizedHtml = DomPurify.sanitize(marked.parse(this.markdown)); //讓markdown語法能正常顯示出來
    }
    next();
});

module.exports = mongoose.model("Article", articleSchema);
