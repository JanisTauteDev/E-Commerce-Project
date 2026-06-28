/* Product detail page: gallery, tier selector, add to cart and related items */
(function () {
  NORDHEM.ready.then(() => {
    const { PRODUCTS, UI, Store, formatPrice, findCategory } = NORDHEM;

    const params = new URLSearchParams(location.search);
    const product = NORDHEM.findProduct(params.get("id"));
    const root = document.querySelector("[data-product-root]");

    if (!product) {
      root.innerHTML = `<div class="empty-state">Product not found. <a href="shop.html">Back to shop</a></div>`;
      return;
    }

    let currentTier =
      params.get("tier") &&
      product.variants.some((v) => v.tier === params.get("tier"))
        ? params.get("tier")
        : "standard";
    let qty = 1;

    function render() {
      const variant = NORDHEM.findVariant(product, currentTier);
      const cat = findCategory(product.categoryId);

      root.innerHTML = `
        <nav class="breadcrumbs" aria-label="Breadcrumb">
          <a href="index.html">Home</a><span>/</span>
          <a href="shop.html?category=${cat.id}">${cat.name}</a><span>/</span>
          <span>${product.name}</span>
        </nav>

        <div class="product-detail">
          <section aria-label="Product images">
            <div class="gallery__main" data-gallery-main></div>
          </section>

          <section>
            <span class="tier tier--${variant.tier}">${variant.tier}</span>
            <h1>${product.name}</h1>
            <p style="color:var(--c-muted)">${product.description}</p>
            <p><span class="rating">${product.rating.toFixed(1)} (${product.reviewCount} reviews)</span></p>

            <h3 style="margin-top:var(--s-4)">Choose your tier</h3>
            <div class="tier-selector" role="radiogroup" data-tiers></div>

            <div style="font-size:1.5rem;font-weight:700;margin:var(--s-3) 0">
              ${formatPrice(variant.price)}
            </div>
            <p style="color:${variant.stock > 0 ? "var(--c-success)" : "var(--c-danger)"};font-weight:600">
              ${variant.stock > 0 ? `In stock (${variant.stock})` : "Out of stock"}
            </p>

            <div class="flex" style="gap:var(--s-3);margin:var(--s-4) 0">
              <div class="qty" aria-label="Quantity">
                <button type="button" data-qty-dec aria-label="Decrease">−</button>
                <span data-qty>${qty}</span>
                <button type="button" data-qty-inc aria-label="Increase">+</button>
              </div>
              <button class="btn" data-add ${variant.stock === 0 ? "disabled" : ""}>Add to cart</button>
            </div>

            <div class="specs">
              <h3>Specifications</h3>
              <dl>
                <dt>SKU</dt><dd>${variant.sku}</dd>
                <dt>Material</dt><dd>${product.material || "-"}</dd>
                <dt>Dimensions</dt><dd>${product.dimensions || "-"}</dd>
                <dt>Features</dt><dd>${variant.features.join(", ")}</dd>
              </dl>
            </div>
          </section>
        </div>

        <section class="section">
          <h2>You may also like</h2>
          <div class="product-grid" data-related></div>
        </section>
      `;

      /* product image */
      const main = root.querySelector("[data-gallery-main]");
      main.appendChild(UI.tile(product));

      /* tier choice */
      const tierBox = root.querySelector("[data-tiers]");
      tierBox.innerHTML = product.variants
        .map(
          (v) => `
        <div class="tier-option" role="radio" tabindex="0"
             aria-checked="${v.tier === currentTier}" data-tier="${v.tier}">
          <div class="tier-option__head">
            <span class="tier tier--${v.tier}">${v.tier}</span>
            <span class="tier-option__price">${formatPrice(v.price)}</span>
          </div>
          <ul>${v.features.map((f) => `<li>${f}</li>`).join("")}</ul>
        </div>
      `,
        )
        .join("");

      tierBox.addEventListener("click", (e) => {
        const opt = e.target.closest("[data-tier]");
        if (!opt) return;
        currentTier = opt.dataset.tier;
        qty = 1;
        render();
      });

      /* quantity buttons and add to cart */
      root.querySelector("[data-qty-dec]").addEventListener("click", () => {
        qty = Math.max(1, qty - 1);
        root.querySelector("[data-qty]").textContent = qty;
      });
      root.querySelector("[data-qty-inc]").addEventListener("click", () => {
        qty = Math.min(variant.stock, qty + 1);
        root.querySelector("[data-qty]").textContent = qty;
      });
      root.querySelector("[data-add]").addEventListener("click", () => {
        const res = Store.add(product.id, currentTier, qty);
        if (res.capped) {
          UI.toast(
            `Only ${res.stock} in stock for ${product.name} (${currentTier}) - your cart now holds the maximum.`,
          );
        } else {
          UI.toast(`${product.name} (${currentTier}) × ${res.added} added to cart`);
        }
      });

      /* related products from the same category */
      const related = PRODUCTS.filter(
        (p) => p.categoryId === product.categoryId && p.id !== product.id,
      ).slice(0, 4);
      UI.renderProductGrid(root.querySelector("[data-related]"), related);
    }

    render();
  });
})();
