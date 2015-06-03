$(document).ready(function() {
    var urlVars = getUrlVars();
    var category = unescape(urlVars["category"]);

    $("#content-body").append('<h1>Category: ' + category + '</h1>');

    var menuPath = "./data/contentlist.json";
    var currentUrl = window.location.href;
    if (currentUrl.toLowerCase().indexOf("/articles/") > -1)
        menuPath = "../data/contentlist.json";

    $.ajax({
        type: "Get",
        url: menuPath,
        dataType: "json",
        headers: {
            accept: 'application/json'
        },
        success: function (jsonData) {
            PopulateCategoryPostList(jsonData, category);
        },
        error: function () {
            DisplayConnectionError();
        }
    });
});

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0].toLowerCase());
        vars[hash[0].toLowerCase()] = hash[1];
    }
    return vars;
}

function PopulateCategoryPostList(jsonData, category) {
    var numberOfArticles = jsonData.Articles.length;

    for (var loop = 0; loop < numberOfArticles; loop++) {
        var article = jsonData.Articles[loop];

        if ((category.toLowerCase() == article.Category.toLowerCase()) || (category.toLowerCase() == "all"))
            $("#content-body").append('<div class="article-description"><a href="' + GetArticlePath(article.Filename) + '");" class="article-title">' + article.Title + '</a><br><span class="published">Published: ' + article.Published + '</span></div>');
    }
}