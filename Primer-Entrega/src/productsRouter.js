const { Router } = require("express");
const productsRouter = Router();
const ProductManager = require("./productManager");
const Upload = require("./multer");

//Con Router y Manejo de errores
class ProductModel {
    constructor(title, description, code, stock, category, price, files) {
      this.title = title;
      this.description = description;
      this.code = code;
      this.price = price;
      this.status = true;
      this.stock = stock;
      this.category = category;
      this.files = files;

    }
  }

  const productManager = new ProductManager("../db/products.json");

  const ItemsValidate = (title, description, code, stock, category, price) => {
    try {
      if (!title || !description || !code || !stock || !category || !price) return true;
      else if (price < 0) return true;
      else if (stock < 0) return true;
      else return false;
    } catch (error) {
      throw new Error(error.message);
    }
  };

productsRouter.get("/", async (req, res) => {
  const { limit } = req.query;
  try {
    const products = await productManager.getProducts();
    if (limit && limit <= products.length) {
      const limitedProducts = products.slice(0, limit);
      res.status(200).json(limitedProducts);
    } else {
      res.status(200).json(products);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


productsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    const product = await productManager.getProductById(id);

    if (product) res.status(200).json(product);
    else res.status(404).json({ error: `No se encontro producto con el id ${id}.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


productsRouter.post("/", Upload, async (req, res) => {
  const { title, description, code, stock, category, price } = req.body; 

  const files = await req.files.map(file => file.filename);
  if (ItemsValidate(title, description, code, stock, category, price)) {
    res.status(400).json({ error: "Faltan campos por llenar." });
  } else {
      try {
        const newProduct = new ProductModel(title, description, code, Number(stock), category, Number(price), files);
        const product = await productManager.addProduct(newProduct);
        res.status(200).json({ status: "success", payload: product });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
});


productsRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, code, stock, category, price } = req.body;

  try {
    const product = await productManager.getProductById(id);
    if (ItemsValidate(title, description, code, stock, category, price)) {
      res.status(400).json({ error: "Faltan campos por llenar." });
      return;
    } 

    const newProduct = new ProductModel(title, description, code, Number(stock), category, Number(price), product.files, product.status);  
    const updatedProduct = await productManager.updateProduct(id, newProduct);

    if (!updatedProduct) res.status(404).json({ error: `No se encontro producto con el id ${id}.` });
    else res.status(200).json(updatedProduct);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});

productsRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const product = await productManager.deleteProductById(id);

    if (!product) res.status(404).json({ error: `No se encontro producto con el id ${id}.` });
    else res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = productsRouter;