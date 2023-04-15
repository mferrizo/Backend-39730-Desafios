import mongoose from "mongoose";

const cartCollection = "Carts";

const cartSchema = new mongoose.Schema({
  products: {
    type: Array,
    default: [],
  },
});

const cartModel = mongoose.model(cartCollection, cartSchema);

export { cartModel };
