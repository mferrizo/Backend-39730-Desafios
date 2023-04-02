const socket = io();

socket.on("productAdded", (product) => {
    const products = document.getElementById("realTimeProducts");

    products.innerHTML += 
    `<div id = ${product.id}>
        <p>${product.title}</p>
        <p>$${product.price}</p>
        <p>Cantidad Disponibles: ${product.stock}</p>
        <br>
    </div>`;
});

socket.on("productDeleted", (id) => {
    const products = document.getElementById("realTimeProducts");
    const product = document.getElementById(id);
    
    products.removeChild(product);
});
