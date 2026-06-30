/* Product data - sourced at runtime from database/schema.sql (no hardcoded products) */
window.NORDHEM = window.NORDHEM || {};

/* Tier labels (presentation only) */
NORDHEM.TIERS = [
  { id: "basic", label: "Basic", blurb: "Entry-level essentials" },
  { id: "standard", label: "Standard", blurb: "Best value - most popular" },
  { id: "premium", label: "Premium", blurb: "Top-tier materials & finish" },
];

/* Filled in once the database has been read */
NORDHEM.CATEGORIES = [];
NORDHEM.PRODUCTS = [];

/* Helper functions for finding products and formatting prices */
NORDHEM.findProduct = (id) => NORDHEM.PRODUCTS.find((p) => p.id === Number(id));
NORDHEM.findVariant = (product, tier) =>
  product.variants.find((v) => v.tier === tier);
NORDHEM.findCategory = (id) =>
  NORDHEM.CATEGORIES.find((c) => c.id === Number(id));
NORDHEM.minPrice = (p) => Math.min(...p.variants.map((v) => v.price));
NORDHEM.maxPrice = (p) => Math.max(...p.variants.map((v) => v.price));
NORDHEM.formatPrice = (n) => "€" + n.toFixed(2);

/* Color pairs used as a fallback gradient when a product photo fails to load */
const _tiles = [
  ["#e8edf3", "#cfd8e3"],
  ["#f5e9d7", "#e2c89f"],
  ["#dee9df", "#b9d2bd"],
  ["#e6dfee", "#c4b2db"],
  ["#fde7e7", "#f1bdbd"],
  ["#dde7ee", "#b8cad9"],
];

/* Local product photo filenames, keyed by product id */
const _photos = {
  1: "fjord-sofa.webp",
  2: "lagom-coffee-table.webp",
  3: "bjork-bookshelf.webp",
  4: "drom-bed-frame.webp",
  5: "natt-nightstand.webp",
  6: "linne-wardrobe.webp",
  7: "koka-cookware-set.webp",
  8: "bord-dining-table.webp",
  9: "glas-tumbler-set.webp",
  10: "skriva-desk.webp",
  11: "sitta-office-chair.webp",
  12: "ordna-organiser.webp",
  13: "bada-towel-set.webp",
  14: "spegel-mirror.webp",
  15: "tval-soap-dispenser.webp",
  16: "mane-floor-lamp.webp",
  17: "stjarna-pendant.webp",
  18: "ljus-table-lamp.webp",
  19: "mys-armchair.webp",
  20: "kniv-knife-block.webp",
};

/* Parse the rows of a single `INSERT INTO <table> (cols) VALUES (...),(...);` statement */
function _parseInsert(sql, table) {
  const re = new RegExp(
    "INSERT\\s+INTO\\s+" +
      table +
      "\\s*\\(([^)]*)\\)\\s*VALUES\\s*([\\s\\S]*?);",
    "i",
  );
  const m = re.exec(sql);
  if (!m) return [];
  const cols = m[1].split(",").map((s) => s.trim());
  return _parseTuples(m[2]).map((vals) => {
    const row = {};
    cols.forEach((c, i) => {
      row[c] = vals[i];
    });
    return row;
  });
}

/* Split a VALUES body into rows of typed values, respecting single-quoted strings */
function _parseTuples(text) {
  const rows = [];
  let i = 0;
  const n = text.length;
  while (i < n) {
    while (i < n && text[i] !== "(") i++;
    if (i >= n) break;
    i++; // consume '('
    const vals = [];
    let cur = "";
    let quoted = false; // value is a quoted string
    let inStr = false; // currently inside a string
    while (i < n) {
      const ch = text[i];
      if (inStr) {
        if (ch === "'") {
          if (text[i + 1] === "'") {
            cur += "'";
            i += 2;
            continue;
          } // escaped quote
          inStr = false;
          i++;
          continue;
        }
        cur += ch;
        i++;
        continue;
      }
      if (ch === "'") {
        inStr = true;
        quoted = true;
        i++;
        continue;
      }
      if (ch === "," || ch === ")") {
        vals.push(_coerce(cur.trim(), quoted));
        cur = "";
        quoted = false;
        i++;
        if (ch === ")") break;
        continue;
      }
      cur += ch;
      i++;
    }
    rows.push(vals);
  }
  return rows;
}

/* Convert a raw SQL token into a JS value */
function _coerce(raw, quoted) {
  if (quoted) return raw;
  if (/^null$/i.test(raw)) return null;
  if (raw !== "" && !isNaN(Number(raw))) return Number(raw);
  return raw;
}

/* Read schema.sql, build categories + products, and resolve when ready */
async function _loadFromDatabase() {
  const res = await fetch("database/schema.sql");
  if (!res.ok)
    throw new Error(
      "Could not load database/schema.sql (HTTP " + res.status + ")",
    );
  const sql = await res.text();

  const categories = _parseInsert(sql, "categories").map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
  }));

  const variantsByProduct = {};
  _parseInsert(sql, "product_variants").forEach((r) => {
    (variantsByProduct[r.product_id] =
      variantsByProduct[r.product_id] || []).push({
      tier: r.tier,
      sku: r.sku,
      price: r.price,
      stock: r.stock,
      features: r.features ? JSON.parse(r.features) : [],
    });
  });

  const order = { basic: 0, standard: 1, premium: 2 };
  const products = _parseInsert(sql, "products").map((r) => ({
    id: r.id,
    categoryId: r.category_id,
    name: r.name,
    description: r.description,
    material: r.material,
    dimensions: r.dimensions,
    rating: r.rating,
    reviewCount: r.review_count,
    tileColors: _tiles[(r.id - 1) % _tiles.length],
    photo: "assets/images/" + (_photos[r.id] || ""),
    variants: (variantsByProduct[r.id] || []).sort(
      (a, b) => order[a.tier] - order[b.tier],
    ),
  }));

  NORDHEM.CATEGORIES = categories;
  NORDHEM.PRODUCTS = products;
}

/* Resolves after the product data is loaded AND the DOM is ready */
NORDHEM.ready = (async function () {
  try {
    await _loadFromDatabase();
  } catch (err) {
    console.error(
      "[NORDHEM] Failed to load product data from the database.",
      err,
    );
    console.error(
      "[NORDHEM] Serve the site over HTTP (e.g. a local web server) so database/schema.sql can be fetched.",
    );
  }
  if (document.readyState === "loading") {
    await new Promise((r) =>
      document.addEventListener("DOMContentLoaded", r, { once: true }),
    );
  }
})();
