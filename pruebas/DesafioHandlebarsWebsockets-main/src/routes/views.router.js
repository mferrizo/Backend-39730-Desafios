import { Router } from "express";
import ProductManager from "../dao/dbManagers/ProductManager.js";
import MessageManager from "../dao/dbManagers/MessageManager.js";

const router = Router();
const productManager = new ProductManager();
const messageManager = new MessageManager();

// Llamado a la vista con Handlebars
router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  let productsArray = [];
  products.forEach((element, index) => {
    const _id = element._id;
    const title = element.title;
    const description = element.description;
    const price = element.price;
    const code = element.code;
    const stock = element.stock;
    const category = element.category;
    const status = element.status;
    const thumbnail = element.thumbnail;

    productsArray[index] = {
      _id,
      title,
      description,
      price,
      code,
      stock,
      category,
      status,
      thumbnail,
    };
  });
  // console.log(productsArray);

  res.render("index", {
    productsArray: productsArray,
  });
});

router.get("/messages", async (req, res) => {
  const messages = await messageManager.getMessages();
  let messageArray = [];
  messages.forEach((element, index) => {
    const user = element.user;
    const message = element.message;
    messageArray[index] = { user, message };
  });
  res.render("chat", {
    messagesArray: messageArray,
  });
});

// Llamado a la vista con Socket
router.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts", {});
});

router.get("/realtimechat", async (req, res) => {
  res.render("realTimeChat", {});
});

export default router;
