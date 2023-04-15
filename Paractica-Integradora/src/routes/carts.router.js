import { Router } from "express";
import CartManager from "../dao/dbManagers/CartManager.js";

const router = Router();
const cartManager = new CartManager();
let carts = [];

// Pedido de el archivo completo de carts
router.get("/", async (req, res) => {
  const carts = await cartManager.getCarts();
  if (!carts) {
    return res
      .status(400)
      .send({ status: "error", error: "Get collection error" });
  } else {
    return res.send({ carts });
  }
});

// Pedido de un cart especifico por el cid (cart id)
router.get("/:cid", async (req, res) => {
  const cid = req.params.cid;
  const products = await cartManager.getCartById(cid);
  if (!products) {
    return res.status(400).send({ status: "error", error: "Id not found" });
  } else {
    return res.send({ products });
  }
});

// Crear un nuevo cart
router.post("/", async (req, res) => {
  const carts = await cartManager.addCart();
  if (!carts) {
    return res.status(400).send({ status: "error", error: "Cart not created" });
  } else {
    return res.send({ carts });
  }
});

// Agergar un nuevo producto pid (product id) a un cart cid (cart id)
router.post("/:cid/product/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;

  const carts = await cartManager.updateCart(cid, pid);
  if (!carts) {
    return res
      .status(400)
      .send({ status: "error", error: "Add product in cart error" });
  } else {
    return res.send({ carts });
  }
});

export default router;
