import fs from "fs";

export default class ProductManager {
  constructor() {
    this.path = "./files/productos.json";
  }

  //Funcion para obtener todos los datos del carchivo productos.json
  getProducts = async () => {
    if (fs.existsSync(this.path)) {
      const fileData = await fs.promises.readFile(this.path, "utf-8");
      const result = JSON.parse(fileData);
      return result;
    } else {
      return [];
    }
  };

  // Funcion para obtener un product especifico por el id
  getProductById = async (productId) => {
    const productIdInt = parseInt(productId);
    const products = await this.getProducts();
    let productIndex = -1;

    products.forEach((element, index) => {
      if (element._id === productIdInt) {
        productIndex = index;
      }
    });

    if (productIndex === -1) {
      return "Id not found";
    }
    return products[productIndex];
  };

  // Funcion para agregar un product al archivo
  addProduct = async (product) => {
    let products = await this.getProducts();

    if (products.length === 0) {
      this.productToAdd = false;
      product._id = 1;
    } else {
      this.productToAdd = products.find(
        (productAdd) => productAdd.code === product.code
      );
      product._id = products[products.length - 1]._id + 1;
    }

    if (product.status != false) {
      product.status = true;
    }

    if (
      (product.title ?? false) &&
      (product.description ?? false) &&
      (product.code ?? false) &&
      (product.price ?? false) &&
      (product.stock ?? false) &&
      (product.category ?? false)
    ) {
      if (!this.productToAdd) {
        products.push(product);

        const string = JSON.stringify(products, null, "\t");

        await fs.promises.writeFile(this.path, string);
        return product;
      } else {
        return "The product already exists";
      }
    } else {
      return "Missing data";
    }
  };

  // Funcion para actualizar un product por el id en el archivo
  updateProduct = async (productId, product) => {
    const productIdInt = parseInt(productId);
    const products = await this.getProducts();

    const productIndex = products.findIndex(
      (productToUpdate) => productToUpdate._id === productIdInt
    );

    if (productIndex === -1) {
      return "Not found to update";
    } else {
      products[productIndex] = { ...products[productIndex], ...product };

      const string = JSON.stringify(products, null, "\t");
      await fs.promises.writeFile(this.path, string);

      return products;
    }
  };

  // Funcion para eliminar un product por el id en el archivo
  deleteProduct = async (productId) => {
    const productIdInt = parseInt(productId);
    const products = await this.getProducts();

    const productIndex = products.findIndex(
      (product) => product._id === productIdInt
    );

    if (productIndex === -1) {
      return "Not found to delete";
    } else {
      const eliminado = products.filter(
        (product) => product._id != productIdInt
      );

      const string = JSON.stringify(eliminado, null, "\t");
      await fs.promises.writeFile(this.path, string);

      return eliminado;
    }
  };
}
