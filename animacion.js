$(function () {

    const bgColorPivote = "#DAAADB"; //morado
    const bgColorI = "#F8A1A4"; // rojo
    const bgColorJ = "#98E0AD"; //verde

    let i = 0;
    let j;
    let piv = 0;
    let longitud = 1;
    const tiempoAvance = 800;
    const tiempoIntercambio = 2000;

    let animI;
    let animJ;

    let estado = 0;

    let cancelarI = false;
    let cancelarJ = true;

    $("#btn-play").on("click", function (ev) {
        ev.preventDefault();
        estado = 1;
        $("#estado").text("Animación ejecutandose");
        longitud = parseInt($("#cantidad").val());
        j = parseInt($("#cantidad").val()) - 1;
        setBackgrounds();
        iniciarIntervalos();
        $(this).prop("disabled", true);
        // animacion.play;
    });

    $("#btn-pause").on("click", function (ev) {
        ev.preventDefault();
        $("#estado").text("Animación pausada");
        //animacion.pause;
    });

    $("#btn-restart").on("click", function (ev) {
        ev.preventDefault();
        $("#estado").text("Animación reiniciada");
        //animacion.restart;
    });

    const iniciarIntervalos = () => {
        animI = setInterval(incrementarI, tiempoAvance);
        //animJ = setInterval(reducirJ, tiempoAvance);
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
                animJ = setInterval(reducirJ, tiempoAvance);

            }
        }
    }

    const reducirJ = () => {
        if (getValor(j) > getValor(piv)) {
            j--;
            setBackgrounds();
            if (getValor(j) <= getValor(piv)) {
                clearInterval(animJ);
                if(i < j){
                    intercambiar(i, j);
                }
                else{
                    intercambiar(piv, j);
                }                
            }            

        }
        else {
            intercambiar(i, j);
            clearInterval(animJ);
        }
    }

    const intercambiar = (a, b) => {

        let nodo1 = getNodo(a);
        let nodo2 = getNodo(b);

        let posicion1 = nodo1.position();
        let posicion2 = nodo2.position();

        nodo1.css("position", "relative");
        nodo2.css("position", "relative");

        mover(nodo1, posicion2.left - posicion1.left, posicion2.top - posicion1.top);
        mover(nodo2, posicion1.left - posicion2.left, posicion1.top - posicion2.top);

        setTimeout(() => {
           
            let aux = getValor(a);
            setValor(a, getValor(b));
            setValor(b, aux);
            if(i < j){
                iniciarIntervalos();
            }   
            else{
                dividir();
            }            
           
        }, tiempoIntercambio);
    }

    const mover = (nodo, x, y) => {
        nodo.animate({
            opacity: 0.5,
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

    $(".btn-sorts").on("click", function (ev) {
        ev.preventDefault();
      
        if (estado === 1) {
            clearInterval(animI);
            clearInterval(animJ);
            i = 0;
            j = 0;
            piv = 0;
            $("#btn-play").prop("disabled", false);
        }

    });

})