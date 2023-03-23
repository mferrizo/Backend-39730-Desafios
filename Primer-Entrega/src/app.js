//Levantando Servidor
const express = require('express');

const app = express();
app.listen(8080, () => {
    console.log("Server running on port 8080");
  });

  
app.productsPath = "/api/products";
app.cartsPath = "/api/carts";

app.use(app.productsPath, require("./productsRouter"));
app.use(app.cartsPath, require("./cartRouter"));

