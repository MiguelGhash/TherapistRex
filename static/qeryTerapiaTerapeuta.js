$(document).ready(function () {
    // Obtener y mostrar las terapias del terapeuta al cargar la página
    $.ajax({
        url: "/get_terapias_terapeuta",
        type: "GET",
        success: function (response) {
            // Iterar sobre las terapias y agregarlas al cuadro
            response.terapias.forEach(function (terapia) {
                agregarTerapiaAlCuadro(terapia);
            });
        },
        error: function (error) {
            console.error("Error al obtener las terapias del terapeuta:", error);
        }
    });

    // Función para agregar una terapia al cuadro
    function agregarTerapiaAlCuadro(terapia) {
        // Crear un nuevo div para la terapia
        var nuevaTerapia = $("<div class='terapia-itemDos'></div>");

        // Agregar la información de la terapia al nuevo div
        nuevaTerapia.append("<p>Nombre terapia: " + terapia.nombreTerapia + "</p>");
        nuevaTerapia.append("<p>Descripción terapia: " + terapia.descripcionTerapia + "</p>");
        nuevaTerapia.append("<p>Sobre el terapeuta: " + terapia.descripcionSobreMi + "</p>");

        // Agregar el nuevo div al cuadro
        $("#terapia-itemDos").append(nuevaTerapia);
    }
});

