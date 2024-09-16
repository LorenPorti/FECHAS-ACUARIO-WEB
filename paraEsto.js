export let numDelAcuario = null; // Inicializa la variable

export async function obtenerNumAcuario() {
    try {
        const response = await fetch("/acuarioActual.json");
        const numAcuarioActual = await response.json();
        numDelAcuario = numAcuarioActual[0].numAcuario; // Asigna el valor a la variable
        return numDelAcuario;
    } catch (error) {
        console.error("Error al obtener el número de acuario:", error);
        return null;
    }
}


export async function procesarAcuariosJson() {
    // const numAcuario = await obtenerNumAcuario(); // Llama a obtenerNumAcuario y espera a que se complete
    // alert(numAcuario); // Muestra el valor obtenido
    // Aquí puedes usar `numAcuario` o `numDelAcuario` ya que ambos deberían tener el mismo valor

    // Carga los datos de acuarios.json y los muestra en el dropmenu
    try {
        const response = await fetch("./acuarios.json");
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const acuarios = await response.json();
        document.getElementById("menuAcuarios").innerHTML = acuarios
            .map(
                (acuario) => `
            <li><a class="dropdown-item montserrat-medium-italic" href="#">(${acuario.Num})  ${acuario.Nombre}</a></li>
        `
            )
            .join("");

        // Al seleccionar el acuario escribe la información en la cabecera
        let titulo = document.getElementById("tituloAcuario");
        let numero = document.getElementById("numeroAcuario");
        document
            .getElementById("menuAcuarios")
            .addEventListener("click", function(event) {
                const selectedText = event.target.textContent;
                // titulo.textContent = `${selectedText.substring(5)}`;
                numero.textContent = `Acuario num. ${selectedText.substring(0, 3)}:`;
            });
    } catch (error) {
        console.error("Error fetching JSON:", error);
    }
}

export function procesarAcuarios() {
    document
        .getElementById("menuAcuarios")
        .addEventListener("click", function(event) {
            document.getElementById("acuarios").textContent =
                event.target.textContent;
        });
}

export function procesarInyeccion() {
    document
        .getElementById("menuInyeccion")
        .addEventListener("click", function(event) {
            document.getElementById("inyeccion").textContent =
                event.target.textContent;
        });
}

export function procesarPlantas() {
    document
        .getElementById("menuPlantas")
        .addEventListener("click", function(event) {
            document.getElementById("plantas").textContent = event.target.textContent;
        });
}

export function procesarAgua() {
    document
        .getElementById("menuAgua")
        .addEventListener("click", function(event) {
            document.getElementById("agua").textContent = event.target.textContent;
        });
}

export function procesarAlgas() {
    document
        .getElementById("menuAlgas")
        .addEventListener("click", function(event) {
            document.getElementById("algas").textContent = event.target.textContent;
        });
}

export function procesarSup() {
    document
        .getElementById("menuSup")
        .addEventListener("click", function(event) {
            document.getElementById("superficie").textContent =
                event.target.textContent;
        });
}

// *************Enviar correo***************
let banderaError = false;
const CORREO_ELECTRONICO = "lorenporti@outlook.com";
export async function enviarCorreo() {
    // Enviar correo usando EmailJS
    // Inicializar EmailJS
    emailjs.init("IZrWZg4ZaagQIFsUX"); // Tu publicKey de EmailJS

    // const selectedText = event.target.textContent;
    // titulo.textContent = `${selectedText.substring(5)}`;
    // numero.textContent = `Acuario num. ${selectedText.substring(0, 3)}:`;

    // Recopilar datos
    const jsonData = {
        acuarioNum: document.getElementById("acuarios").textContent.substring(1, 2),
        tituloAcuario: document.getElementById("acuarios").textContent.substring(5),
        fecha: formatDate(document.getElementById("dateInput").value),
        pH: document.getElementById("phInput").value,
        KH: document.getElementById("khInput").value,
        temp: document.getElementById("tempInput").value,
        NO3: document.getElementById("no3Input").value,
        inyCO2: document.getElementById("inyeccion").textContent,
        plantas: document.getElementById("plantas").textContent,
        algas: document.getElementById("algas").textContent,
        agua: document.getElementById("agua").textContent,
        supAgua: document.getElementById("superficie").textContent,
        coment1: document.getElementById("comentario_1").value,
        coment2: document.getElementById("comentario_2").value,
        coment3: document.getElementById("comentario_3").value,
        coment4: document.getElementById("comentario_4").value,
        coment5: document.getElementById("comentario_5").value,
    };

    comprobrarDatos(jsonData);

    if (banderaError) {
        banderaError = false;
        return;
    }

    let objetoJson = JSON.stringify(
        jsonData,
        null,
        2
    ); /* let objetoJson = JSON.stringify(jsonData, null, 2); */

    let resultado = await showModal("CONTENIDO DEL CORREO", objetoJson, "Enviar Correo");
    if (!resultado) return;

    const templateParams = {
        message: objetoJson,
        to_email: CORREO_ELECTRONICO,
        subject: `Num. ${jsonData.acuarioNum} «${
      jsonData.tituloAcuario
    }» - ${transformarFecha(jsonData.fecha)}`,
    };

    emailjs
        .send("service_esxltkm", "template_i35yyct", templateParams) // Reemplaza con tu Service ID y Template ID
        .then(
            function(response) {
                console.log("SUCCESS!", response.status, response.text);
                // alert(`Email enviado correctamente a «${CORREO_ELECTRONICO}».`);
                showModal("ENVÍO DEL EMAIL", `Email enviado correctamente a «${CORREO_ELECTRONICO}».`, null);
            },
            function(error) {
                console.log("FAILED...", error);
                // alert("Fallo en el envío del correo.");
                showModal("FALLO EN EL EMAIL", "Fallo en el envío del correo.", null);
            }
        );
}

export async function obtenerCorreo() {
    showModal("LISTA DE CORREOS ENVIADOS", "muchos correos", "Correos Enviados");
}

// Convierte un valor Date al formato "17 jul 2024"
function formatDate(dateString) {
    // Convertir la cadena de fecha a un objeto Date
    const date = new Date(dateString);

    const months = [
        "ene",
        "feb",
        "mar",
        "abr",
        "may",
        "jun",
        "jul",
        "ago",
        "sep",
        "oct",
        "nov",
        "dic",
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}


// convierte un valor de la forma "17 jul 2024" a Date
function parseDateString(dateString) {
    const months = [
        "ene",
        "feb",
        "mar",
        "abr",
        "may",
        "jun",
        "jul",
        "ago",
        "sep",
        "oct",
        "nov",
        "dic",
    ];
    const [day, month, year] = dateString.split(" ");

    const monthIndex = months.indexOf(month.toLowerCase());

    if (monthIndex === -1) {
        return null;
    }

    const date = new Date(year, monthIndex, day);

    return {
        dateObject: date,
        milliseconds: date.getTime(),
    };
}

// Convierte un valor de la forma "4 ago 2024" a "2024-08-04"
function transformarFecha(dateString) {
    const months = {
        "ene": "01",
        "feb": "02",
        "mar": "03",
        "abr": "04",
        "may": "05",
        "jun": "06",
        "jul": "07",
        "ago": "08",
        "sep": "09",
        "oct": "10",
        "nov": "11",
        "dic": "12"
    };

    const [day, month, year] = dateString.split(" ");

    const formattedMonth = months[month.toLowerCase()];

    // Asegura que el día tiene dos dígitos
    const formattedDay = day.padStart(2, '0');

    return `${year}-${formattedMonth}-${formattedDay}`;
}

// Función para mostrar el modal y devolver una promesa que se resuelve con true o false
// Si se pone a null el botonAvanzar solo se muestra el boton cancelar con el texto "Enterado"
function showModal(title, message, botonAvanzar) {
    return new Promise((resolve) => {
        // Actualiza el título y el contenido del modal
        document.getElementById("modalLabel").innerText = title;
        document.querySelector(".modal-body").innerText = message;
        if (botonAvanzar != null) {
            document.getElementById("sendEmailButton").hidden = false;
            document.getElementById("sendEmailButton").innerText = botonAvanzar;
            document.getElementById("sendEmailButton").classList.remove('btn-secondary');
            document.getElementById("sendEmailButton").classList.add('btn-primary');
            document.getElementById("cancelButton").classList.remove('btn-primary');
            document.getElementById("cancelButton").classList.add('btn-secondary');
            document.getElementById("cancelButton").innerText = "Cancelar";
        } else {
            document.getElementById("sendEmailButton").hidden = true;
            document.getElementById("cancelButton").innerText = "Enterado";
            document.getElementById("cancelButton").classList.remove('btn-secondary');
            document.getElementById("cancelButton").classList.add('btn-primary');
        }

        // Muestra el modal
        const modal = new bootstrap.Modal(document.getElementById("customModal"));
        modal.show();

        // Manejador de eventos para el botón "Enviar correo"
        document
            .getElementById("sendEmailButton")
            .addEventListener("click", function() {
                modal.hide();
                resolve(true); // Resuelve la promesa con true
            });

        // Manejador de eventos para el botón "Cancelar"
        document
            .getElementById("cancelButton")
            .addEventListener("click", function() {
                modal.hide();
                resolve(false); // Resuelve la promesa con false
            });
    });
}

function comprobrarDatos(objeto) {
    if (objeto.acuarioNum == "" || objeto.tituloAcuario == "") {
        banderaError = true;
        // alert("No se ha seleccionado ningun acuario.");
        showModal("ERROR ENTRADA", "No se ha seleccionado ningun acuario.", null);
        return;
    }

    const fecha = parseDateString(objeto.fecha);

    if (fecha === null) {
        banderaError = true;
        // alert("La fecha es incorrecta.");
        showModal("ERROR ENTRADA", "La fecha es incorrecta.", null);
        return;
    }
    if (fecha.milliseconds > Date.now()) {
        banderaError = true;
        // alert("La fecha no puede ser posterior a la actual.");
        showModal("ERROR ENTRADA", "La fecha no puede ser posterior a la actual.", null);
        return;
    }
    if (fecha.dateObject.getDay() != 0) {
        banderaError = true;
        // alert("La fecha tiene que ser domingo.");
        showModal("ERROR ENTRADA", "La fecha tiene que ser domingo.", null);
        return;
    }
    if (objeto.pH == "") {
        banderaError = true;
        // alert("Falta el pH.");
        showModal("ERROR ENTRADA", "Falta el pH.", null);
        return;
    }
    if (parseFloat(objeto.pH) < 4 || parseFloat(objeto.pH) > 10) alert("El valor del pH debe estar entre 4 y 10.");
    if (objeto.KH == "") {
        banderaError = true;
        // alert("Falta el KH.");
        showModal("ERROR ENTRADA", "Falta el KH.", null);
        return;
    }
    if (parseFloat(objeto.KH) < 0 || parseFloat(objeto.KH) > 30) alert("El valor del KH debe estar entre 0 y 30.");
    if (objeto.temp == "") {
        banderaError = true;
        // alert("Falta la temperatura.");
        showModal("ERROR ENTRADA", "Falta la temperatura.", null);
        return;
    }
    if (parseInt(objeto.temp) < 5 || parseInt(objeto.temp) > 40) alert("El valor de la tempeartura debe estar entre 5ºC y 40ºC.");
    if (objeto.NO3 == "") {
        banderaError = true;
        // alert("Falta el valor del nitrato.");
        showModal("ERROR ENTRADA", "Falta el valor del nitrato.", null);
        return;
    }
    if (parseInt(objeto.NO3) < 0 || parseInt(objeto.NO3) > 100) alert("El valor del NO3 debe estar entre 0 y 100.");
    if (objeto.inyCO2.trim() == "") {
        banderaError = true;
        // alert("Falta el tipo de inyección de CO2.");
        showModal("ERROR ENTRADA", "Falta el tipo de inyección de CO2.", null);
        return;
    }
    if (objeto.plantas.trim() == "") {
        banderaError = true;
        // alert("Falta el estado de las plantas.");
        showModal("ERROR ENTRADA", "Falta el estado de las plantas.", null);
        return;
    }
    if (objeto.agua.trim() == "") {
        banderaError = true;
        // alert("Falta el estado del agua.");
        showModal("ERROR ENTRADA", "Falta el estado del agua.", null);
        return;
    }
    if (objeto.algas.trim() == "") {
        banderaError = true;
        // alert("Falta el estado de las algas.");
        showModal("ERROR ENTRADA", "Falta el estado de las algas.", null);
        return;
    }
    if (objeto.supAgua.trim() == "") {
        banderaError = true;
        // alert("Falta el estado de la superficie del agua.");
        showModal("ERROR ENTRADA", "Falta el estado de la superficie del agua.", null);
        return;
    }
}