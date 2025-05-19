const http = require('http');
const mysql = require('mysql2/promise');
const InventoryManager = require('./controllers/inventoryManage');

(async () => {
  const db = await mysql.createConnection({
    host: 'xxxxxxxx',
    user: 'xxxxxxxx',
    password: 'xxxxxxxxx',
    database: 'inventory_db'
  });
  const inventoryManager = new InventoryManager(db);

  const server = http.createServer(async (req, res) => {
    if (req.method === 'POST' && req.url === '/products') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        const { name, price, stock, category } = JSON.parse(body);
        await inventoryManager.addProduct(name, price, stock, category);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Product berhasil diinput' }));
      });
    }

    if (req.method === 'POST' && req.url === '/products/batch') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const products = JSON.parse(body);

          if (!Array.isArray(products)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Tidak sesuai format.' }));
            return;
          }

          for (const product of products) {
            const { name, price, stock, category } = product;

            if (!name || price == null || stock == null || !category) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'Semua Field harus terisi (name, price, stock, category)' }));
              return;
            }

            await inventoryManager.addProduct(name, price, stock, category);
          }

          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Semua products berhasil diinput' }));
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Server error', error: err.message }));
        }
      });
    }


    if (req.method === 'GET' && req.url === '/products') {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const category = url.searchParams.get('category');
      const products = category ? await inventoryManager.getProductsByCategory(category) : await inventoryManager.getAllProducts();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(products));
    }

    if (req.method === 'POST' && req.url === '/transactions') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        const { productId, quantity, type, customerId } = JSON.parse(body);
        await inventoryManager.createTransaction(productId, quantity, type, customerId);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Transaction berhasil diinput' }));
      });
    }

    if (req.method === 'GET' && req.url === '/reports/inventory') {
      const inventoryValue = await inventoryManager.getInventoryValue();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ inventory_value: inventoryValue }));
    }
  });

  server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
})();
