$(function(){

    

    $("#btn-play").on("click", function (ev) {
        $("#estado").text("Animación ejecutandose");
    });

    $("#btn-pause").on("click", function (ev) {
        $("#estado").text("Animación pausada");
    });

    $("#btn-restart").on("click", function (ev) {
        $("#estado").text("Animación reiniciada");
    });
})