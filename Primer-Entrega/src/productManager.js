const fs = require('fs');

class ProductManager {
    constructor(filePath) {
      this.path = filePath;
    }
  
    //Leyendo el archivo, con manejo de error
    async readFile() {
      try {
        const content = await fs.promises.readFile(this.path, 'utf-8');
        const jparseContent = JSON.parse(content);
        return jparseContent;
      } catch (error) {
        console.log("No se puede leer el archivo\n",error);
      }
    }
  
    // Busqueda
    async checkProductCode(code) {
      const fileContent = await this.readFile();
      return fileContent.find((object) => object.code === code);
    }
  
  
    async getProducts() {
      const fileContent = await this.readFile();
      try {
        if (fileContent.length === 0) throw new Error(`No se encontraron Productos.`);
        else return fileContent;
      } catch (error) {
        console.log(`No se encontraron Productos.`);
      }
    }
    
    //Busqueda
    async getProductById(id) {
      try {
        const fileContent = await this.readFile();
        if (!fileContent.find((obj) => obj.id === id)) throw new Error(`No se encontraron productos con el id ${id}.`);
        else return fileContent.find((obj) => obj.id === id);
      } catch (error) {
        console.log(`No se encontraron productos con el id ${id}.`);
      }
    }

    // Agrega productos
    async addProduct(obj) {
      const fileContent = await this.readFile();
      if (await this.checkProductCode(obj.code)) return console.log(`El producto con el codigo ${obj.code} ya existe.`)
      try {
        if (fileContent.length !== 0) await fs.promises.writeFile(this.path, JSON.stringify([...fileContent, { ...obj, id: fileContent[fileContent.length -1].id +1 },], null, 3));
        else await returnfs.promises.writeFile(this.path, JSON.stringify([{ ...obj, id: 1 }]));
        return fileContent;
      } catch (error) {
        console.log("Falla al agregar el producto\n",error);
      }
    }

    // Actualziacion
    async updateProduct(id, obj) {
      try {
        const fileContent = await this.readFile();
        const updated = fileContent.map((product) => product.id === id ? { ...product, ...obj } : product);
        if (!fileContent.find((objeto) => objeto.id === id)) throw new Error(`No se encontro el producto con el id ${id}.`);
        else await fs.promises.writeFile(this.path, JSON.stringify(updated, null, 3));
        return fileContent;
      } catch (error) {
        console.log(`No se puede actualizar el producto con el id ${id}.`);
      }
    }

    //Borrado
    async deleteProductById(id) {
      try {
        const fileContent = await this.readFile();
        const update = fileContent.filter((product) => product.id !== id);
        if (!fileContent.find((obj) => obj.id === id)) throw new Error(`No se encontro el producto con el id ${id}.`);
        else await fs.promises.writeFile(this.path, JSON.stringify(update, null, 3));
      } catch (error) {
        console.log(`No se puede borrar el producto con el id ${id}.`);
      }
    }
  }

  module.exports = ProductManager;