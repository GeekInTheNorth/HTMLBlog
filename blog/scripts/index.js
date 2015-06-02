$(document).ready(function() {
    var menuPath = "./data/contentlist.json";

    $.ajax({
        type: "Get",
        url: menuPath,
        dataType: "json",
        headers: {
            accept: 'application/json'
        },
        success: function (jsonData) {
            PopulateHomePage(jsonData);
        },
        error: function () {
            DisplayConnectionError();
        }
    });
});

function PopulateHomePage(jsonData) {
	var numberOfArticles = jsonData.Articles.length;

    var maximumArticlesToDisplay = numberOfArticles;
    if (maximumArticlesToDisplay > 4) maximumArticlesToDisplay = 4;
	
	    for (var loop = 0; loop < numberOfArticles; loop++) {
			if (loop >= maximumArticlesToDisplay) break;

			var title = jsonData.Articles[loop].Title;
            var fileName = jsonData.Articles[loop].Filename;
			GetHtmlForArticle(fileName, title);
    }
}

function GetHtmlForArticle(fileName, title) {
	$.get("articles/"+fileName, function(articleContent) {
	    DrawArticlePreview(articleContent, fileName, title);
	});
}

function DrawArticlePreview(articleHtml, fileName, title) {
	var articlePreview = '<div class="articlePreview"><h2>' + title + '</h2>';

	var image = $(articleHtml).find("img.article-image");
    if ((image != null) && (image.length > 0)) {
        var imageTitle = image[0].title;
        var imageUrl = image[0].src;
        
        // The image has a relative url to it's owning page
        // however when reading this from a different folder in the website results in an incorrect url
        if ((imageUrl.toLowerCase().indexOf("/articles/") == -1) && (imageUrl.toLowerCase().indexOf("/images/") > -1))
            imageUrl = imageUrl.replace("/images/", "/articles/images/");
        
        articlePreview += '<img src="' + imageUrl + '" title="' + imageTitle + '" class="article-preview"/>';
    }
    
    var paragraphs = $(articleHtml).find("p");
    if ((paragraphs != null) && (paragraphs.length > 0)) {
        for (var i = 0; i < paragraphs.length; i++) {
            if (paragraphs[i].className == "published")
                continue;
            articlePreview += '<p>' + paragraphs[i].innerText + '</p>';
            break;
        }
    }

    articlePreview += '<a href="articles/' + fileName + '" class="article-link">Read More</a>';

    articlePreview += '</div>';
	$("#content-body").append(articlePreview);
}