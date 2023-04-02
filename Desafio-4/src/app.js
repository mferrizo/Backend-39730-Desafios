import express from "express";
import productsRouter from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";
import _dirname from "./utils.js";
import handlebars from "express-handlebars";
import viewsRouter from "./routers/views.router.js";
import socket from "./socket.js";

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//==== Handlebars setting ====
app.engine('handlebars', handlebars.engine())
app.set('views', `${_dirname}/views`)
app.set('view engine', 'handlebars')

//==== Static files ====
app.use(express.static(`${_dirname}/public`));


//==== Routes ====
app.use('/', viewsRouter)
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//==== Server ====
const httpServer = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

socket.connect(httpServer)
