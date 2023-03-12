import { promises as fs, existsSync, writeFileSync } from "fs";

class ProductManager {
    constructor(path) {
        this.path = path;
    }
        // Verifica que el archivo exista, si no existe lo crea.
    checkFile = () => {
        !existsSync(this.path) && writeFileSync(this.path, "[]", "utf-8");
    };

    async addProduct(title, description, price, thumbnail, code, stock) {
        const prodObjet = { title, description, price, thumbnail, code, stock };

        // Se revisa que no falten datos en el producto

        if (Object.values(prodObjet).includes("") || Object.values(prodObjet).includes(null)) {
            console.log("Todos los campos son obligatorios");
        } else {
            this.checkFile();
            try {
                // Lee el archivos y revisa que el producto exista
                const read = await fs.readFile(this.path, "utf-8");
                let uploadeddata = JSON.parse(read);
                if (uploadeddata.some((elem) => elem.code === prodObjet.code)) {
                    throw "Code " + code + " already exists, cannot add";
                } else {
                // Push a el Array y escribe los datos en el archivo
                    let newID;
                    !uploadeddata.length ? (newID = 1) : (newID = uploadeddata[uploadeddata.length - 1].id + 1);
                    uploadeddata.push({ ...prodObjet, id: newID });
                    await fs.writeFile(this.path, JSON.stringify(uploadeddata), "utf-8");
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
            let uploadeddata = JSON.parse(read);
            return uploadeddata;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    async getProductById(id) {
        this.checkFile();
        try {
            const read = await fs.readFile(this.path, "utf-8");
            const uploadeddata = JSON.parse(read);
            const found = uploadeddata.find((prod) => prod.id === id);
            if (!found) {
                throw "ID not found";
            } else {
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
            const uploadeddata = JSON.parse(read);
            if (uploadeddata.some((prod) => prod.id === id)) {
                const index = uploadeddata.findIndex((prod) => prod.id === id);
                uploadeddata[index].title = title;
                uploadeddata[index].description = description;
                uploadeddata[index].price = price;
                uploadeddata[index].thumbnail = thumbnail;
                uploadeddata[index].code = code;
                uploadeddata[index].stock = stock;
                await fs.writeFile(this.path, JSON.stringify(uploadeddata), "utf-8");
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
            const uploadeddata = JSON.parse(read);
            const index = uploadeddata.findIndex((prod) => prod.id === id);
            if (index !== -1) {
                uploadeddata.splice(index, 1);
                await fs.writeFile(this.path, JSON.stringify(uploadeddata), "utf-8");
            } else {
                throw "ID " + id + " no encontrado";
            }
        } catch (err) {
            console.log(err);
        }
    }
}

export default ProductManager;