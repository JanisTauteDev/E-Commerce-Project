/* Shop page: filters, sort and search */
(function () {
  NORDHEM.ready.then(() => {
    const { PRODUCTS, CATEGORIES, TIERS, UI, minPrice } = NORDHEM;

    const params = new URLSearchParams(location.search);
    const state = {
      categories: new Set(
        params.get("category") ? [Number(params.get("category"))] : [],
      ),
      tiers: new Set(),
      q: (params.get("q") || "").toLowerCase(),
      sort: "popular",
    };

    const sorters = {
      popular: (a, b) => b.reviewCount - a.reviewCount,
      rating: (a, b) => b.rating - a.rating,
      priceAsc: (a, b) => minPrice(a) - minPrice(b),
      priceDesc: (a, b) => minPrice(b) - minPrice(a),
      name: (a, b) => a.name.localeCompare(b.name),
    };

    function apply() {
      return PRODUCTS.filter(
        (p) =>
          state.categories.size === 0 || state.categories.has(p.categoryId),
      )
        .filter(
          (p) =>
            state.tiers.size === 0 ||
            p.variants.some((v) => state.tiers.has(v.tier)),
        )
        .filter(
          (p) =>
            !state.q ||
            p.name.toLowerCase().includes(state.q) ||
            p.description.toLowerCase().includes(state.q),
        )
        .sort(sorters[state.sort]);
    }

    /* Build the category and tier filter checkboxes */
    const catBox = document.querySelector("[data-filter-categories]");
    catBox.innerHTML = CATEGORIES.map(
      (c) => `
      <label><input type="checkbox" value="${c.id}" data-cat ${state.categories.has(c.id) ? "checked" : ""}> ${c.name}</label>
    `,
    ).join("");

    const tierBox = document.querySelector("[data-filter-tiers]");
    tierBox.innerHTML = TIERS.map(
      (t) => `
      <label><input type="checkbox" value="${t.id}" data-tier>
        <span class="tier-dot tier-dot--${t.id}"></span> ${t.label}
      </label>
    `,
    ).join("");

    /* Fill the search box if a search came from the URL */
    const searchInput = document.querySelector("[data-shop-search]");
    if (searchInput && state.q) searchInput.value = state.q;

    /* React to user changes and re-render the grid */
    const grid = document.querySelector("[data-shop-grid]");
    const count = document.querySelector("[data-shop-count]");
    const sortSel = document.querySelector("[data-sort]");

    function render() {
      const list = apply();
      count.textContent = `${list.length} product${list.length === 1 ? "" : "s"}`;
      UI.renderProductGrid(grid, list);
    }

    catBox.addEventListener("change", (e) => {
      if (!e.target.matches("[data-cat]")) return;
      const id = Number(e.target.value);
      e.target.checked ? state.categories.add(id) : state.categories.delete(id);
      render();
    });

    tierBox.addEventListener("change", (e) => {
      if (!e.target.matches("[data-tier]")) return;
      const id = e.target.value;
      e.target.checked ? state.tiers.add(id) : state.tiers.delete(id);
      render();
    });

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        state.q = e.target.value.trim().toLowerCase();
        render();
      });
    }

    if (sortSel) {
      sortSel.addEventListener("change", (e) => {
        state.sort = e.target.value;
        render();
      });
    }

    document
      .querySelector("[data-clear-filters]")
      ?.addEventListener("click", () => {
        state.categories.clear();
        state.tiers.clear();
        state.q = "";
        catBox.querySelectorAll("input").forEach((i) => (i.checked = false));
        tierBox.querySelectorAll("input").forEach((i) => (i.checked = false));
        if (searchInput) searchInput.value = "";
        render();
      });

    render();
  });
})();
