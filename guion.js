$(function () {

    /*
        * BUG 01: A veces, al aumentar el número de nodos, no se crean inputs para introducir sus valores.
        * BUG 02: Al cambiar el número de nodos deberia de borrarse el array de animación.       
    */

    /*TODO:
        * Mejorar la función para llevar elementos a sus respectivas posiciones
        * Eliminar el array de animaciçon ante cualquier cambio en la entrada y reiniciar las variables
    */
    let cantidadNodos = 0;
    let veloInicial = 40;
    let velocidad = veloInicial;
    const aceleracion = 0.2;
    let toLeft;
    let toRight;
    let permiteRepetidos = false;

    $("#cantidad").on("input", function (ev) {
        ev.preventDefault();

        if (ev.target.value > cantidadNodos) {
            $("#btn-qs").prop("disabled", true);
            $("#btn-ss").prop("disabled", true);
            $("#btn-cs").prop("disabled", true);
            toggleBotonesAnimacion(true);
        }
        if (ev.target.value === "") {
            crearArray(0);
        }
        else if (ev.target.value > 200) {
            crearArray(200);
            $("#cantidad").val(200);
        }
        else {
            crearArray(ev.target.value);
        }
    });

    $("#cantidad").on("keydown", function (ev) {
        if (ev.keyCode === 190 || ev.keyCode === 107 || ev.keyCode === 109) {
            ev.preventDefault();
        }
    });

    $("#izquierda").on("mousedown", function (ev) {
        ev.preventDefault();
        toLeft = setInterval(() => { moverCarrusel("left") }, 100);
    });

    $("#izquierda").on("mouseleave", function (ev) {
        ev.preventDefault();
        clearInterval(toLeft);
        velocidad = veloInicial;
    });

    $("#izquierda").on("mouseup", function (ev) {
        ev.preventDefault();
        clearInterval(toLeft);
        velocidad = veloInicial;
    });

    $("#derecha").on("mousedown", function (ev) {
        ev.preventDefault();
        toRight = setInterval(() => { moverCarrusel("right") }, 100);
    });

    $("#derecha").on("mouseleave", function (ev) {
        ev.preventDefault();
        clearInterval(toRight);
        velocidad = veloInicial;
    });

    $("#derecha").on("mouseup", function (ev) {
        ev.preventDefault();
        clearInterval(toRight);
        velocidad = veloInicial;
    });

    $("#alea-cantidad").on("click", function (ev) {
        ev.preventDefault();
        let random = Math.round(Math.random() * 100 + 3);
        $("#cantidad").val(random);
        crearArray(random);
    });

    $("#alea-valores").on("click", function (ev) {
        ev.preventDefault();
        if(!isNaN(parseInt($("#cantidad").val()))){
            $(".valores input").each(function () {

                $(this).val(Math.round(Math.random() * 200 - 100));
    
            });
            $("#btn-qs").prop("disabled", false);
            $("#btn-ss").prop("disabled", false);
            $("#btn-cs").prop("disabled", false);
        }        

    });

    let inputsLlenos = Array();

    $(".valores").on("input", "input", function (ev) {
        ev.preventDefault();

        if (estanCompletosLosNodos()) {
            $("#btn-qs").prop("disabled", false);
            $("#btn-ss").prop("disabled", false);
            $("#btn-cs").prop("disabled", false);

        }
        if (ev.target.value > 200) {
            crearArray(200);
            $("#cantidad").val(200);
        }
    });

    $(".valores").on("keydown", "input", function (ev) {

        let indexActual = $(this).index();
        let longitudDeInputs = $(".valores input").length - 1;

        if (ev.keyCode == 39) { //derecha
            if (indexActual < longitudDeInputs) {
                $(".valores input").eq(indexActual + 1).focus();
            }
        }
        else if (ev.keyCode == 37) { //izquierda
            if (indexActual > 0) {
                $(".valores input").eq(indexActual - 1).focus();
            }
        }

    });
    
    let oculto = false;

    tippy('#popup-btn-listo', {
        content: 'abasf',
    });

    $("#btn-qs").on("click", function (ev) {        
        ocultarConfiguraciones();          
        aparecerAnimaciones();
        toggleBotonesAnimacion(false);
        crearListaDeNodos();
        
    });

    const ocultarConfiguraciones = () => {
        if(!oculto){
            oculto = true;
            $(".ocultar").slideUp('fast', 'linear', function(){                
                $("#btn-qs").html("No Listo <i class='fas fa-check-circle text-right'></i>");
                $("#btn-qs").addClass('btn-danger');
                $("#btn-qs").removeClass('btn-success');
            });  
        }
        else {
            oculto = false;
            $(".ocultar").slideDown('fast', 'linear', function(){                
                $("#btn-qs").html("Listo <i class='fas fa-check-circle text-right'></i>");
                $("#btn-qs").addClass('btn-success');
                $("#btn-qs").removeClass('btn-danger');   
                         
            });  
        }
    }

    const aparecerAnimaciones = () => {
        if(oculto){
            $(".animacion").css("display", "block");   
            $("#estado").text("Animación por empezar");
        }
        else {
            $(".animacion").css("display", "none");   
            $("#estado").text("");
        }
    }

    const toggleBotonesAnimacion = (valor) => {
        $("#btn-play").prop("disabled", valor);
        $("#btn-pause").prop("disabled", valor);
        $("#btn-restart").prop("disabled", valor);
    }

    const crearArray = (numero) => {

        if (numero > cantidadNodos) {
            let nodos = numero - cantidadNodos;

            for (let i = 0; i < nodos; i++) {
                crearInput();

            }
            cantidadNodos = numero;
        }
        else if (numero < cantidadNodos) {

            while (numero < cantidadNodos) {
                if ($(".valores input")[numero] == undefined) {
                    break;
                }
                $(".valores input")[numero].remove();
            }
            cantidadNodos = numero;
        }
    }

    let LISTACREADA = false;

    const crearNodoHTML = (valor) => {
        let nodoHTML = "<div class='nodoHTML'><p class='nodo-valor'> " + valor + " </p></div>";
        return nodoHTML;
    };

    const crearPantalla = (id) => {
        let pantallaHTML = "<div class='pantalla' id='p" + id + "'></div>";
        $("#pantallas").append(pantallaHTML);

    }

    const crearListaDeNodos = () => {
        if (LISTACREADA) {
            $("#pantallas").empty();
        }

        const MAXELEMENTOS = 50;
        let contador = 1;

        crearPantalla(contador);
        let pantalla = $("#p" + contador);

        let maximun = 50;

        $(".valores input").each(function (index, element) {

            let nodo = crearNodoHTML($(element).val());
            pantalla.append(nodo);

            if (index >= maximun) {
                contador += 1;
                maximun += MAXELEMENTOS;
                crearPantalla(contador);
                pantalla = $("#p" + contador);
            }
        });

        LISTACREADA = true;


    }

    const estanCompletosLosNodos = () => {
        let retorno = true;

        $(".valores input").each(function (index, element) {
            if ($(element).val() === "") {
                retorno = false;
                return false;
            }
        });

        if (retorno == false) {
            return false;
        }
        else {
            return true;
        }
    }

    const crearInput = () => {
        let clon = $("#cantidad").clone();

        clon.val("");
        clon.attr("id", "");
        clon.attr("class", "nodo-value");
        clon.attr("min", "");
        clon.appendTo($(".valores"));
    }

    const moverCarrusel = (direccion) => {

        if (direccion === "left") {
            $(".valores").scrollLeft($(".valores").scrollLeft() - velocidad);
            velocidad += aceleracion;
        }
        else if (direccion === "right") {
            $(".valores").scrollLeft($(".valores").scrollLeft() + velocidad);
            velocidad += aceleracion;
        }
    }

})