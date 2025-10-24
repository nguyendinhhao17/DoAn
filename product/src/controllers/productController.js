const ProductsService = require("../services/productsService");
const uuid = require('uuid');
const supabase = require('../config/supabase');

class ProductController {
  constructor() {
    this.productsService = new ProductsService();
    this.createOrder = this.createOrder.bind(this);
    this.getOrderStatus = this.getOrderStatus.bind(this);
    this.ordersMap = new Map();
  }

  async createProduct(req, res, next) {
    try {
      const { name, description, price } = req.body;

      if (!name || !price) {
        return res.status(400).json({ message: "Name and price are required" });
      }

      const product = await this.productsService.createProduct(
        { name, description, price },
        req.user.id
      );

      res.status(201).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await this.productsService.getProductById(id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  async getProducts(req, res, next) {
    try {
      const products = await this.productsService.getProducts();
      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  async createOrder(req, res, next) {
    try {
      const { ids } = req.body;

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: "Product IDs are required" });
      }

      const products = await this.productsService.getProductsByIds(ids);

      if (products.length === 0) {
        return res.status(404).json({ message: "No products found" });
      }

      const totalPrice = products.reduce((sum, p) => sum + parseFloat(p.price), 0);

      const { data: order, error } = await supabase
        .from('orders')
        .insert([{
          user_id: req.user.id,
          username: req.user.username,
          products: products,
          total_price: totalPrice,
          status: 'completed'
        }])
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  async getOrderStatus(req, res, next) {
    const { orderId } = req.params;
    const order = this.ordersMap.get(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.status(200).json(order);
  }
}

module.exports = ProductController;
