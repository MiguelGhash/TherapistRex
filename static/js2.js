
document.addEventListener("DOMContentLoaded", function() {
    var tipoUsuario = document.getElementById("tipoUsuario");
    var DatosUsuario = document.getElementById("DatosUsuario");
    var dataTerapista = document.querySelector(".dataTerapista");
    var dataPaciente = document.querySelector(".dataPaciente");
  
  
    // Agregar un evento de cambio al select
    tipoUsuario.addEventListener("change", function () {
        // Ocultar ambos divs
        dataTerapista.classList.remove("active");
        dataPaciente.classList.remove("active");
  
        // Mostrar el div correspondiente
        if (tipoUsuario.value === "Terap") {
            dataTerapista.classList.add("active");
        } else if (tipoUsuario.value === "Paciente") {
            dataPaciente.classList.add("active");
        }
    });
  });


  