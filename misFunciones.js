// ******************** FORMATEO DE UN NUMERO CON PUNTO DE MILES Y COMA DECIMAL ******************** 
// Se puede formatear un número con separadores de mil y coma de decimales.
// El número obtenido es un «TEXTO» y no se puede operar con él. Para convertir un número en una cadena a número operable, utilizar «parseFloat()»
// o «parseInt», ver la función formatearUsEuropa() aquí mismo.
// Si el número de decimales excede del que tiene el número, presentará el resto de decimales con ceros.
// 'cantidadDecimales' no puede ser negativo.
export function formatearEuropa(numero, cantidadDecimales) {
    return new Intl.NumberFormat("es-ES", { minimumFractionDigits: cantidadDecimales, maximumFractionDigits: cantidadDecimales }).format(numero);
}
//*************************************************************
//  ejemplos
// let nnn = 1234567890.67893;
// let nnn1 = 1234567890;

// console.log(nnn);
// console.log(nnn1);
// console.log(formatearEuropa(nnn, 3));
// console.log(formatearEuropa(nnn, 8));
// console.log(formatearEuropa(nnn1, 0));
// console.log(formatearEuropa(nnn1, 3));

// ******************** CONVIERTE UN NUMERO EN FORMATO US A FORMATO EUROPEO ******************** 
// Convierte un numero en cadena con formato europeo (co/sin separador de miles) en un número operable
// La función convierte, en su primera parte, los separadoresde mil en comas y la coma decimal en punto, en su
// segunda parte elimina las comas de separadores de mil, dejando el número sólo con el punto decimal, por ejemplo,
// el número  en un string "123.456,789" lo convierte, en su primera parte en "123,456.789", en su segunda parte en "123456.789",
// este número final es un «STRING», que se puede convertir en un número operable con la función de javascript «parseFloat» 123456.789 o
// «parseInt» en 123456
export function formatearUsEuropa(numeroFormataedo) {
    return numeroFormataedo.replace(/[,.]/g, function(x) { return x == "," ? "." : ","; }).replace(',', '');
}
//*************************************************************
// ejemplos
// let numero = 123456.789;
// let numeroString = "123456.789";

// console.log(formatearEuropa(numero, 2));

// console.log(parseFloat(numeroString));
// console.log(parseInt(numeroString));
// console.log(formatearUsEuropa(formatearEuropa(numero, 2)));
// console.log(parseFloat(formatearUsEuropa(formatearEuropa(numero, 2))));

// ******************** FUNCION PARA MOSTRAR UN DIALOGO O MODAL ********************
// El modal puede tener uno, dos o tres botones.
// Para un boton escribir el texto en boton1, para dos botones escribirlo en boton1 y boton2, para tres escribirlo en boton1, boton2 y boton3
// Siempre debe tener una información boton1, boton2 o boton3. Si no se van a utilizar poner el valor a null
// Utilizar del primero al último, ejemplo «"boton1", null, null» o «"boton1", "boton 2"", null», nunca «"boton1", null, "boton 3""»
// El valor del botón pulsado se guarda en la variable globlal «valorBoton». El inicio de este botón es «-1», pero si se pulsa escape será «0».
export let valorBoton = 0;
export function mostrarModal(info0aviso1error2, titulo, cuerpo, pregunta, boton1, boton2, boton3) {

    let mano = "👍";
    let botones, btn, colorBoton, colorCabecera;

    if (info0aviso1error2 == 0) {
        mano = "👍";
        colorCabecera = '#6D8B74';
        colorBoton = '#A87676';
    } else if (info0aviso1error2 == 1) {
        mano = "☝";
        colorCabecera = '#DAB88B';
        colorBoton = '#3A4D39';
    } else if (info0aviso1error2 == 2) {
        mano = "✋";
        colorCabecera = '#A87676';
        colorBoton = '#1572A1';
    }
    if (boton1 != null && boton2 == null && boton3 == null) {
        botones = `<button type='button' id='bot1' class="button_slide slide_right">${boton1}</button>`;
        btn = "60%";
    } else if (boton1 != null && boton2 != null && boton3 == null) {
        botones = `<button type='button' id='bot1' class="button_slide slide_right">${boton1}</button>
        <button type='button' id='bot2'class="button_slide slide_right">${boton2}</button>`;
        btn = "45%";
    } else if (boton1 != null && boton2 != null && boton3 != null) {
        botones = `<button type='button' id='bot1' class="button_slide slide_right">${boton1}</button>
        <button type='button' id='bot2' class="button_slide slide_right">${boton2}</button>
        <button type='button' id='bot3' class="button_slide slide_right">${boton3}</button>`;
        btn = "31%";
    }

    // Debe existir un contenedor para introducir el modal en el DOM.
    // Si no existe lo crea. 
    // Esto se hace para no acumular varios «<div id="contenedorModal"></div>» si no salismo de la págin actual.
    let newElement;

    if (!document.getElementById('contenedorModal')) {

        newElement = document.createElement('div');

        newElement.innerHTML = `<div id="contenedorModal"></div>`;

        document.body.appendChild(newElement);
    }

    document.getElementById('contenedorModal').innerHTML = `
    <!-- The Modal -->
    <div class="modal fade" id="myModal" data-bs-backdrop="static">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">

                <!-- Modal Header -->
                <div class="modal-header">
                    <h4 id="mano">${mano}</h4>
                    <h4 class="modal-title w-100 text-center">${titulo}</h4>
                </div>

                <!-- Modal body -->
                <div class="modal-body">
                    <h2 id="textoCuerpo">${cuerpo}</h2>
                    <h2 id="preg">${pregunta}</h2>
                </div>

                <!-- Modal footer -->
                <div class="modal-footer">
                    ${botones}
                </div>

            </div>
        </div>
    </div>
    <style>
    #mano{
        font-size: 42px;
        vericical-align: middle;
    }    
    .modal-title{
        color: white;
        font-size: 30px;
        font-style: italic;
        text-shadow: 2px 2px 3px DimGray;
        font-family: 'georgia';
    }
    .modal-header{
        background: ${colorCabecera};
    }
    #textoCuerpo{
        font-family: 'georgia';
        font-size: 16px;
        color: black;
        font-weight: bold;
        text-align: justify;
    }
    #preg{
        font-family: 'georgia';
        color: #11324D;
        text-align: center;
        font-size: 20px;
        font-weight: bold;
        font-style: italic;
    }
    .modal-footer{
        display: flex;
        flex-direction: row;
        justify-content: center;
        justify-content: space-around; 
        flex-wrap: nowrap;      
        padding 0px;
    }
    .button_slide {    
        horizontal-align: middle;
        text-align: center;
        color: aliceblue;
        background: ${colorBoton};
        border: 2px solid azure;
        border-radius: 4px;
        padding: 5px;
        width: ${btn};
        display: inline-block;
        font-family: 'lucida-times';
        font-size: 20px;
        letter-spacing: 1px;
        cursor: pointer;
        -webkit-transition: ease-out 0.4s;
        -moz-transition: ease-out 0.4s;
        transition: ease-out 0.2s;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
    }    
    .slide_right:hover {
        background: #869a96;        
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);  
        transform: translateY(-2px);    
    }
    .slide_right:active {
        transform: translateY(2px);
    }
    </style>`;

    const modal1 = new bootstrap.Modal(document.getElementById('myModal'));

    valorBoton = -1;

    let bt1 = document.getElementById('bot1');
    let bt2 = document.getElementById('bot2');
    let bt3 = document.getElementById('bot3');

    bt1.addEventListener('click', function() {
        valorBoton = 1;
        modal1.toggle();
    });
    if (bt2) {
        bt2.addEventListener('click', function() {
            valorBoton = 2;
            modal1.toggle();
        });
    }
    if (bt3) {
        bt3.addEventListener('click', function() {
            valorBoton = 3;
            modal1.toggle();
        });
    }



    // *******************************************************
    // Deshabilita la tecla "Enter", "Tab", y teclas "F1", "F3",  "F5" "F6", "F7", Shift + Esc, para que no influyan en el modal.
    // Si la tecla pulsada es "Escape" el modal termina, como si se hubiera pulsado cancelar pero el valor del botón será «0».
    // Se deshabilitan globalmente y al cerrar el modal se vuleven a habilitar.
    window.addEventListener('keydown', deshabilitar);

    function deshabilitar(e) {

        if (e.code === 'Enter' || e.code === 'Tab' || e.code === 'F1' || e.code === 'F3' || e.code === 'F5' || e.code === 'F6' || e.code === 'F7' || (e.shiftKey && e.code === 'Escape')) {
            e.preventDefault();
            e.stopPropagation();
        }
        // Co la tecla "Escape" el modal termina, como si se hubiera pulsado cancelar.
        // la combincacíón con las teclaas "Shitf" y "Escape" se ignora.
        if ((!e.shiftKey && e.code === 'Escape')) {
            valorBoton = 0;
            modal1.toggle();
        }
    }

    document.getElementById('myModal').addEventListener('hidden.bs.modal', () => {
        window.removeEventListener('keydown', deshabilitar);
    });
    // *******************************************************

    modal1.toggle();


}
//*************************************************************
// Ejemplo:
// mostrarModal(2, "ERROR EN LA CARGA", "Se ha producido un error en la carga del archivo. No se puede seguir.",
// "¿Continuar con la carga?", "OK1", "Botón 2", "Cancelar");

// document.getElementById('myModal').addEventListener('hide.bs.modal', function() {
//     if (valorBoton != -1) {
//         console.log('Valor del botón pulsado, que se guarda en la variable global «valorBoton»: ' +
//             valorBoton);
//     }
// });

// ******************** FUNCION PARA MOSTRAR UN POPOVER ********************
// idElemento es la identificación del elemento donde se quiere que aparezca el popover, por ejemplo, en la línea «button id="btnPopover"»probando popover«/button»
// la identificación del elemnto es "btnPopover".
// El popover se debe mostrar en un elemento sencillo, por ejemplo un botón o un texto.
// Esta función está preparada para mostrar el popover al pone el cursor sobre el elemento "idElemento".
// Lo que hace la función es preparar al elemento "idElemento" para que muestre un popover, no que muestre un popover al llamarla.
// ¡IMPORTANTE!, Si el título, «txtXabecera», está null o es una cadena vacía, el popover se presentará sin título, como un tooltip.
export function mostrarPopover(idElemento, txtCabecera, txtContenido) {

    let prob = document.getElementById(idElemento);

    prob.setAttribute("data-bs-toggle", "popover");
    prob.setAttribute("data-bs-trigger", "hover");
    if (txtCabecera != null && txtCabecera != "") prob.setAttribute("title", txtCabecera); // Si el texto del título es null o "", no muestra la cabecera.
    prob.setAttribute("data-bs-content", txtContenido);
    prob.setAttribute("data-bs-custom-class", "custom-popover");

    // Debe existir un contenedor para introducir los CSS del popober en el DOM.
    // Si no existen los crea. 
    // Esto se hace para no acumular varios «<style id="contenedorPopover"></style>» si no salismo de la págin actual.
    let newElement;

    if (!document.getElementById('contenedorPopover')) {

        newElement = document.createElement('style');

        newElement.innerHTML = `<div id="contenedorPopover"></div>`;

        document.body.appendChild(newElement);
    }

    newElement.innerHTML = `
    .popover.custom-popover{
    --bs-popover-max-width: 300px;
    --bs-popover-border-color: var(--bs-primary);
    --bs-popover-header-color: var(--bs-white);
    --bs-popover-body-padding-x: 1rem;
    --bs-popover-body-padding-y: .5rem;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
    font-family: 'georgia';
    }
    .custom-popover .popover-header {
        background-color: #4F6F52;
        color: white;
        font-family: 'georgia';
        font-style: italic;
        font-size: 15px;
        text-align: center;
    }
    .custom-popover .popover-body {
        padding: 0.5rem 1rem;
        font-family: 'Verdana, sans-serif';
        font-style: italic;
        font-size: 16px;
        text-align: justify;
    }
    `;

    prob.appendChild(newElement);

    var popoverTriggerList = [].slice.call(document.querySelectorAll(`[data-bs-toggle = "popover"]`));
    var popoverList = popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

}
//*************************************************************
// Ejemplo:
// let tttt = `idElemento es la identificación del elemento donde se quiere que aparezca el popover, por ejemplo, en la línea «button id="btnPopover"»probando popover«/button» la dentificación del elemnto es "btnPopover". El popover se debe mostrar en un elemento sencillo, por ejemplo un botón o un texto. Esta función está preparada para mostrar el popover al pone el cursor sobre el elemento "idElemento". Lo que hace la función es preparar al elemento "idElemento" para que muestre un popover, no que muestre un popover al lamarla.`;
// mostrarPopover('btnPopover', 'MOSTRAR UN POPOVER', tttt);. Al poner el cursor encima del botón "btnPopover" se muestra el popover

// ******************** FUNCION PARA MOSTRAR UNA ALERTA ********************
//Muestra una alerta
export function mostrarAlerta(info0aviso1peligro2, titulo, texto) {
    let clase;
    switch (info0aviso1peligro2) {
        case 0:
            clase = 'success';
            break;
        case 1:
            clase = 'warning';
            break;
        case 2:
            clase = 'danger';
            break;
    }

    // Buscar si ya existe la alerta y eliminarla antes de crear una nueva
    let alertaExistente = document.getElementById('contenedorAlerta');
    if (alertaExistente) {
        alertaExistente.remove();
    }

    // Crear el contenedor si no existe
    let contenedorAlerta = document.createElement('div');
    contenedorAlerta.id = "contenedorAlerta";
    contenedorAlerta.style.position = "fixed";
    contenedorAlerta.style.top = "10px";
    contenedorAlerta.style.right = "10px";
    contenedorAlerta.style.zIndex = "2000"; // Superior a Bootstrap modal
    contenedorAlerta.style.maxWidth = "300px"; // Opcional, evita que sea muy ancha
    // contenedorAlerta.style.boxShadow = "0px 2px 4px rgba(0, 0, 0, 0.2)";
    contenedorAlerta.style.margin = "10px";
    contenedorAlerta.innerHTML = `
        <div class="alert alert-${clase} alert-dismissible fade show shadow-sm">
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            <strong style="font-family: 'Arial Black'; font-style: italic; padding-right: 10px;">${titulo}</strong> ${texto}
        </div>
    `;

    // Agregar la alerta al `body` para que no quede dentro de otro contenedor
    document.body.appendChild(contenedorAlerta);

    // Evento para cerrar al hacer clic fuera
    setTimeout(() => {
        document.addEventListener("click", cerrarAlertaExterna);
    }, 50);
}

// Función para cerrar la alerta si se hace clic fuera
function cerrarAlertaExterna(event) {
    let alerta = document.getElementById("contenedorAlerta");
    if (alerta && !alerta.contains(event.target)) {
        alerta.remove();
        document.removeEventListener("click", cerrarAlertaExterna);
    }
}


// Ejemplo:
// mostrarPopover('btnAlerta', 'MOSTRAR UNA ALERTA', 'Pulsar este botón para mostrar una alerta.');
// document.getElementById('btnAlerta').addEventListener('click', function() {
//     mostrarAlerta(1, "¡ATENCION!", "Esto es un aviso.");
// });