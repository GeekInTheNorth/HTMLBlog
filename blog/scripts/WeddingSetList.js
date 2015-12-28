$(document).ready(function () {
    $('table.content-list').each(function () {
        $("tr:odd").addClass("row").removeClass("alt-row");
        $("tr:even").addClass("alt-row").removeClass("row");
    });
});
