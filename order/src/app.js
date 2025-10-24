const express = require("express");
const supabase = require("./config/supabase");
require('dotenv').config();

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
    this.app.get("/api/orders", async (req, res) => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
      }
    });

    this.app.get("/api/orders/:id", async (req, res) => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', req.params.id)
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          return res.status(404).json({ message: "Order not found" });
        }
        res.json(data);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
      }
    });
  }

  setupOrderConsumer() {
    console.log("Order service using direct database - no message broker needed");
  }

  start() {
    const port = process.env.PORT || 3002;
    this.server = this.app.listen(port, () =>
      console.log(`Order Service started on port ${port}`)
    );
  }

  async stop() {
    this.server.close();
    console.log("Server stopped");
  }
}

module.exports = App;
