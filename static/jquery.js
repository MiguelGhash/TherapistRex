$(document).ready(function() {
    $("#registro-form").submit(function(event) {
        // Detener el envío del formulario por defecto
        event.preventDefault();

        // Verificar campos vacíos
        var camposVacios = false;
        $("#registro-form input:visible").each(function() {
            if ($(this).val() === '') {
                camposVacios = true;
                return false; // Salir del bucle si se encuentra un campo vacío
            }
        });

        if (camposVacios) {
            // Mostrar ventana emergente indicando que se deben rellenar todos los campos
            alert("Por favor, rellena todos los campos.");
        } else {
            // Obtener datos del formulario para el registro
            var datosRegistro = {
                nombre: $("#txtName").val(),
                pais: $("#txtCountry").val(),
                correo: $("#txtMail").val(),
                contrasena: $("#txtPass").val(),
                tipo: $("#tipoUsuario").val(), // Nuevo campo 'tipo'
                // Otros campos del formulario
            };

            // Enviar datos al servidor para el registro
            $.ajax({
                url: "/registrar_usuario",  // Nueva ruta para el registro en el servidor
                method: "POST",
                data: datosRegistro,
                dataType: "json",
                success: function(response) {
                    if (response.status === "exito") {
                        // Registro exitoso, redirigir o mostrar mensaje
                        window.location.href = "/";
                    } else {
                        // Manejar errores u otros casos
                        alert("Error en el registro. Inténtalo de nuevo más tarde.");
                    }
                },
                error: function(error) {
                    console.error("Error en la solicitud AJAX:", error);
                }
            });
        }
    });
});
