$(document).ready(function () {
    $("img#lego-image").data("data-image-position", 1);
});

function DisplayNextImage() {
    var currentImage = $("img#lego-image").data("data-image-position");

    if (currentImage >= 17)
        currentImage = 1;
    else
        currentImage++;

    ShowImage(currentImage);
}

function DisplayPreviousImage() {
    var currentImage = $("img#lego-image").data("data-image-position");

    if (currentImage <= 1)
        currentImage = 17;
    else
        currentImage--;

    ShowImage(currentImage);
}

function ShowImage(imageNumber) {
    $("img#lego-image").data("data-image-position", imageNumber);

    var fileLocation = "images/LegoDrWho";
    if (imageNumber < 10)
        fileLocation += "0";
    fileLocation += imageNumber + ".jpg";

    $("img#lego-image").attr("src", fileLocation);
}