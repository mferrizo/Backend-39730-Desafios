import { cartModel } from "../models/cartModel.js";
import { productModel } from "../models/productModel.js";

export default class CartManager {
  constructor() {}

  // Funcion para obtener los datos del archivo carrito.jason
  getCarts = async () => {
    try {
      const carts = await cartModel.find();
      if (!carts) {
        return res
          .status(400)
          .send({ status: "error", error: "Get messages error" });
      } else {
        return carts;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Funcion para obtener los datos de un cart especifico por el id
  getCartById = async (cartId) => {
    try {
      const carts = await cartModel.find({ _id: cartId });
      if (!carts) {
        return res.status(400).send({ status: "error", error: "Id not found" });
      } else {
        // if (!carts) {
        //   return "Id not found";
        // }
        return carts;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Funcion para agregar un cart al arcihvo
  addCart = async () => {
    try {
      const created = await cartModel.create({ products: [] });
      if (!created) {
        return res
          .status(400)
          .send({ status: "error", error: "Add cart error" });
      } else {
        return created;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Funcion para agregar un producto por el id al cart undicado por su id
  updateCart = async (cartId, productId) => {
    let cartToUpdated;
    let elementsToUpdated = [];
    let cartProductsArray = [];
    let indexEncontrado = -1;

    try {
      const product = await productModel.find({ _id: productId });
      if (!product) {
        return res
          .status(400)
          .send({ status: "error", error: "Id product not found" });
      } else {
        // if (product.length === 0) {
        //   return "Product not exist";
        // } else {
        const updated = await cartModel.find({ _id: cartId });
        if (!updated) {
          return res
            .status(400)
            .send({ status: "error", error: "Id cart not found" });
        } else {
          // if (updated.length === 0) {
          //   return "Cart not found";
          // } else {
          cartToUpdated = await cartModel.find({ _id: cartId });

          cartToUpdated.forEach((element, index) => {
            elementsToUpdated = element.products;
            element.products.forEach((element, index) => {
              cartProductsArray[index] = element.product;
            });
          });

          // const grosso = await cartModel.find({ _id: cartId });
          if (cartProductsArray.length === 0) {
            elementsToUpdated = {
              product: productId,
              quantity: 1,
            };
          } else {
            cartProductsArray.forEach((element, index) => {
              if (element === productId) {
                indexEncontrado = index;
              }
            });
            if (indexEncontrado === -1) {
              const newProduct = {
                product: productId,
                quantity: 1,
              };
              elementsToUpdated.push(newProduct);
            } else {
              elementsToUpdated[indexEncontrado].quantity++;
            }
          }

          const updatedCart = await cartModel.updateOne(
            { _id: cartId },
            { products: elementsToUpdated }
          );
          if (!updatedCart) {
            return res
              .status(400)
              .send({ status: "error", error: "Add product in cart error" });
          } else {
            return updatedCart;
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
}
