# NORDHEM - Project Plan & Architecture

IKEA-inspired home & room essentials e-commerce webstore with transparent **price differentiation** (Basic / Standard / Premium) integrated end-to-end.

---

## 1. Project Plan & Milestones

| Phase | Deliverables | Scoring focus |
|------|--------------|---------------|
| **P1 - Foundations** | Folder structure, design system (CSS vars), placeholder assets, SQL schema | 3.1, 5.1 |
| **P2 - Catalog & Tiers** | `data.js` sample dataset (20 products × 3 tiers), product cards, tier badges | 1.1, 1.2 |
| **P3 - Pages** | Home, Shop, Product detail, Cart, Checkout, About, Contact | 1.3 |
| **P4 - Dynamic JS** | Cart (localStorage), filtering, sorting, search, image gallery, form validation | 4.1 |
| **P5 - Responsive polish** | Breakpoints (375 / 768 / 1024 / 1920), mobile nav, touch targets | 2.3 |
| **P6 - QA** | Cross-browser, console-clean, link check, README | 3.2 |

---

## 2. File / Folder Architecture

```
E-Commerce-Project/
├── index.html              # Home
├── shop.html               # Catalog + filters
├── product.html            # Detail page (?id=)
├── cart.html               # Cart + checkout entry
├── checkout.html           # Validated checkout
├── about.html              # FAQ / company
├── contact.html            # Contact form
├── assets/
│   ├── css/
│   │   └── styles.css      # Design system + components + responsive
│   ├── js/
│   │   ├── data.js         # Products, categories, tiers (mirrors SQL)
│   │   ├── store.js        # Cart state + localStorage
│   │   ├── ui.js           # Header, nav, search, helpers
│   │   ├── home.js
│   │   ├── shop.js         # Filter / sort / search
│   │   ├── product.js      # Detail + gallery + tier switcher
│   │   ├── cart.js
│   │   └── checkout.js     # Form validation
│   └── images/             # SVG placeholders
├── database/
│   ├── schema.sql          # DDL + seed data
│   └── README.md           # ER explanation
├── README.md
└── PROJECT_PLAN.md
```

---

## 3. Design System

**Palette** (IKEA-influenced but original):

| Token | Value | Role |
|-------|-------|------|
| `--c-primary` | `#0058A3` | Brand blue (CTA, links) |
| `--c-accent`  | `#FFDB00` | Highlight (sale, banners) |
| `--c-ink`     | `#111418` | Body text |
| `--c-muted`   | `#5B6470` | Secondary text |
| `--c-line`    | `#E4E6EA` | Borders |
| `--c-bg`      | `#FFFFFF` | Surface |
| `--c-bg-alt`  | `#F5F6F8` | Section background |
| `--tier-basic` | `#6B7280` | Tier badges |
| `--tier-standard` | `#0058A3` | |
| `--tier-premium` | `#9A6B00` | |

**Type**: System UI stack (Inter / Segoe UI / -apple-system) + headings in same family at higher weight (avoids web-font cost).

**Spacing scale**: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64` via CSS vars `--s-1 … --s-8`.

**Components**: button (primary/ghost), card, badge, input, modal, tag.

---

## 4. Responsive Breakpoints (mobile-first)

| Range | Layout |
|-------|--------|
| `< 768px` | Single column, hamburger nav, sticky bottom CTA on product page |
| `≥ 768px` | 2-col product grid, inline nav |
| `≥ 1024px` | 3-col product grid, filter sidebar |
| `≥ 1440px` | 4-col product grid, max content width `1280px` centered |

---

## 5. Price-Differentiation Strategy (the headline feature)

Every product has **three SKUs** sharing one identity (name, category, base description) but differing in materials/features/price:

- **Basic** - entry essentials, plain finish, smallest size.
- **Standard** - recommended, marked *Best Value*.
- **Premium** - solid wood / fabric upgrade / extended warranty.

Integrated at:

1. **Homepage hero** - three-card "Choose your tier" showcase.
2. **Product card** - tier strip "From €X · €Y · €Z" with colored dots.
3. **Shop filter** - multi-select tier checkboxes (Basic / Standard / Premium).
4. **Product detail** - tier selector (radio cards) updating price, specs, gallery.
5. **Cart** - each line item shows the chosen tier badge + price.
6. **Tier landing rows** on home (`Budget Picks`, `Best Value`, `Premium Selection`).

---

## 6. SQL Schema (overview)

See [database/schema.sql](database/schema.sql). Tables: `categories`, `products`, `product_variants` (the tier table - one row per (product, tier)), `users`, `orders`, `order_items`, `reviews`, `cart_items`. 3NF; FKs with `ON DELETE` rules; indexes on `products.category_id`, `product_variants.tier`, `reviews.product_id`.

The `product_variants` table is the structural expression of price differentiation: one product → three tier rows, each with its own price, stock, SKU.

---

## 7. JavaScript Architecture

- **Module pattern** via separate `<script>` files loaded per page; shared state in `store.js` using a tiny pub/sub.
- **No globals** beyond `window.NORDHEM` namespace.
- **Data layer**: `data.js` exports `PRODUCTS`, `CATEGORIES`. In a server build, replace with `fetch('/api/products')`; shape matches SQL.
- **Cart**: `{ id, tier, qty }[]` persisted to `localStorage.nordhem.cart`.
- **Filtering** is pure: `applyFilters(products, state)` returns an array; the renderer is decoupled.
- **Form validation**: native HTML constraints + custom JS for inline error messages.

---

## 8. Feature → Criteria Map

| Requirement | Where it's met |
|---|---|
| 1.1 Product cards & detail pages | `shop.html`, `product.html`, `shop.js`, `product.js` |
| 1.2 Price differentiation | `product_variants` table, tier badges in `styles.css`, tier filter in `shop.js`, tier selector in `product.js`, tier hero on `index.html` |
| 1.3 Page structure & nav | All pages share header/footer pattern, breadcrumbs on detail page |
| 2.1 Visual design | CSS variables, type scale, consistent card/button components |
| 2.2 Usability | Search, filters, sort, hover states, ARIA labels, focus rings |
| 2.3 Responsive | Mobile-first media queries, CSS Grid `auto-fit minmax`, hamburger nav |
| 3.1 HTML/CSS quality | Semantic HTML5, external CSS, BEM-ish classes, no inline styles |
| 3.2 Error-free | Defensive JS guards, no console errors, all links relative |
| 4.1 Dynamic JS | Cart, filter/sort, image gallery, mobile nav toggle, validation |
| 5.1 DB design | Normalized schema with FK constraints |
| 5.2 DB integration | `data.js` mirrors schema 1:1 - drop-in for a PHP/Node API |

---

## 9. Implementation Example - Tier Filtering

The reference implementation lives in [assets/js/shop.js](assets/js/shop.js). Pseudocode:

```js
const state = { categories: new Set(), tiers: new Set(), q: '', sort: 'popular' };

function applyFilters(products) {
  return products
    .filter(p => state.categories.size === 0 || state.categories.has(p.categoryId))
    .filter(p => {
      if (state.tiers.size === 0) return true;
      return p.variants.some(v => state.tiers.has(v.tier));
    })
    .filter(p => !state.q || p.name.toLowerCase().includes(state.q))
    .sort(sorters[state.sort]);
}
```

The DOM listens to checkbox / select / input events, rebuilds the grid, and updates a result count - no page reload.
