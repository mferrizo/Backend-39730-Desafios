const socket = io();

const deleteBox = document.getElementById("deleteBox");
const addBox = document.getElementById("addBox");

// Evento para eliminar producto al pulsar el boton con el id especificado en la casilla
deleteBox.addEventListener("click", () => {
  let deleteId = document.querySelector("#pid").value;
  socket.emit("deleteProduct", deleteId);
  deleteBox.value = "";
});

// Evento para agregar producto al pulsar el boton con los datos especificados en las casillas
addBox.addEventListener("click", () => {
  var addProduct = {
    status: false,
  };

  let infoTitle = document.querySelector("#title").value,
    infoDescription = document.querySelector("#description").value,
    infoPrice = document.querySelector("#price").value,
    infoCode = document.querySelector("#code").value,
    infoStock = document.querySelector("#stock").value,
    infoCategory = document.querySelector("#category").value,
    infoStatus = document.querySelector("#status").value;

  addProduct.title = infoTitle;
  addProduct.description = infoDescription;
  addProduct.price = parseInt(infoPrice);
  addProduct.code = infoCode;
  addProduct.stock = parseInt(infoStock);
  addProduct.category = infoCategory;
  if (infoStatus === "false") {
    addProduct.status = false;
  } else {
    addProduct.status = true;
  }

  socket.emit("addProduct", addProduct);
  addBox.value = "";
});

// Funcion para imprimir en pantalla los datos del array con los productos
socket.on("printProducts", (data) => {
  realTime.innerHTML = "";
  data.forEach((element) => {
    realTime.innerHTML += `<tr>
             <p>Id: ${element._id}</p>
             <p>Title: ${element.title}</p>
             <p>Description: ${element.description}</p>
             <p>Price: ${element.price}</p>
             <p>Code: ${element.code}</p>
             <p>Stock: ${element.stock}</p>
             <p>Category: ${element.category}</p>
             <p>Status: ${element.status}</p>
             <p>Thumbnail: ${element.thumbnail}</p>
             </tr><br/>`;
  });
});
