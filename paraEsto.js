export async function procesarAcuariosJson() {
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
                /* const selectedText = event.target.textContent;
                titulo.textContent = `${selectedText.substring(5)}`;
                numero.textContent = `Acuario num. ${selectedText.substring(0, 3)}:`; */
                // Verifica si el clic fue en un elemento del menú si no seria "UL" en vez de "A"
                if (event.target.tagName === 'A') {
                    // Evita la acción por defecto
                    event.preventDefault();
                    // Actualiza el contenido del <h5> con el texto seleccionado
                    document.getElementById('acuarios').textContent = event.target.textContent;

                    document
                        .getElementById("contentAcuarios")
                        .classList.add("text-bg-light");
                }
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
export function enviarCorreo() {
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

    let objetoJson = JSON.stringify(jsonData, null, 2); /* let objetoJson = JSON.stringify(jsonData, null, 2); */

    const templateParams = {
        message: objetoJson,
        to_email: CORREO_ELECTRONICO,
        subject: `Num. ${jsonData.acuarioNum} «${jsonData.tituloAcuario}» - ${jsonData.fecha}`,
    };

    emailjs
        .send("service_esxltkm", "template_i35yyct", templateParams) // Reemplaza con tu Service ID y Template ID
        .then(
            function(response) {
                console.log("SUCCESS!", response.status, response.text);
                alert(`Email enviado correctamente a «${CORREO_ELECTRONICO}».`);
            },
            function(error) {
                console.log("FAILED...", error);
                alert("Fallo en el envío del correo.");
            }
        );
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

function comprobrarDatos(objeto) {
    if (objeto.acuarioNum == "" || objeto.tituloAcuario == "") {
        banderaError = true;
        alert("No se ha seleccionado ningun acuario.");
        return;
    }

    const fecha = parseDateString(objeto.fecha);

    if (fecha === null) {
        banderaError = true;
        alert("La fecha es incorrecta.");
        return;
    }
    if (fecha.milliseconds > Date.now()) {
        banderaError = true;
        alert("La fecha no puede ser posterior a la actual.");
        return;
    }
    if (fecha.dateObject.getDay() != 0) {
        banderaError = true;
        alert("La fecha tiene que ser domingo.");
        return;
    }
    if (objeto.pH == "") {
        banderaError = true;
        alert("Falta el pH.");
        return;
    }
    if (parseFloat(objeto.pH) < 4 || parseFloat(objeto.pH) > 10) alert("El valor del pH debe estar entre 4 y 10.");
    if (objeto.KH == "") {
        banderaError = true;
        alert("Falta el KH.");
        return;
    }
    if (parseFloat(objeto.KH) < 0 || parseFloat(objeto.KH) > 30) alert("El valor del KH debe estar entre 0 y 30.");
    if (objeto.temp == "") {
        banderaError = true;
        alert("Falta la temperatura.");
        return;
    }
    if (parseInt(objeto.temp) < 5 || parseInt(objeto.temp) > 40) alert("El valor de la tempeartura debe estar entre 5ºC y 40ºC.");
    if (objeto.NO3 == "") {
        banderaError = true;
        alert("Falta el valor del nitrato.");
        return;
    }
    if (parseInt(objeto.NO3) < 0 || parseInt(objeto.NO3) > 100) alert("El valor del NO3 debe estar entre 0 y 100.");
    if (objeto.inyCO2.trim() == "") {
        banderaError = true;
        alert("Falta el tipo de inyección de CO2.");
        return;
    }
    if (objeto.plantas.trim() == "") {
        banderaError = true;
        alert("Falta el estado de las plantas.");
        return;
    }
    if (objeto.agua.trim() == "") {
        banderaError = true;
        alert("Falta el estado del agua.");
        return;
    }
    if (objeto.algas.trim() == "") {
        banderaError = true;
        alert("Falta el estado de las algas.");
        return;
    }
    if (objeto.supAgua.trim() == "") {
        banderaError = true;
        alert("Falta el estado de la superficie del agua.");
        return;
    }
}