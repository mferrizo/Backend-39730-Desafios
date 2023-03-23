const { Router } = require("express");
const cartRouter = Router();
const productManager = require("./productManager");


const productManagerCarts = new productManager("../db/carts.json");
const productManagerProducts = new productManager("../db/products.json");


class CartModel {
    constructor(arrayOfProducts) {
      this.products = arrayOfProducts;
    }
  }


cartRouter.get("/", async (req, res) => {
  try {
    const carts = await productManagerCarts.getProducts();
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

cartRouter.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await productManagerCarts.getProductById(cid);
    if (cart) res.status(200).json(cart);
    else res.status(404).json({ error: `No se encontro el producto con el id ${cid}.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

cartRouter.post('/', async (req, res) => {
  const cart = new CartModel([]);
  try {
    const newCart = await productManagerCarts.addProduct(cart);
    res.status(200).json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const [product, cart] = await Promise.all([
      productManagerProducts.getProductById(pid),
      productManagerCarts.getProductById(cid),
    ]);
    if (!product) return res.status(404).json({ error: `No se encontro el producto con el id ${pid}.` });
    const productInCart = cart.products.find((p) => p.product === product.id);
    if (productInCart) productInCart.quantity += 1;
    else cart.products.push({ product: product.id, quantity: 1 });
    await productManagerCarts.updateProduct(cid, cart);
    res.status(200).json(`Producto ${pid} agregado al carrito ${cid}.`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = cartRouter;