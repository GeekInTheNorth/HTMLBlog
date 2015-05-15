$(document).ready(function () {
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
            PopulateMenu(jsonData);
        },
        error: function () {
            DisplayConnectionError();
        }
    });
});

function PopulateMenu(jsonData) {
    var numberOfArticles = jsonData.Articles.length;
    var categories = [];

    var maximumArticlesToDisplay = numberOfArticles;
    if (maximumArticlesToDisplay > 5) maximumArticlesToDisplay = 5;

    for (var loop = 0; loop < numberOfArticles; loop++) {
        if (loop <= maximumArticlesToDisplay) {
            var title = jsonData.Articles[loop].Title;
            var fileName = jsonData.Articles[loop].Filename;

            $("#menu-articles").append('<li><a href="'+GetArticlePath(fileName)+'");">' + title + '</a></li>');
        }

        var inArray = $.inArray(jsonData.Articles[loop].Category, categories);
        if (inArray < 0)
            categories.push(jsonData.Articles[loop].Category);
    }

    for (var categoryLoop = 0; categoryLoop < categories.length; categoryLoop++) {
        $("#menu-categories").append('<li><a href="#" onclick="javascript: ShowArticlesInCategory(' + categories[categoryLoop] + ');">' + categories[categoryLoop] + '</a></li>');
    }
}

function GetArticlePath(fileName) {
    var menuPath = "./articles/" + fileName;
    var currentUrl = window.location.href;
    if (currentUrl.toLowerCase().indexOf("/articles/") > -1)
        menuPath = "../articles/" + fileName;

    return menuPath;
}

function DisplayConnectionError() {
    
}