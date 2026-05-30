# Database - NORDHEM

Schema in [schema.sql](schema.sql). Compatible with SQLite (used for the demo) and easily portable to MySQL / PostgreSQL.

## ER overview

```
categories 1 ── n products 1 ── n product_variants 1 ── n order_items
                                                  └── n cart_items
users      1 ── n orders 1 ── n order_items
users      1 ── n reviews n ── 1 products
users      1 ── n cart_items
```

## Why `product_variants`?

The headline feature of the site is **price differentiation**. Storing three prices as columns on `products` (`price_basic`, `price_standard`, `price_premium`) violates 1NF - each tier also has its own stock, SKU, and feature set. Lifting tiers into their own table keeps the schema in 3NF and lets us:

- query by tier (`WHERE tier = 'premium'`),
- track stock per SKU,
- attach `order_items` / `cart_items` to the exact variant the customer bought.

## Loading the demo data

SQLite:

```bash
sqlite3 nordhem.db < schema.sql
```

MySQL: remove the `PRAGMA` line and replace `TEXT DEFAULT CURRENT_TIMESTAMP` with `DATETIME DEFAULT CURRENT_TIMESTAMP`.
