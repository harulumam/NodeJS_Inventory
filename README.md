# Inventory API
Inventory API adalah aplikasi RESTful yang dibangun menggunakan Node.js tanpa framework tambahan (seperti Express). Aplikasi ini memungkinkan pengelolaan produk dalam inventory dengan fitur CRUD dasar dan beberapa laporan terkait stok dan transaksi.

## Fitur

- Menambahkan produk baru.
- Memperbarui stok produk.
- Menampilkan daftar produk dengan pagination.
- Menampilkan total nilai inventory.
- Menampilkan riwayat transaksi produk.

## Prasyarat

1. Install Node.js.
2. Install mysql2.

## Menyiapkan Database

1. Jalankan script SQL berikut untuk membuat database dan tabel:
   ```sql
   -- Script SQL ada di dalam file `script-database.sql`


## cara pakai

- git clone <url-repositori>
cd NodeJS_Inventory

- npm install mysql2

- config database

- jalankan aplikasi
node server.js

- buka postman
1. POST /products - untuk menambahkan produk baru

- body:
    {
    "name": "Laptop Lenovo ThinkPad",
    "price": 15000000,
    "stock": 10,
    "category": "IT"
    }

- response: 
    {
        "message": "Product berhasil diinput"
    }

2. Get /products - untuk mendapatkan daftar semua produk dengan opsi filter
- No Body
- Response:
    [
        {
            "productId": 2,
            "name": "Laptop Lenovo ThinkPad",
            "price": 15000000,
            "stock": 10,
            "category": "IT"
        },
        {
            "productId": 3,
            "name": "Mouse Logitech M170",
            "price": 150000,
            "stock": 50,
            "category": "IT"
        },
        {
            "productId": 4,
            "name": "Printer Canon IP2770",
            "price": 900000,
            "stock": 15,
            "category": "IT"
        },
        {
            "productId": 5,
            "name": "Monitor Dell 24 inch",
            "price": 2000000,
            "stock": 8,
            "category": "IT"
        },
        {
            "productId": 6,
            "name": "Keyboard Mechanical Rexus",
            "price": 450000,
            "stock": 30,
            "category": "IT"
        }
    ]

3. GET /reports/inventory - untuk mendapatkan laporan nilai inventory
- No Body
- Response
    {
        "inventory_value": "200500000"
    }

4. GET /reports/inventory - untuk mendapatkan daftar produk dengan stok rendah
- No Body
- Response
    {
        "inventory_value": "185500000"
    }

5. GET /reports/low-stock - untuk mendapatkan laporan nilai inventory
- No Body
- Response
    [
        {
            "productId": 2,
            "name": "Laptop Lenovo ThinkPad",
            "price": 15000000,
            "stock": 9,
            "category": "IT"
        },
        {
            "productId": 5,
            "name": "Monitor Dell 24 inch",
            "price": 2000000,
            "stock": 8,
            "category": "IT"
        }
    ]

6. BODY /transactions - untuk update transaksi
- Body 
    {
        "productId": 2,
        "quantity": 1,
        "type": "Penjualan", / "Pembelian"
        "customerId": 1
    }
- Response
    {
        "message": "Transaction berhasil diinput"
    }
