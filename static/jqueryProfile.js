// Este código espera a que el documento esté completamente cargado antes de ejecutarse
$(document).ready(function () {
    // Realiza una solicitud al servidor para obtener los datos del usuario
    $.ajax({
        url: "/get_user_data",
        type: "GET",
        success: function (response) {
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
        $("#formularioTerapia").addClass("active");
    });

    // Ocultar el formulario al hacer clic fuera de él
    $(document).mouseup(function (e) {
        var container = $(".formulario-flotante");
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            $("#formularioTerapia").removeClass("active");
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
                alert(response.message);
                $("#formTerapia")[0].reset();
                $("#formularioTerapia").removeClass("active");

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
 



    // Función para agregar una terapia al cuadro
    function agregarTerapiaAlCuadro(terapia) {
        var cuadro = $("#cuadro");

        var nuevaTerapia = $("<div class='terapia-item'></div>");
        nuevaTerapia.append("<p>Nombre terapia: " + terapia.nombreTerapia + "</p>");
        nuevaTerapia.append("<p>Descripción terapia: " + terapia.descripcionTerapia + "</p>");

        var nombreTerapeuta = $(".NombreUs").text();
        nuevaTerapia.append("<p>Nombre terapeuta: " + nombreTerapeuta + "</p>");

        nuevaTerapia.append("<p>Sobre el terapeuta: " + terapia.descripcionSobreMi + "</p>");

        var telefonoTerapeuta = $(".Telefono").text();
        nuevaTerapia.append("<p>Contacto: " + telefonoTerapeuta + "</p>");

        cuadro.append(nuevaTerapia);
    }
});
