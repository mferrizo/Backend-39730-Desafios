import fs from "fs";
import Exception from "./Exceptions.js";
import socket from "../socket.js";

export default class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async addProduct(
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnails
    ) {
        const products = await this.getProducts();
        if (
            !products.find((product) => product.code == code) &&
            title !== undefined &&
            description !== undefined &&
            code !== undefined &&
            price !== undefined &&
            stock !== undefined &&
            category !== undefined
        ) {
            //assign stock status
            let status = stock > 0 ? true : false;

            //assign id product
            let id = products.length ? products[products.length - 1].id + 1 : 1;

            let product = {
                id: id,
                title: title,
                description: description,
                code: code,
                price: price,
                status: status,
                stock: stock,
                category: category,
                thumbnails: thumbnails,
            };

            products.push(product);
            
            socket.io.emit("productAdded", product);
            
            await fs.promises.writeFile(
                this.path,
                JSON.stringify(products, null, 4)
            );

        } else
            throw new Exception(400, {
                status: "error",
                message: "Product already exists",
            });
    }

    async getProducts() {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path);
            const products = JSON.parse(data);
            return products;
        } else return [];
    }

    async getProductByID(id) {
        const products = await this.getProducts();

        let product = products.find((product) => product.id == id);
        if (product) return product;
        else return -1;
    }

    async updateProduct(id, newFields) {
        const products = await this.getProducts();

        let productIndex = products.findIndex((product) => product.id == id);

        if (productIndex !== -1) {
            let product = products[productIndex];
            let updatedProduct = {
                ...product,
                ...newFields,
            };

            products[productIndex] = updatedProduct;

            await fs.promises.writeFile(
                this.path,
                JSON.stringify(products, null, 4)
            );
        } else
            throw Exception(404, {
                status: "error",
                message: "Not found product to update",
            });
    }

    async deleteProduct(id) {
        const products = await this.getProducts();

        let productPosicion = products.findIndex((product) => product.id == id);
        if (productPosicion !== -1) {
            products.splice(productPosicion, 1);
            await fs.promises.writeFile(
                this.path,
                JSON.stringify(products, null, 4)
            );
            
            socket.io.emit("productDeleted", id);

        } else
            throw new Exception(404, {
                status: "error",
                message: "Not found product to delete",
            });
    }
}