import { Router } from "express";
import ProductManager from "../classes/ProductManager.js";

//Create Product Manager instance
const PATH = "./src/files/products.json";
const pmanager = new ProductManager(PATH);

//Create Router instance
const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
    const products = await pmanager.getProducts();
    if (products.length > 0) {
        const { limit } = req.query;
        if (limit) {
            let limitedProducts = products.slice(0, limit);
            res.status(200).send({
                status: "success",
                products: [...limitedProducts],
            });
        } else
            res.status(200).send({
                status: "success",
                products: [...products],
            });
    } else
        res.status(404).send({
            status: "error",
            message: "Not found products",
        });
});

productsRouter.get("/:id", async (req, res) => {
    const id = req.params.id;
    const product = await pmanager.getProductByID(id);

    if (product !== -1)
        res.status(200).send({
            status: "success",
            product: product,
        });
    else
        res.status(404).send({
            status: "error",
            message: "Not found product",
        });
});

productsRouter.post("/", async (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } =
        req.body;

    try {
        await pmanager.addProduct(
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails
        );
        res.status(201).send({
            status: "success",
            message: "Product created successfully",
        });
    } catch (error) {
        res.status(error.status).send(error.message);
    }
});

productsRouter.put("/:id", async (req, res) => {
    const id = req.params.id;
    const newFields = req.body;

    try {
        await pmanager.updateProduct(id, newFields);
        res.status(200).send({
            status: "success",
            message: "Product updated succesfully",
        });
        const products = await pmanager.getProducts();
        io.emit("render", products);
    } catch (err) {
        res.status(err.status).send(err.message);
    }
});

productsRouter.delete("/:id", async (req, res) => {
    const id = req.params.id;

    try {
        await pmanager.deleteProduct(id);
        res.status(200).send({
            status: "success",
            message: "Product removed succesfully",
        });
    } catch (err) {
        res.status(err.status).send(err.message);
    }
});

export default productsRouter;