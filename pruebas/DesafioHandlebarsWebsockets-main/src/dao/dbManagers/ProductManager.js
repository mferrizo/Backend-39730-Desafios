import { productModel } from "../models/productModel.js";

export default class ProductManager {
  constructor() {}

  //Funcion para obtener todos los datos del carchivo productos.json
  getProducts = async () => {
    try {
      const products = await productModel.find();
      if (!products) {
        return res
          .status(400)
          .send({ status: "error", error: "Get products error" });
      } else {
        return products;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Funcion para obtener un product especifico por el id
  getProductById = async (productId) => {
    try {
      const products = await productModel.find({ _id: productId });
      if (!products) {
        return res.status(400).send({ status: "error", error: "Id not found" });
      } else {
        // if (products.length === 0) {
        //   return "Id not found";
        // } else {
        return products;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Funcion para agregar un product al archivo
  addProduct = async (product) => {
    if (product.status != false) {
      product.status = true;
    }
    try {
      const createdProduct = await productModel.create(product);
      if (!createdProduct) {
        return res
          .status(400)
          .send({ status: "error", error: "Add product error" });
      } else {
        return createdProduct;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Funcion para actualizar un product por el id en el archivo
  updateProduct = async (productId, product) => {
    try {
      const updated = await productModel.updateOne({ _id: productId }, product);
      if (!updated) {
        return res
          .status(400)
          .send({ status: "error", error: "Update product error" });
      } else {
        // if (updated.length === 0) {
        //   return "Id not found";
        // } else {
        return updated;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Funcion para eliminar un product por el id en el archivo
  deleteProduct = async (productId) => {
    try {
      const eliminado = await productModel.deleteOne({ _id: productId });
      if (!eliminado) {
        return res
          .status(400)
          .send({ status: "error", error: "Delete product error" });
      } else {
        // if (eliminado.length === 0) {
        //   return "Id not found";
        // } else {
        return eliminado;
      }
    } catch (error) {
      console.log(error);
    }
  };
}
