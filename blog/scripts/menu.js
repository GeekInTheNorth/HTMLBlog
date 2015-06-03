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
    $("div.left-hand-menu").append('<div class="menu-container"><a href="' + GetRootPagePath('index.html') + '" class="menu-home-link" style="background-image: url(' + GetRootPagePath('images/TrooperAndMeSmall.png') + '); background-size: cover;"></a><div class="menu-body" id="menu-header-links"></div></a>');
	$("div.left-hand-menu").append('<div class="menu-container"><div class="menu-header">Articles</div><div class="menu-body"><ul id="menu-articles" class="menu-list"></ul></div></div>');
	$("div.left-hand-menu").append('<div class="menu-container"><div class="menu-header">Categories</div><div class="menu-body"><ul id="menu-categories" class="menu-list"></ul></div></div>');
	$("div.left-hand-menu").append('<div class="menu-container"><div class="menu-header">Links</div><div class="menu-body"><ul id="menu-links" class="menu-list"></ul></div></div>');
	$("#menu-categories").append('<li><a href="' + GetRootPagePath('Categories.html') + '?category=All");">All</a></li>');
	$("#menu-links").append('<li><a href="http://thenorthcode.net/" target="_blank">Rob Bollons<br/>(The North Code)</a></li>');
	$("#menu-links").append('<li><a href="https://mark11h.wordpress.com/" target="_blank">Mark Hinchliffe</a></li>');
	$("#menu-links").append('<li><a href="http://spatterson.me.uk/" target="_blank">Steve Patterson<br/>(The Porridge Box)</a></li>');
	$("#menu-header-links").append('<a href="https://twitter.com/GeekInTheNorth" class="social-media-link" style="background-image: url(' + GetRootPagePath('images/twitter.png') + ');" target="_BLANK" title="Twitter"></a>');
	$("#menu-header-links").append('<a href="https://github.com/GeekInTheNorth" class="social-media-link" style="background-image: url(' + GetRootPagePath('images/github.png') + ');" target="_BLANK" title="GitHub"></a>');

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
        $("#menu-categories").append('<li><a href="' + GetRootPagePath('Categories.html') + '?category=' + categories[categoryLoop] + '");">' + categories[categoryLoop] + '</a></li>');
    }
}

function GetArticlePath(fileName) {
    var menuPath = "./articles/" + fileName;
    var currentUrl = window.location.href;
    if (currentUrl.toLowerCase().indexOf("/articles/") > -1)
        menuPath = "../articles/" + fileName;

    return menuPath;
}

function GetRootPagePath(fileName) {
    var menuPath = fileName;
    var currentUrl = window.location.href;
    if (currentUrl.toLowerCase().indexOf("/articles/") > -1)
        menuPath = "../" + fileName;
    
    return menuPath;
}

function DisplayConnectionError() {
    
}