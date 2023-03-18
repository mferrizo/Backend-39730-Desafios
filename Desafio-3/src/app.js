//Levantando Servidor
const express = require('express');

const ProductManager = require("./productManager");
const productManager = new ProductManager("./items.json");

const app = express();
app.listen(8080, () => {
    console.log("Server running on port 8080");
  });

//Con Router
class ProductsRouter {
    async getProducts(req, res) {
      try {
        const products = await productManager.getProducts();
        const { limit } = req.query;
  
        if (limit) {
          const limitProducts = products.slice(0, parseInt(limit));
          res.status(200).json(limitProducts);
        } else {
          res.status(200).json(products);
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  
    async getProductById(req, res) {
      try {
        const { id } = req.params;
        const product = await productManager.getProductById(parseInt(id));
  
        if (!product)
          res.status(404).json({ error: `El producto con el id ${id} no existe.` });
        else res.json(product);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  }


const productsRouter = new ProductsRouter();

app.get("/", productsRouter.getProducts);
app.get("/products", productsRouter.getProducts);
app.get("/:id", productsRouter.getProductById);
app.get("/products/:id", productsRouter.getProductById);