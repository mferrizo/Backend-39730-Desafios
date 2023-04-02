import { Router } from "express";
import CartManager from "../classes/CartManager.js";

//Create Product Manager instance
const CART_PATH = "./src/files/carts.json";

const cmanager = new CartManager(CART_PATH);

//Create Router instance
const cartsRouter = Router();

cartsRouter.get("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const cartProducts = await cmanager.getCartByID(cid);

    if (cartProducts !== -1)
        res.status(200).send({
            status: "success",
            cartProducts: cartProducts,
        });
    else
        res.status(404).send({
            status: "error",
            message: "Not found cart",
        });
});

cartsRouter.post("/", async (req, res) => {
    const { products } = req.body;

    if (products)
        try {
            await cmanager.createCart(products);
            res.status(201).send({
                status: "success",
                message: "Cart created successfully",
            });
        } catch (error) {
            res.status(error.status).send(error.message);
        }
    else {
        res.status(400).send({
            status: "error",
            message: "Products to add to cart are required",
        });
    }
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;

    try {
        await cmanager.addProduct(cid, pid);
        res.status(201).send({
            status: "success",
            message: `Product id:${pid} added to cart id:${cid}`,
        });
    } catch (error) {
        res.status(error.status).send(error.message);
    }
});

export default cartsRouter;