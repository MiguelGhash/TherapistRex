// Este código espera a que el documento esté completamente cargado antes de ejecutarse
$(document).ready(function () {
    // Realiza una solicitud al servidor para obtener los datos del usuario
    $.ajax({
        url: "/get_user_data", // Actualiza la ruta para obtener datos completos del usuario
        type: "GET",
        success: function (response) {
            // Cambia el texto de las etiquetas con las clases correspondientes en 'LogedTerapeuta.html'
            $(".NombreUs").text(response.datos_usuario.nombre);
            $(".Correo").text(response.datos_usuario.correo);
            $(".Ciudad").text(response.datos_usuario.ciudad);
            $(".Telefono").text(response.datos_usuario.telefono);
        },
        error: function (error) {
            console.error("Error al obtener los datos del usuario:", error);
        }
    });

    // Obtener y mostrar las terapias del terapeuta al cargar la página


    // Mostrar/ocultar formulario al hacer clic en el botón
    $(".boton").click(function () {
        // Cambia el selector al botón dentro de 'LogedTerapeuta.html'
        $("#formularioTerapia").addClass("active"); // Agrega la clase 'active' para mostrar el formulario
    });

    // Ocultar el formulario al hacer clic fuera de él
    $(document).mouseup(function (e) {
        var container = $(".formulario-flotante");
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            $("#formularioTerapia").removeClass("active"); // Remueve la clase 'active' para ocultar el formulario
        }
    });

    // Enviar formulario al servidor
    $("#formTerapia").submit(function (event) {
        event.preventDefault();

        // Obtener los valores del formulario
        var nombreTerapia = $("#nombreTerapia").val();
        var descripcionTerapia = $("#descripcionTerapia").val();
        var descripcionSobreMi = $("#descripcionSobreMi").val();

        // Validar que los campos no estén vacíos
        if (!nombreTerapia || !descripcionTerapia || !descripcionSobreMi) {
            alert("Por favor, complete todos los campos del formulario.");
            return;
        }

        // Enviar datos al servidor para agregar la terapia
        $.ajax({
            url: "/agregar_terapia",
            type: "POST",
            data: {
                nombreTerapia: nombreTerapia,
                descripcionTerapia: descripcionTerapia,
                descripcionSobreMi: descripcionSobreMi
            },
            success: function (response) {
                // Manejar la respuesta del servidor (puede ser un mensaje de éxito, etc.)
                alert(response.message);

                // Limpiar el formulario
                $("#formTerapia")[0].reset();

                // Ocultar el formulario
                $("#formularioTerapia").removeClass("active"); // Remueve la clase 'active' para ocultar el formulario

                // Agregar la terapia al cuadro
                agregarTerapiaAlCuadro({
                    nombreTerapia: nombreTerapia,
                    descripcionTerapia: descripcionTerapia,
                    descripcionSobreMi: descripcionSobreMi
                });
            },
            error: function (error) {
                console.error("Error al agregar la terapia:", error);
            }
        });
    });
// Agregar la función de búsqueda de terapia
$("#btnBuscar").click(function () {
    // Obtener el valor del input de búsqueda
    var busquedaTerapia = $("#txtBuscar").val();

    // Realizar una solicitud al servidor para buscar terapia
    $.ajax({
        url: "/buscar_terapia",
        type: "POST",
        data: { txtBuscar: busquedaTerapia },
        success: function (response) {
            // Actualizar el contenido de la página con la respuesta del servidor
            $("body").html(response);
        },
        error: function (error) {
            console.error("Error al buscar terapia:", error);
        }
    });
});
    // Función para agregar una terapia al cuadro
    function agregarTerapiaAlCuadro(terapia) {
        var cuadro = $("#cuadro");

        // Crear un nuevo div para la terapia
        var nuevaTerapia = $("<div class='terapia-item'></div>");

        // Agregar la información de la terapia al nuevo div
        nuevaTerapia.append("<p>Nombre terapia: " + terapia.nombreTerapia + "</p>");
        nuevaTerapia.append("<p>Descripción terapia: " + terapia.descripcionTerapia + "</p>");

        // Obtener el nombre del terapeuta desde la variable global
        var nombreTerapeuta = $(".NombreUs").text();
        nuevaTerapia.append("<p>Nombre terapeuta: " + nombreTerapeuta + "</p>");

        // Agregar la descripción sobre el terapeuta desde el formulario
        nuevaTerapia.append("<p>Sobre el terapeuta: " + terapia.descripcionSobreMi + "</p>");

        // Obtener el número de teléfono desde la variable global
        var telefonoTerapeuta = $(".Telefono").text();
        nuevaTerapia.append("<p>Contacto: " + telefonoTerapeuta + "</p>");

        // Agregar el nuevo div al cuadro
        cuadro.append(nuevaTerapia);
    }
}

);

