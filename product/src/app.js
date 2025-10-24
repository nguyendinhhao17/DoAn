const express = require("express");
const productsRouter = require("./routes/productRoutes");
require("dotenv").config();

class App {
  constructor() {
    this.app = express();
    this.setMiddlewares();
    this.setRoutes();
  }

  async connectDB() {
    console.log("Using Supabase - no connection needed");
  }

  async disconnectDB() {
    console.log("Supabase - no disconnection needed");
  }

  setMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  setRoutes() {
    this.app.use("/api/products", productsRouter);
  }

  setupMessageBroker() {
    console.log("Message broker not needed - using direct database");
  }

  start() {
    this.server = this.app.listen(3001, () =>
      console.log("Product Service started on port 3001")
    );
  }

  async stop() {
    this.server.close();
    console.log("Server stopped");
  }
}

module.exports = App;
