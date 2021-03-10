$(function () {

    let cantidadNodos = 0;
    let veloInicial = 40;
    let velocidad = veloInicial;
    const aceleracion = 0.2;
    let toLeft;
    let toRight;

    $("#cantidad").on("input", function (ev) {
        ev.preventDefault();
        if (ev.target.value > cantidadNodos) {
            $("#btn-qs").prop("disabled", true);
            $("#btn-ss").prop("disabled", true);
            $("#btn-cs").prop("disabled", true);
            toggleBotonesAnimacion(true);
        }
        crearArray(ev.target.value);
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
        $(".valores input").each(function () {

            $(this).val(Math.round(Math.random() * 200 - 100));

        });
        $("#btn-qs").prop("disabled", false);
        $("#btn-ss").prop("disabled", false);
        $("#btn-cs").prop("disabled", false);

    });

    let inputsLlenos = Array();

    $(".valores").on("input", "input", function (ev) {
        ev.preventDefault();

        if (estanCompletosLosNodos()) {
            $("#btn-qs").prop("disabled", false);
            $("#btn-ss").prop("disabled", false);
            $("#btn-cs").prop("disabled", false);

        }
    });

    let comun = "Animación de ordenamiento con ";

    $("#btn-qs").on("click", function (ev) {
        $("#nombre-anim").text(comun + "QuickSort");
        $("#estado").text("Animación por empezar");
        toggleBotonesAnimacion(false);
        crearListaDeNodos(1);
    });

    $("#btn-ss").on("click", function (ev) {
        $("#nombre-anim").text(comun + "SelectionSort");
        $("#estado").text("Animación por empezar");
        toggleBotonesAnimacion(false);
        crearListaDeNodos(2);
    });

    $("#btn-cs").on("click", function (ev) {
        $("#nombre-anim").text(comun + "CountingSort");
        $("#estado").text("Animación por empezar");
        toggleBotonesAnimacion(false);
        crearListaDeNodos(3);
    });

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

            for (let i = numero; i < cantidadNodos; i++) {
                $(".valores input")[i].remove();
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
        console.log(pantallaHTML);
    }

    const crearListaDeNodos = (tipo) => {
        if(LISTACREADA == false){
            const MAXELEMENTOS = 50;
        let contador = 1;
        
        crearPantalla(contador);      
        let pantalla = $("#p" + contador);  
        
        let maximun = 50;
        if (tipo == 1) {
            $(".valores input").each(function (index, element) {
                
                let nodo = crearNodoHTML($(element).val());
                pantalla.append(nodo);
                
                if(index >= maximun){
                    contador += 1;
                    maximun += MAXELEMENTOS;
                    crearPantalla(contador);  
                    pantalla = $("#p" + contador);  
                }
            });
        }
        LISTACREADA = true;
        }
        
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
        clon.css({
            "width": "40px",
            "margin-right": "10px"
        });
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