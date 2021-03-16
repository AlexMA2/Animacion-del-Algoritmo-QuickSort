$(function () {

    let bgColorPivote = "#DAAADB"; //morado
    let bgColorI = "#F8A1A4"; // rojo
    let bgColorJ = "#98E0AD"; //verde
    let tiempoAvance = 800;
    let tiempoIntercambio = 2000;
    let quitarHeaderFooter = false;

    let i = 0;
    let j;
    let piv = 0;
    let longitud = 1;

    let animI;
    let animJ;
    let timeoutIntercambio;
    let reservaA;
    let reservaB;

    let estado = 0;

    let pila = [];

    let izq = 0;
    let der;

    let ejecI = false;
    let ejecJ = false;
    let inter = false;
    let interVerdadero = false;

    let dividido = true;

    $("#btn-qs").on("click", function (ev) {
        reiniciarDatosAnimacion();
    });

    $("#btn-play").on("click", function (ev) {
        ev.preventDefault();
        $("#btn-pause").prop("disabled", false);
        if ($(".pantalla").length > 0 && $(".nodoHTML").length > 0) {
            estado = 1;
            $("#estado").text("Animación ejecutándose");
            longitud = parseInt($("#cantidad").val());
            der = longitud - 1;
            setBackgrounds();
            pila.push([izq, der]);

            iniciarIntervalos();
            $(this).prop("disabled", true);
        }
    });

    $("#btn-pause").on("click", function (ev) {
        ev.preventDefault();
        $("#estado").text("Animación pausada");
        $(this).prop("disabled", true);
        $("#btn-restart").prop("disabled", false);
        if (estado == 1) {
            $(".titulo-principal h1").text(ejecI + " . " + ejecJ + " . " + inter);
            clearInterval(animI);
            clearInterval(animJ);
            clearTimeout(timeoutIntercambio);
        }
        estado = 2;
    });

    $("#btn-restart").on("click", function (ev) {
        ev.preventDefault();
        $("#estado").text("Animación reiniciada");
        $("#btn-pause").prop("disabled", false);
        $(this).prop("disabled", true);
        if (estado == 2) {
            estado = 1;

            if (inter && !interVerdadero) {
                intercambiarValores(reservaA, reservaB);
            }
            else if (ejecJ) {
                animJ = setInterval(reducirJ, tiempoAvance);
                $(".titulo-principal h1").text("ANIMJ");

            }
            else if (ejecI) {
                animI = setInterval(incrementarI, tiempoAvance);
                $(".titulo-principal h1").text("ANIMI");

            }
        }


    });

    const iniciarIntervalos = () => {
        if (estado == 1) {

            if (pila.length > 0 || !dividido) {

                if (dividido) {
                    dividido = false;
                    let siguiente = pila.pop();
                    i = siguiente[0];
                    piv = siguiente[0];
                    izq = siguiente[0];
                    j = siguiente[1];
                    der = siguiente[1];
                    $(".nodoHTML").css({
                        "backgroundColor": "#fff"
                    });

                }
                if (!ejecI) {
                    ejecI = true;
                    animI = setInterval(incrementarI, tiempoAvance);
                }

            }
            else {
                //Acabo de ordenar
                $("#estado").text("Animación terminada");
                $(".nodoHTML").css({
                    "backgroundColor": "#fff"
                });
                reiniciarDatosAnimacion();
                estado = 0;
            }
        }
    }

    const setBackgrounds = () => {
        if (i > 0) {
            $(".nodoHTML").eq(i - 1).css("backgroundColor", "#fff");
        }
        $(".nodoHTML").eq(i).css("backgroundColor", bgColorI);

        $(".nodoHTML").eq(piv).css("backgroundColor", bgColorPivote);
        if (j < longitud) {
            $(".nodoHTML").eq(j + 1).css("backgroundColor", "#fff");
        }
        $(".nodoHTML").eq(j).css("backgroundColor", bgColorJ);
    }

    const incrementarI = () => {
        interVerdadero = false;
        ejecI = true;
        if (i < j && getValor(i) <= getValor(piv)) {
            i++;
            setBackgrounds();

            if (getValor(i) > getValor(piv)) {

                clearInterval(animI);
                ejecI = false;
                if (!ejecJ) {
                    ejecJ = true;
                    animJ = setInterval(reducirJ, tiempoAvance);
                }
            }

        }
        else if (i >= j) {
            clearInterval(animI);
            ejecI = false;
            intercambiar(piv, j);
        }
    }

    const reducirJ = () => {
        interVerdadero = false;
        ejecJ = true;
        if (getValor(j) > getValor(piv)) {
            j--;

            setBackgrounds();

            if (getValor(j) <= getValor(piv)) {

                clearInterval(animJ);
                ejecJ = false;
                if (i < j) {

                    intercambiar(i, j);
                }
                else {

                    intercambiar(piv, j);
                }
            }

        }
        else {
            clearInterval(animJ);
            ejecJ = false;
            intercambiar(i, j);
        }
    }

    const intercambiar = (a, b) => {
        inter = true;
        interVerdadero = false;
        if (estado == 1) {
            let nodo1 = getNodo(a);
            let nodo2 = getNodo(b);

            let posicion1 = nodo1.position();
            let posicion2 = nodo2.position();

            nodo1.css("position", "relative");
            nodo2.css("position", "relative");
            mover(nodo1, posicion2.left - posicion1.left, posicion2.top - posicion1.top);
            mover(nodo2, posicion1.left - posicion2.left, posicion1.top - posicion2.top);
            inter = true;
            reservaA = a;
            reservaB = b;
            timeoutIntercambio = setTimeout(() => { intercambiarValores(a, b) }, tiempoIntercambio);
        }
    }

    const intercambiarValores = (a, b) => {
        inter = false;
        interVerdadero = true;
        reservaA = -1;
        reservaB = -1;
        let aux = getValor(a);
        setValor(a, getValor(b));
        setValor(b, aux);
        if (i < j) {
            iniciarIntervalos();
        }
        else {
            //El i y el j se cruzaron, se movio el pivote       
            dividido = true;
            dividir();

        }
    }

    const mover = (nodo, x, y) => {
        nodo.animate({
            opacity: 0.3,
            left: x + 'px',
            top: y + 'px'
        }, tiempoIntercambio, function () {
            nodo.css({
                opacity: 1,
                position: "static",
                top: 0,
                left: 0
            });
        });
    }

    const dividir = () => {

        if ((der) - (j + 1) > 0) {
            pila.push([j + 1, der]);
        }
        if ((j - 1) - (izq) > 0) {
            pila.push([izq, j - 1]);
        }

        iniciarIntervalos();

    }

    // const opacarZona = (desde , hasta) => {
    //    
    //     for (let iterator = desde; iterator <= hasta; iterator++) {
    //        
    //         $(".nodoHTML").eq(iterator).css("opacity", 1);
    //     }
    //    

    // }

    const getValor = (x) => {
        return parseInt($(".nodoHTML").eq(x).children(".nodo-valor").text())
    }

    const setValor = (x, nuevoValor) => {
        $(".nodoHTML").eq(x).children(".nodo-valor").text(nuevoValor);
    }

    const getNodo = (x) => {
        return $(".nodoHTML").eq(x);
    }

    $(".btn-sorts").on("click", function (ev) {
        ev.preventDefault();
        reiniciarDatosAnimacion();
    });

    const reiniciarDatosAnimacion = () => {
        if (estado === 1) {
            clearInterval(animI);
            clearInterval(animJ);
            i = 0;
            izq = 0;
            j = 0;
            piv = 0;
            dividido = true;
            pila = [];
            estado = 0;
            $("#btn-play").prop("disabled", false);
        }
    }

    // Configuarciones

    $("#guardar-config").on('click', function () {
        let valor = parseInt($("#t-intercambio").val());
        if (!isNaN(valor)) {
            tiempoIntercambio = valor;
        }
        
        valor = parseInt($("#t-recorrido").val());
        if (!isNaN(valor)) {
            tiempoAvance = valor;
        }
       
        if ($('#no-repes').prop('checked')) {
            quitarHeaderFooter = true;
            $("header").slideUp('fast');
            $("footer").css('display', 'none');
        }
        else {
            quitarHeaderFooter = false;
            $("header").slideDown('fast');
            $("footer").css('display', 'block');
        }       
        
        valor = $("#bg-pivote").val();

        if (esColor(valor)) {
            bgColorPivote = valor;
        }
        
        valor = $("#bg-i").val();

        if (esColor(valor)) {
            bgColorI = valor;
        }
        
        valor = $("#bg-j").val();

        if (esColor(valor)) {
            bgColorJ = valor;
        }
        
    });

    $("#reestablecer-config").on('click', function () {
        bgColorPivote = "#DAAADB"; //morado
        bgColorI = "#F8A1A4"; // rojo
        bgColorJ = "#98E0AD"; //verde
        tiempoAvance = 800;
        tiempoIntercambio = 2000;
        quitarHeaderFooter = false;
        $("#t-intercambio").val("2000");
        $("#t-recorrido").val("800");
        $('#no-repes').prop('checked', false);
        $("#bg-pivote").val("#DAAADB");
        $("#bg-i").val("#F8A1A4");
        $("#bg-j").val("#98E0AD");
    });

    const esColor = (color) => {
        if (color.length == 7 && color.charAt(0) == '#') {
            color = color.toUpperCase();
            for (let index = 1; index < color.length; index++) {

                if (color.charAt(index) !== '0' &&
                    color.charAt(index) !== '1' &&
                    color.charAt(index) !== '2' &&
                    color.charAt(index) !== '3' &&
                    color.charAt(index) !== '4' &&
                    color.charAt(index) !== '5' &&
                    color.charAt(index) !== '6' &&
                    color.charAt(index) !== '7' &&
                    color.charAt(index) !== '8' &&
                    color.charAt(index) !== '9' &&
                    color.charAt(index) !== 'A' &&
                    color.charAt(index) !== 'B' &&
                    color.charAt(index) !== 'C' &&
                    color.charAt(index) !== 'D' &&
                    color.charAt(index) !== 'E' &&
                    color.charAt(index) !== 'F') {

                    return false;
                }

            }
        }

        return true;
    }

})