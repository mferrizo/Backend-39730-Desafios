import { promises as fs, existsSync, writeFileSync } from "fs";

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    checkFile = () => {
        // If the file doesn't exists, we create it. Otherwise, do nothing
        !existsSync(this.path) && writeFileSync(this.path, "[]", "utf-8");
    };

    async addProduct(title, description, price, thumbnail, code, stock) {
        const prodObj = { title, description, price, thumbnail, code, stock };

        // Check if the product has missing data (empty value)
        if (Object.values(prodObj).includes("") || Object.values(prodObj).includes(null)) {
            console.log("Missing product field");
        } else {
            this.checkFile();
            try {
                // Reading file
                const read = await fs.readFile(this.path, "utf-8");
                let data = JSON.parse(read);
                // Check existing product code
                if (data.some((elem) => elem.code === prodObj.code)) {
                    throw "Code " + code + " already exists, cannot add";
                } else {
                    let newID;
                    !data.length ? (newID = 1) : (newID = data[data.length - 1].id + 1);
                    // Push obj to the read array
                    data.push({ ...prodObj, id: newID });
                    // Write data to the file
                    await fs.writeFile(this.path, JSON.stringify(data), "utf-8");
                }
            } catch (err) {
                console.error(err);
            }
        }
    }

    async getProducts() {
        this.checkFile();
        try {
            const read = await fs.readFile(this.path, "utf-8");
            let data = JSON.parse(read);
            return data;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    async getProductById(id) {
        this.checkFile();
        try {
            const read = await fs.readFile(this.path, "utf-8");
            const data = JSON.parse(read);
            const found = data.find((prod) => prod.id === id);
            if (!found) {
                throw "ID not found";
            } else {
                //console.log(found);
                return found;
            }
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    async updateProduct(id, title, description, price, thumbnail, code, stock) {
        this.checkFile();
        try {
            const read = await fs.readFile(this.path, "utf-8");
            const data = JSON.parse(read);
            if (data.some((prod) => prod.id === id)) {
                const index = data.findIndex((prod) => prod.id === id);
                data[index].title = title;
                data[index].description = description;
                data[index].price = price;
                data[index].thumbnail = thumbnail;
                data[index].code = code;
                data[index].stock = stock;
                await fs.writeFile(this.path, JSON.stringify(data), "utf-8");
            } else {
                throw "ID not found";
            }
        } catch (err) {
            console.log(err);
        }
    }

    async deleteProduct(id) {
        this.checkFile();
        try {
            const read = await fs.readFile(this.path, "utf-8");
            const data = JSON.parse(read);
            const index = data.findIndex((prod) => prod.id === id);
            if (index !== -1) {
                data.splice(index, 1);
                await fs.writeFile(this.path, JSON.stringify(data), "utf-8");
            } else {
                throw "ID " + id + " not found";
            }
        } catch (err) {
            console.log(err);
        }
    }
}

export default ProductManager;

// TESTING
// - Crear instancia de ProductManager
//const manager = new ProductManager("./database.json");
// - Agregar productos
//manager.addProduct("producto prueba1", "Este es un producto prueba1", 200, "Sin imagen", "abc123", 25);
//manager.addProduct("producto prueba2", "Este es un producto prueba2", 200, "Sin imagen", "bc123", 25);
//manager.addProduct("producto prueba3", "Este es un producto prueba3", 200, "Sin imagen", "c123", 25);
//manager.addProduct("producto prueba4", "Este es un producto prueba4", 200, "Sin imagen", "123", 25);
//manager.addProduct("producto prueba5", "Este es un producto prueba5", 200, "Sin imagen", "23", 25);
//manager.getProducts();
//manager.getProductByID(2);
//manager.updateProduct(...)
//manager.deleteProduct(3)
