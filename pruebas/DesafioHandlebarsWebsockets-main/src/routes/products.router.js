import { Router } from "express";
import ProductManager from "../dao/dbManagers/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

// Pedido de todos los productos y con limite
router.get("/", async (req, res) => {
  const limit = req.query.limit;
  const products = await productManager.getProducts();

  if (!limit) {
    res.send({ products });
  } else {
    let productsLimit = [];
    for (let i = 0; i < limit && i < products.length; i++) {
      productsLimit.push(products[i]);
    }
    res.send(productsLimit);
  }
});

// Pedido de un product especifico por el pid (product id)
router.get("/:pid", async (req, res) => {
  const pid = req.params.pid;
  const product = await productManager.getProductById(pid);
  if (!product) {
    return res.status(400).send({ status: "error", error: "Id not found" });
  } else {
    return res.send(product);
  }
});

// Agregar un nuevo product
router.post("/", async (req, res) => {
  const product = req.body;
  const products = await productManager.addProduct(product);
  if (!products) {
    return res
      .status(400)
      .send({ status: "error", error: "Add product error" });
  } else {
    return res.send({ products });
  }
});

// Actualizar los datos de un product epecifico por el pid (product id)
router.put("/:pid", async (req, res) => {
  const pid = req.params.pid;
  const updateProduct = req.body;
  const products = await productManager.updateProduct(pid, updateProduct);
  if (!products) {
    return res
      .status(400)
      .send({ status: "error", error: "Update product error" });
  } else {
    return res.send({ products });
  }
});

// Eliminar un product especifico por el pid (product id)
router.delete("/:pid", async (req, res) => {
  const pid = req.params.pid;
  const products = await productManager.deleteProduct(pid);
  if (!products) {
    return res
      .status(400)
      .send({ status: "error", error: "Delete product error" });
  } else {
    return res.send({ products });
  }
});

export default router;
