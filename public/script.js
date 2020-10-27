$(document).ready(function () {
    var count = 0;

    $(".digit").on('click', function () {
        var num = ($(this).clone().children().remove().end().text());
        if (count < 11) {
            $("#output").append('<span>' + num.trim() + '</span>');
            $("#entered-number").val($("#entered-number").val() + num.trim());
            count++
        }
    });

    $('.fa-long-arrow-left').on('click', function () {
        $('#output span:last-child').remove();
        count--;
    });

    $("#call").on('click', function () {
        console.log($("#entered-number").val());
        window.location = 'tel://' + $("#entered-number").val();
    });
});

