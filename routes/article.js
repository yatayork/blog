const express = require("express"); //帶入express 因為寫api 所以一樣帶入
const Article = require("./../models/article"); //帶入models
const router = express.Router(); //因為我們這個是寫router 讓server.js可以帶入 所以這邊是router= express.Router()

router.get("/new", (req, res) => {
    res.render("articles/new", { article: new Article() });
});
//這邊是server.js內我們app.get('/')<---(首頁)內render在index.ejs裡面的 新增文章按鈕所使用的api
//因為server.js已經app.get('/')了 所以這邊不用再做首頁的api
//新增頁面按下後觸發/articles/new api 畫面render成views資料夾裡的articles資歷夾的new.ejs 那article: new Article() 不加的話會在返回後再次按下時導致錯誤 因為前次按下時的Article已經不見了 我們再按一次後瀏覽器找不到那一個Article 所以我們要new一個Article 這邊先看到new.ejs

router.get("/edit/:id", async (req, res) => {
    const article = await Article.findById(req.params.id);
    res.render("articles/edit", { article: article });
});
//將畫面render成 edit.ejs的畫面 而這邊是在index.js的編輯按鈕使用到 只是get專於你按的那個文章的id而已 edit.ejs裡面的儲存按鈕才是連接到下面的put

router.get("/:slug", async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    if (article == null) res.redirect("/"); //如果找不到就回首頁
    res.render("articles/show", { article: article });
}); //這邊是單一文章展開查看時(查看更多)的api slug取代雜亂無章的id顯示再網址列上與title相同

router.post(
    "/",
    async (req, res, next) => {
        req.article = await new Article();
        next();
    },
    saveArticleAndRedirect("new")
);
//當new.ejs 也就是articles/new頁面觸發此api的時候 的時候
//首先req.article是我們要給post出去哦schema弄好的規格 那利用async來避免資料還沒準備好就直接進到下個步驟saveArticleAndRedirect("new")

router.put(
    "/:id",
    async (req, res, next) => {
        req.article = await Article.findById(req.params.id);
        next();
    },
    saveArticleAndRedirect("edit")
);
//這邊在router的使用上就會寫成 /articles/<%= article.id  %>?_method=PUT" 在edit.ejs 的submit 的form 的action 使用到

router.delete("/:id", async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect("/");
});

function saveArticleAndRedirect(path) {
    return async (req, res) => {
        //因為新增與編輯只差在path部分所以寫成一個funtion共用
        //因為我們在剛剛先把req.article =await new Article();了
        //這邊就可以帶入成article 在分別把所有東西去對的變數上
        let article = req.article;

        article.title = req.body.title;
        article.description = req.body.description;
        article.markdown = req.body.markdown;

        try {
            article = await article.save();
            //當正常時
            //save() mongoose的函式將資料(article送到db)
            res.redirect(`/articles/${article.slug}`); //並直接轉移到該文章頁面
        } catch (error) {
            res.render(`articles/${path}`, { article: article });
            //如果有問題 保持在該頁面不動 並且也不把輸入的東西刪掉 保持原樣
        }
    };
}

module.exports = router; //導出router
