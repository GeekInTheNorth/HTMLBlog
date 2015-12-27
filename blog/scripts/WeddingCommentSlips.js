$(document).ready(function () {
    DisplayRandomComment();
});

function DisplayRandomComment() {
    var commentToShow = Math.floor(Math.random() * 19) + 1;

    ShowComment(commentToShow);
}

function DisplayNextComment() {
    var currentComment = $("body").data("data-comment-position");

    if (currentComment >= 19)
        currentComment = 1;
    else
        currentComment++;

    ShowComment(currentComment);
}

function DisplayPreviousComment() {
    var currentComment = $("body").data("data-comment-position");

    if (currentComment <= 1)
        currentComment = 19;
    else
        currentComment--;

    ShowComment(currentComment);
}

function HideAllComments() {
    $("div.comment-container").hide();
}

function ShowComment(commentNumber) {
    HideAllComments();
    $("body").data("data-comment-position", commentNumber);

    var commentId = "div#comment-" + commentNumber;

    $(commentId).show();
}