// Función para llamar a la ruta que muestra los resultados disponibles
function mostrarResultadosDisponibles() {
    $.ajax({
        url: "/busqueda_disponibles",
        type: "GET",
        success: function (response) {
            // Muestra los resultados disponibles
            $(".Encontradas").html(response.resultados_html);
        },
        error: function (error) {
            console.error("Error al obtener resultados disponibles:", error);
        }
    });
}

// Cambios en la función de búsqueda de terapia
$("#btnBuscar").click(function () {
    var busquedaTerapia = $("#txtBuscar").val();

    $.ajax({
        url: "/buscar_terapia",
        type: "POST",
        data: { txtBuscar: busquedaTerapia },
        success: function (response) {
            $(".Encontradas").html(response.resultados_html);

            // Redirigir después de cargar los resultados
            console.log("Redirigiendo a /redireccionar");
            window.location.href = "/redireccionar";
        },
        error: function (error) {
            console.error("Error al buscar terapia:", error);
        }
    });
});

// Llamada a la nueva función para mostrar resultados disponibles
mostrarResultadosDisponibles();
