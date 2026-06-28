/* Homepage: hero tier showcase and featured products */
(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const { PRODUCTS, UI, formatPrice } = NORDHEM;

    /* Hero: show the three tiers of one product */
    const hero = document.querySelector("[data-hero-tiers]");
    if (hero) {
      const featured = NORDHEM.findProduct(1); // Fjord Sofa
      hero.innerHTML = featured.variants
        .map(
          (v) => `
        <div class="tier-card">
          <span class="tier tier--${v.tier}">${v.tier}</span>
          <h3 style="margin:0">${featured.name}</h3>
          <ul style="margin:0;padding-left:1.1rem;color:var(--c-muted);font-size:.9rem">
            ${v.features.map((f) => `<li>${f}</li>`).join("")}
          </ul>
          <div class="tier-card__price">${formatPrice(v.price)} <small>${v.tier} tier</small></div>
          <a class="btn btn--sm" href="product.html?id=${featured.id}&tier=${v.tier}">Choose ${v.tier}</a>
        </div>`,
        )
        .join("");
    }

    /* Show the eight highest-rated products */
    const featuredGrid = document.querySelector("[data-featured]");
    if (featuredGrid) {
      const top = [...PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, 8);
      UI.renderProductGrid(featuredGrid, top);
    }

    /* Links to each category */
    const catGrid = document.querySelector("[data-categories]");
    if (catGrid) {
      catGrid.innerHTML = NORDHEM.CATEGORIES.map(
        (c) => `
        <a class="tier-card" href="shop.html?category=${c.id}" style="text-align:center">
          <h3 style="margin:0">${c.name}</h3>
          <p style="margin:0;color:var(--c-muted);font-size:.9rem">Shop ${c.name.toLowerCase()}</p>
        </a>`,
      ).join("");
    }
  });
})();
