# NORDHEM - IKEA-style Home & Room Essentials

A small e-commerce store for selling home & room essentials, built as a course project. The chosen course topic is **price differentiation**: every product comes in three tiers - **Basic**, **Standard**, **Premium** - surfaced consistently across the homepage, catalog, product page, cart, and checkout.

The project is implemented as a **dynamic website with a database**: HTML and CSS for structure and design, vanilla JavaScript for the dynamic behaviour, and a MySQL-compatible SQL schema for the data model.

## Tech stack

- HTML, CSS, Vanilla JavaScript
- SQL schema (SQLite-friendly DDL, easily portable to MySQL/PostgreSQL)
- `localStorage` for cart persistence in the static demo

## Running the site

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

## How the project meets the assessment

- **Main Topic – price differentiation**: every product has Basic, Standard, and Premium tiers, shown on the cards, product page, shop filter, cart, and checkout.
- **Content and structure**: 7 linked pages (home, shop, product, cart, checkout, about, contact) with a shared header and footer.
- **Design and usability**: clean, consistent styling, simple navigation, search, filters, and sorting.
- **Responsive**: works on phones and desktops, with a hamburger menu and flexible product grid.
- **Dynamic (JavaScript)**: catalog, cart, and checkout are built from data; forms are validated; the cart is saved in `localStorage`.
- **Database**: a MySQL-compatible SQL schema (`database/schema.sql`) for categories, products, and tiers, with relationships and seed data.

## Topic Integration

The store includes the following topics from the project list:

- **Price Differentiation**: every product comes in three pricing tiers (Basic, Standard, Premium), each with its own price and feature set, shown across the cards, product page, shop filter, cart, and checkout.
- **Recommendation Systems**: the product page shows a "You may also like" row that suggests related products from the same category.
- **Digital Nudging**: the Standard tier is pre-selected as the default option, and each product shows its stock level ("In stock (n)" or "Out of stock") to create a sense of scarcity. Ratings and review counts act as social proof.

## Main features

- 20 products in 3 tiers across 6 categories
- Filter by category and tier, search, and sort
- Product page with gallery, tier choice, and stock info
- Cart with add / update / remove and free shipping over €200
- Validated checkout and contact forms
