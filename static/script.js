var menuButton = document.getElementById("menu-button");
var menu = document.getElementById("menu");

menuButton.addEventListener("click", function() {
  menuButton.classList.toggle("active");
  menu.classList.toggle("active");
});

const mailInput = document.getElementById('logMail');
const passInput = document.getElementById('logPass');
const mailLabel = document.querySelector('.label-correo');
const passLabel = document.querySelector('.label-contrasena');
const rmailInput = document.getElementById('txtMail');
const rpassInput = document.getElementById('txtPass');

// Al cargar la página, muestra el texto inicial en los campos de entrada
mailInput.value = '';
passInput.value = '';
rmailInput.value = '';
rpassInput.value = '';

function toggleLabelOpacity(label, input) {
  if (input.value === '') {
    label.style.opacity = '1';
  } else {
    label.style.opacity = '0';
  }
}

mailInput.addEventListener('focus', () => {
  if (mailInput.value === 'Correo') {
    mailInput.value = '';
  }
  toggleLabelOpacity(mailLabel, mailInput);
});

mailInput.addEventListener('blur', () => {
  if (mailInput.value === '') {
    mailInput.value = 'Correo';
  }
  toggleLabelOpacity(mailLabel, mailInput);
});

passInput.addEventListener('focus', () => {
  if (passInput.value === 'Contraseña') {
    passInput.value = '';
  }
  toggleLabelOpacity(passLabel, passInput);
});

passInput.addEventListener('blur', () => {
  if (passInput.value === '') {
    passInput.value = 'Contraseña';
  }
  toggleLabelOpacity(passLabel, passInput);
});


$(document).ready(function() {
  $("#txtMail").on("input", function() {
    // Realizar una solicitud asíncrona para verificar el correo
    $.ajax({
      url: "/check_email",
      method: "POST",
      data: { correo: $("#txtMail").val() },
      success: function(response) {
        if (response === "existe") {
          // Si el correo existe, activar la clase "active" en el div de alerta
          $(".Alert").addClass("active");
        } else {
          // Si el correo no existe, desactivar la clase "active" en el div de alerta
          $(".Alert").removeClass("active");
        }
      }
    });
  })})
  document.addEventListener('DOMContentLoaded', function () {
    // Al cargar la página, muestra los campos de texto vacíos
    document.getElementById('txtMail').value = '';
    document.getElementById('txtPass').value = '';
});
