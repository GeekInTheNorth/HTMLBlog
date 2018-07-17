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
            Title: "",
            Category: "",
            Published: "",
            Content: "",
            Preview: "",
            PreviewImage: "",
            Carousel: []
        }
    },
    updated: function () {
        // Markdown does not add classes to objects or targets to anchor tags, so we have to do this ourselves.
        $("div#article-area a").attr("target", "_blank");
        $("div#article-area table").addClass("table table-hover");
        $("div#article-area blockquote").addClass("blockquote");
        $("div#article-area blockquote p").addClass("mb-0");
        $("div#article-area p:contains('Published:')").addClass("text-muted small")
    },
    methods: {
        marked: function (input) {
            if (input === undefined)
                return "";

            return marked(input);
        },
        articleSelected: function (postToDisplay){
            var url = "articles/" + postToDisplay.Filename;
            var xhr = new XMLHttpRequest();
            xhr.overrideMimeType("text/markdown");
            xhr.open("get", url, true);
            xhr.onreadystatechange = function(e) {
                if (this.readyState == 4 && this.status == 200){
                    articleApp.showArticle(postToDisplay, this.responseText);
                }
            };
            xhr.send();
        },
        showArticle: function(postToDisplay, content){
            postToDisplay.Content = content;
            this.post = postToDisplay;

            $("#article-summary-area").hide();
            $("#article-area").show();
        },
        hasCarousel: function(){
            if (post.Corusel === undefined)
                return false;
            if (post.Corusel.length === 0)
                return false;

            return true;
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
            articleApp.articleSelected(post);
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
                articleApp.articleSelected(article);
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
    var today = new Date();
    var contentUrl = "data/contentlist.json?v=" + today.getFullYear() + today.getMonth() + today.getDate() + today.getHours();

    GetData(contentUrl, LoadSite);
});