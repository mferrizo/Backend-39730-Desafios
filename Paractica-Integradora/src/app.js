import express from "express";
import handlebars from "express-handlebars";
import { socket } from "./socket.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import messagesRouter from "./routes/messages.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import __dirname from "./utils.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static(`${__dirname}/public`));

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const port = process.env.PORT;

const httpServer = app.listen(port, () => {
  console.log(`Server on port ${port}`);
});

mongoose.connect(
  `mongodb+srv://${dbUser}:${dbPassword}@ecommerce.o3a2yau.mongodb.net/${dbName}?retryWrites=true&w=majority`
);

app.use("/api/messages", messagesRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

socket.connect(httpServer);
