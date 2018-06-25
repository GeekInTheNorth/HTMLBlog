var siteSettings = undefined;

function GetData(url, successHandler) {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open("get", url, true);
    xhr.onreadystatechange = function(e) {
        if (this.readyState == 4 && this.status == 200){
            var data = JSON.parse(this.responseText);
            successHandler(data);
        }
    };
    xhr.send();
}

var articleApp = new Vue({
    el: '#article-area',
    data: {
        post: {
            title: "",
            category: "",
            published: "",
            content: ""
        }
    },
    methods: {
        marked: function (input) {
            return marked(input);
        },
        articleSelected: function (title, category, filename, published){
            var url = "articles/" + filename;
            var xhr = new XMLHttpRequest();
            xhr.overrideMimeType("text/markdown");
            xhr.open("get", url, true);
            xhr.onreadystatechange = function(e) {
                if (this.readyState == 4 && this.status == 200){
                    articleApp.showArticle(title, category, published, this.responseText);
                }
            };
            xhr.send();
        },
        showArticle: function(title, category, published, content){
            this.post.title = title;
            this.post.category = category;
            this.post.published = published;
            this.post.content = content;

            $("#article-summary-area").hide();
            $("#article-area").show();
        }
    }
});

var summaryApp = new Vue({
    el: '#article-summary-area',
    data: {
        posts: [ ]
    },
    methods: {
        categorySelected: function (category){
            this.posts = [];
            var limit = 4;
            var articlesDisplayed = 0;
            if (category !== "Latest")
                limit = 99;

            for (var index in siteSettings.Articles){
                var article = siteSettings.Articles[index];
                if (category === "Latest" || category === article.Category){
                    this.posts.push(article);
                    articlesDisplayed++;
                }

                if (articlesDisplayed >= limit)
                    break;
            }

            $("#article-area").hide();
            $("#article-summary-area").show();
        },
        hasPreviewImage: function (post){
            if (post.PreviewImage === undefined || post.PreviewImage === "")
                return false;
            return true;
        },
        summaryClick: function(post){
            articleApp.articleSelected(post.Title, post.Category, post.Filename, post.Published);
        }
    }
});

var categoryMenuApp = new Vue({
    el: '#menu-category',
    data: {
        categories: [ ]
    },
    methods:{
        showCategoryMenu: function () {
            for (var index in siteSettings.Articles){
                var category = siteSettings.Articles[index].Category;
                if (this.categories.indexOf(category) === -1)
                    this.categories.push(category);
            }
            this.categories.sort();
            this.categories.unshift("Latest");
        },
        menuClick: function (category){
            summaryApp.categorySelected(category);
        }
    }
});

function LoadSite(data){
    siteSettings = data;
    categoryMenuApp.showCategoryMenu();

    var showHomePage = true;
    
    var articleRequested = getUrlVar("article");

    if (articleRequested !== undefined && articleRequested !== "")
    {
        for(var index in siteSettings.Articles){
            var article = siteSettings.Articles[index];
            if (article.Title.toLowerCase() === articleRequested.toLowerCase())
            {
                showHomePage = false;
                articleApp.articleSelected(article.Title, article.Category, article.Filename, article.Published);
                return;
            }
        }
    }

    if (showHomePage)
        summaryApp.categorySelected("Latest");
}

function getUrlVar(varName){
    var vars = getUrlVars();
    var varNamelc = varName.toLowerCase();

    if (vars.includes(varName.toLowerCase()))
        return vars[varName.toLowerCase()];

    return undefined;
}

function getUrlVars() {
    var vars = [], hash;
    var url = window.location.href;

    if (url.indexOf('?') === -1)
    {
        return vars;
    }

    var hashes = url.slice(url.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0].toLowerCase());
        vars[hash[0].toLowerCase()] = decodeURIComponent(hash[1]);
    }
    return vars;
}

$(document).ready(function () {
    GetData("data/contentlist.json", LoadSite);
});