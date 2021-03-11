$(function () {

    const bgColorPivote = "#DAAADB"; //morado
    const bgColorI = "#F8A1A4"; // rojo
    const bgColorJ = "#98E0AD"; //verde

    let i = 0;
    let j;
    let piv = 0;
    let longitud = 1;
    const tiempo = 1200;

    let animI;
    let animJ;

    let cancelarI = false;
    let cancelarJ = true;

    $("#btn-play").on("click", function (ev) {
        longitud = parseInt($("#cantidad").val());
        j = parseInt($("#cantidad").val()) - 1;
        $("#estado").text("Animación ejecutandose");
        setBackgrounds();
        iniciarIntervalos();
        // animacion.play;
    });

    $("#btn-pause").on("click", function (ev) {
        $("#estado").text("Animación pausada");
        //animacion.pause;
    });

    $("#btn-restart").on("click", function (ev) {
        $("#estado").text("Animación reiniciada");
        //animacion.restart;
    });

    const iniciarIntervalos = () => {
        animI = setInterval(incrementarI, tiempo);
        //animJ = setInterval(reducirJ, tiempo);
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
        if (i < j && getValor(i) <= getValor(piv)) {
            i++;
            setBackgrounds();

            if (getValor(i) > getValor(piv)) {
                clearInterval(animI);
                animJ = setInterval(reducirJ, tiempo);

            }
        }
    }

    const reducirJ = () => {
        if (getValor(j) > getValor(piv)) {
            j--;
            setBackgrounds();
            if (getValor(j) <= getValor(piv)) {
                clearInterval(animJ);
                intercambiar(i, j);
            }

        }
    }

    const intercambiar = (a, b) => {
        let nodo1 = getNodo(a);
        let nodo2 = getNodo(b);

        let posicion1 = nodo1.position();
        let posicion2 = nodo2.position();

        nodo1.css("position", "relative");
        nodo2.css("position", "relative");

        mover(nodo1, posicion2.left, posicion2.top);
        mover(nodo2, posicion1.left, posicion1.top);

    }

    const mover = (nodo, x, y) => {
        nodo.animate({
            opacity: 0.5,
            left: x + 'px',
            top: y + 'px'
        }, 5000, function () {
            nodo.css({
                opacity: 1,
                position: "static"
            });
            let aux = getValor(j);
            setValor(j, getValor(i));
            setValor(i, aux);
        });
    }

    const getValor = (x) => {
        return parseInt($(".nodoHTML").eq(x).children(".nodo-valor").text())
    }

    const setValor = (x, nuevoValor) => {
        $(".nodoHTML").eq(x).children(".nodo-valor").text(nuevoValor);
    }

    const getNodo = (x) => {
        return $(".nodoHTML").eq(x);
    }

})