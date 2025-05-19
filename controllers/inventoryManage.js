const mysql = require('mysql2/promise');

class InventoryManager {
  constructor(db) {
    this.db = db;
  }

  async addProduct(name, price, stock, category) {
    const query = `INSERT INTO t_master_product (name, price, stock, category) VALUES (?, ?, ?, ?)`;
    await this.db.execute(query, [name, price, stock, category]);
  }

  async updateStock(productId, quantity, transactionType) {
    if (transactionType === 'Tambah') {
      const query = `UPDATE t_master_product SET stock = stock + ? WHERE productId = ?`;
      await this.db.execute(query, [quantity, productId]);
    } else if (transactionType === 'Kurang') {
      const query = `UPDATE t_master_product SET stock = stock - ? WHERE productId = ? AND stock >= ?`;
      const [result] = await this.db.execute(query, [quantity, productId, quantity]);
      if (result.affectedRows === 0) throw new Error('Not enough stock');
    }
  }

  async createTransaction(productId, quantity, type, customerId) {
    const query = `INSERT INTO t_history_transaksi (productId, quantity, type, customerId) VALUES (?, ?, ?, ?)`;
    await this.db.execute(query, [productId, quantity, type, customerId]);
    await this.updateStock(productId, quantity, type === 'Pembelian' ? 'Tambah' : 'Kurang');
  }

  async getProductsByCategory(category) {
    const query = `SELECT * FROM t_master_product WHERE category = ?`;
    const [rows] = await this.db.execute(query, [category]);
    return rows;
  }

  async getInventoryValue() {
    const query = `SELECT SUM(price * stock) AS inventory_value FROM t_master_product`;
    const [rows] = await this.db.execute(query);
    return rows[0].inventory_value;
  }

  async getProductHistory(productId) {
    const query = `SELECT * FROM t_history_transaksi WHERE productId = ?`;
    const [rows] = await this.db.execute(query, [productId]);
    return rows;
  }

  async getAllProducts() {
    const query = `SELECT * FROM t_master_product`;
    const [rows] = await this.db.execute(query);
    return rows;
  }
}

module.exports = InventoryManager;