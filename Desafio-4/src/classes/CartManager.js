import fs from "fs";
import Exception from "./Exceptions.js";

export default class CartManager {
    constructor(path) {
        this.path = path;
    }

    async createCart(products) {
        const carts = await this.getCarts();

        let cid = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;

        let cart = {
            id: cid,
            products: products,
        };

        carts.push(cart);
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 4));
    }

    async getCarts() {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path);
            const carts = JSON.parse(data);
            return carts;
        } else return [];
    }

    async getCartByID(cid) {
        const carts = await this.getCarts();

        let cart = carts.find((cart) => cart.id == cid);
        if (cart) return cart.products;
        else return -1;
    }

    async addProduct(cid, pid) {
        const carts = await this.getCarts();

        const cartIndex = carts.findIndex((cart) => cart.id == cid);
        let cart = carts[cartIndex];
        if (cart) {
            let productIndex = cart.products.findIndex(
                (product) => product.id == pid
            );
            if (productIndex != -1) cart.products[productIndex].quantity += 1;
            else
                cart.products.push({
                    id: parseInt(pid),
                    quantity: 1,
                });

            carts[cartIndex] = cart;
            await fs.promises.writeFile(
                this.path,
                JSON.stringify(carts, null, 4)
            );
        } else
            throw new Exception(404, {
                status: "error",
                message: "Not found cart to add product",
            });
    }
}