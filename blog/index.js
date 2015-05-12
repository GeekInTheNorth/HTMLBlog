$(document).ready(function() {
    $.ajax({
        type: "Get",
        url: "./data/contentlist.json",
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
            var title = jsonData.Articles[0].Title;
            var fileName = jsonData.Articles[0].Filename;

            $("#menu-articles").append('<li><a href="#" onclick="javascript: ShowArticle(".data//' + fileName + '");">' + title + '</a></li>');
        }

        var inArray = $.inArray(jsonData.Articles[loop].Category, categories);
        if (inArray < 0)
            categories.push(jsonData.Articles[loop].Category);
    }
    
    for (var categoryLoop = 0; categoryLoop < categories.length; categoryLoop++) {
        $("#menu-categories").append('<li><a href="#" onclick="javascript: ShowArticlesInCategory(' + categories[categoryLoop] + ');">' + categories[categoryLoop] + '</a></li>');
    }
}

function ShowArticle(fileName) {
    
}

function ShowArticlesInCategory(category) {
    
}

function DisplayConnectionError() {
    
}