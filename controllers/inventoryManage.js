const mysql = require('mysql2/promise');

class InventoryManager {
  constructor(db) {
    this.db = db;
  }

  async addProduct(name, price, stock, category) {
    const query = `INSERT INTO t_master_product (name, price, stock, category) VALUES (?, ?, ?, ?)`;
    await this.db.execute(query, [name, price, stock, category]);
  }

  async createTransaction(productId, quantity, type, customerId) {
    const product = await this.getProductById(productId);
    if (!product) throw new Error('Product tidak ditemukan');

    if (type === 'Penjualan' && product.stock < quantity) {
      throw new Error('Stok tidak mencukupi untuk penjualan ini.');
    }

    const query = `INSERT INTO t_history_transaksi (productId, quantity, type, customerId) VALUES (?, ?, ?, ?)`;
    await this.db.execute(query, [productId, quantity, type, customerId]);
    
    const stockOperation = (type === 'Pembelian') ? 'Tambah' : 'Kurang';
    await this.updateStock(productId, quantity, stockOperation);
  }

  async updateStock(productId, quantity, transactionType) {
    if (transactionType === 'Tambah') {
      const query = `UPDATE t_master_product SET stock = stock + ? WHERE productId = ?`;
      await this.db.execute(query, [quantity, productId]);
    } else if (transactionType === 'Kurang') {
      const query = `UPDATE t_master_product SET stock = stock - ? WHERE productId = ? AND stock >= ?`;
      const [result] = await this.db.execute(query, [quantity, productId, quantity]);
      if (result.affectedRows === 0) {
        throw new Error('Stok tidak mencukupi');
      }
    }
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

  async getProductById(productId) {
    const query = `SELECT * FROM t_master_product WHERE productId = ?`;
    const [rows] = await this.db.execute(query, [productId]);
    return rows[0];
  }

  async getAllProducts() {
    const query = `SELECT * FROM t_master_product`;
    const [rows] = await this.db.execute(query);
    return rows;
  }

  async getProductHistory(productId) {
    const query = `SELECT * FROM t_history_transaksi WHERE productId = ? ORDER BY created_at DESC`;
    const [rows] = await this.db.execute(query, [productId]);
    return rows;
  }

  async getLowStockProducts(threshold = 5) {
    const query = `SELECT * FROM t_master_product WHERE stock < ?`;
    const [rows] = await this.db.execute(query, [threshold]);
    return rows;
  }
}

module.exports = InventoryManager;