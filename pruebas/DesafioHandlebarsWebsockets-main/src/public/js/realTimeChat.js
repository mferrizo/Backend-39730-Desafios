const socket = io();

const messageBox = document.getElementById("messageBox");

// Evento para agregar mensaje al pulsar el boton con los datos especificados en las casillas
messageBox.addEventListener("click", () => {
  var addMessage = {};

  let infoUser = document.querySelector("#user").value,
    infoMessage = document.querySelector("#message").value;

  addMessage.user = infoUser;
  addMessage.message = infoMessage;

  socket.emit("addMessage", addMessage);
  messageBox.value = "";
});

// Funcion para imprimir en pantalla los datos del array con los mensajes
socket.on("printMessages", (data) => {
  realTimeChat.innerHTML = "";
  data.forEach((element) => {
    realTimeChat.innerHTML += `<tr>
             <p>Usuario: ${element.user}</p>
             <p>Mensage: ${element.message}</p>
             </tr><br/>`;
  });
});
