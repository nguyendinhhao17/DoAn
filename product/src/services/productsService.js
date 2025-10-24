const ProductsRepository = require("../repositories/productsRepository");

class ProductsService {
  constructor() {
    this.productsRepository = new ProductsRepository();
  }

  async createProduct(product, userId) {
    const createdProduct = await this.productsRepository.create(product, userId);
    return createdProduct;
  }

  async getProductById(productId) {
    const product = await this.productsRepository.findById(productId);
    return product;
  }

  async getProducts() {
    const products = await this.productsRepository.findAll();
    return products;
  }

  async getProductsByIds(ids) {
    const products = await this.productsRepository.findByIds(ids);
    return products;
  }
}

module.exports = ProductsService;
