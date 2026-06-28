# NORDHEM - IKEA-style Home & Room Essentials

A vanilla HTML / CSS / JavaScript e-commerce demo with a custom SQL schema. The headline feature is **transparent price differentiation**: every product comes in three tiers - **Basic**, **Standard**, **Premium** - surfaced consistently across the homepage, catalog, product page, cart, and checkout.

> See [PROJECT_PLAN.md](PROJECT_PLAN.md) for the full architecture, design system, and feature-to-criteria mapping.

## Tech stack

- HTML5 (semantic), CSS3 (custom properties + Grid/Flexbox, mobile-first)
- Vanilla JavaScript (ES6+), no frameworks
- SQL (SQLite-friendly DDL, easily portable to MySQL/PostgreSQL)
- `localStorage` for cart persistence in the static demo

## Running the site

The site is static - no build step.

**Option A - VS Code Live Server**

1. Install the *Live Server* extension.
2. Right-click `index.html` → **Open with Live Server**.

**Option B - any local HTTP server**

```powershell
# from the project root
python -m http.server 5500
# then open http://localhost:5500
```

You can also double-click `index.html` and it will run.

## Loading the SQL schema

```powershell
sqlite3 nordhem.db ".read database/schema.sql"
```

See [database/README.md](database/README.md) for the ER overview and design notes.

## Project structure

```
.
├── index.html              # Home - hero + tier showcase
├── shop.html               # Catalog with filters / sort / search
├── product.html            # Detail (?id=…&tier=…)
├── cart.html               # Cart management
├── checkout.html           # Validated checkout
├── about.html              # About / FAQ
├── contact.html            # Contact form
├── assets/
│   ├── css/styles.css
│   └── js/{data,store,ui,home,shop,product,cart,checkout}.js
├── database/
│   ├── schema.sql          # Tables + seed data
│   └── README.md
├── PROJECT_PLAN.md         # Full architecture & rubric mapping
└── README.md
```

## Implemented features

- **Product catalog**: 20 products × 3 tiers across 6 room categories
- **Price differentiation everywhere**: tier badges, per-tier prices on cards, tier selector on detail page, tier filter on shop, tier shown in cart and order summary
- **Filters & sort**: by category, by tier (multi-select), full-text search, sort by popularity / rating / price / name
- **Product detail**: gallery with thumbnails, tier radio cards, quantity stepper, stock status, spec table, related items
- **Cart**: add / update qty / remove / clear, persisted in `localStorage`, free shipping over €200
- **Checkout**: client-side form validation (name, email, address, postal code, card) with inline error messages and success state
- **Contact form** with the same validator
- **Responsive**: mobile-first, hamburger nav, fluid product grid (`auto-fill minmax`), sticky order summary on desktop
- **Accessible**: semantic landmarks, ARIA on radiogroup / breadcrumbs / buttons, visible focus
- **Custom SQL schema**: 8 tables in 3NF with FK constraints, indexes, and seed data

## Feature → rubric mapping

| Criterion | Where it lives |
|---|---|
| 1.1 Product presentation | [assets/js/ui.js](assets/js/ui.js), [product.html](product.html) |
| 1.2 Price differentiation | [database/schema.sql](database/schema.sql) (`product_variants`), tier UI in [assets/css/styles.css](assets/css/styles.css), filter logic in [assets/js/shop.js](assets/js/shop.js), selector in [assets/js/product.js](assets/js/product.js) |
| 1.3 Page structure & nav | All `*.html` files share header/footer, [product.html](product.html) has breadcrumbs |
| 2.1 Visual design | CSS variables in [assets/css/styles.css](assets/css/styles.css) |
| 2.2 Usability | Filters, sort, search, hover/focus states |
| 2.3 Responsive | Media queries at the bottom of [assets/css/styles.css](assets/css/styles.css) |
| 3.1 HTML/CSS quality | Semantic tags, BEM-ish classes, external stylesheet |
| 3.2 Error-free | Defensive guards in JS modules |
| 4.1 Dynamic JS | [assets/js/store.js](assets/js/store.js), [assets/js/shop.js](assets/js/shop.js), [assets/js/product.js](assets/js/product.js), [assets/js/checkout.js](assets/js/checkout.js) |
| 5.1 DB design | [database/schema.sql](database/schema.sql) |
| 5.2 DB integration | `data.js` mirrors the schema 1:1 - drop-in for a real backend (PHP / Node) |

## Notes

This is a static educational demo: the cart lives in `localStorage` and the order is not persisted to a server. To wire it up to the SQL schema, replace `data.js` with a `fetch('/api/products')` call and POST the cart contents to `/api/orders` - the JS data shape already matches the SQL columns.
