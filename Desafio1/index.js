class Product {
    constructor(title, description, price, thumbnail, code, stock) {

      this.title = title,
      this.description = description,
      this.price = price,
      this.thumbnail = thumbnail,
      this.code = code,
      this.stock = stock
    }
  }
  
  class ProductManager {
    constructor() {
      this.products = [];
      this.lastId = 0;
    }
  
    addProduct(product) {
      if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
        throw new Error("Todos los campos son obligatorios");
      }
  
      const existingProduct = this.products.find(p => p.code === product.code);
      if (existingProduct) {
        throw new Error(`El código del producto ID '${product.code}' ya existe, por favor cambiar el producto '${product.description}'`);
        
      }
  
      product.id = ++this.lastId;
      this.products.push(product);
    }

    getProducts() {
        return this.products
      }

    getProductById(id) {
        for (let i = 0; i < this.products.length; i++) {
          if (this.products[i].id === id) {
            return this.products[i];
          }
        }
        console.error('Not found');
        return null;
      }
      
  }
  const productManager = new ProductManager();
  try {
    productManager.addProduct(new Product("Teclado", "Teclado Genius KB-100", 2346, "https://acortar.link/U0OvTj", 1, 9));
    productManager.addProduct(new Product("Mouse", "Mouse Genius DX-110 USB", 1109, 'https://acortar.link/zvR6tV', 2, 10));
    productManager.addProduct(new Product("Mouse", "Mouse Genius DX-220 PS2", 1100, 'https://acortar.link/zvR6tV', 2, 10));
  } catch (error) {
    console.error(error.message);
  }
  
console.log(productManager.getProducts());
console.log(productManager.getProductById(1));