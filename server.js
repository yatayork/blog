const express = require("express"); // 帶入express
const mongoose = require("mongoose"); //載入mongoose
const articleRouter = require("./routes/article"); //導入文章的routes
const Articles = require("./models/article"); //導入我們的schema(我們需要從db的blog collection 裡拿出這個Schema(資料表))
const methodOverride = require("method-override");
const app = express();

mongoose.connect(
    "mongodb://127.0.0.1:27017/blog?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.1",
    { useNewUrlParser: true, useUnifiedTopology: true }
); //這一串url為local端測試用的url 27017後的blog為這次放入的collections

app.set("view engine", "ejs"); //ejs 使用ejs模板

app.use(express.urlencoded({ extended: false })); //可以讓express解析encoded
app.use(methodOverride("_method")); //稍後講解

// get("/") 首頁
app.get("/", async (req, res) => {
    const articles = await Articles.find().sort({ createdAt: "desc" });
    //articles 是用mongoose find()函式 從DB裡面掏出 Articles 這個在blog collection 的Articles的資料表所有的資料並以降幕sort(這個資料表)讓最新永遠保持在第一個
    res.render("articles/index", { articles: articles });
    //透過express搭配ejs使用 已拿出來的articles 利用render函式將article帶入index.js使用
});

app.use("/articles", articleRouter); // articleRouter 的名稱指定為/articles 此articleRouter 是從/routes/article.js而來

app.listen(5000); //port訂在5000
