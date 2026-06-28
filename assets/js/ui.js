/* Shared UI: header, cart badge, mobile nav, search, toast and product cards */
(function () {
  const { Store, formatPrice, minPrice, maxPrice, findCategory } = NORDHEM;

  /* Set up the header: menu, search and cart badge */
  function initHeader() {
    const burger = document.querySelector("[data-hamburger]");
    const nav = document.querySelector("[data-mobile-nav]");
    if (burger && nav) {
      burger.addEventListener("click", () => {
        const open = nav.classList.toggle("open");
        burger.setAttribute("aria-expanded", String(open));
      });
    }

    const search = document.querySelector("[data-header-search]");
    if (search) {
      search.addEventListener("submit", (e) => {
        e.preventDefault();
        const q = search.querySelector("input").value.trim();
        const url = "shop.html" + (q ? `?q=${encodeURIComponent(q)}` : "");
        window.location.href = url;
      });
    }

    updateCartBadge();
    Store.onChange(updateCartBadge);
  }

  function updateCartBadge() {
    const el = document.querySelector("[data-cart-badge]");
    if (!el) return;
    const n = Store.count();
    el.textContent = n;
    el.style.display = n > 0 ? "" : "none";
  }

  /* Small popup message shown briefly */
  let toastTimer;
  function toast(msg) {
    let el = document.querySelector(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2000);
  }

  /* Build a product image tile.
   * eager=true  → load immediately (above-the-fold cards)
   * eager=false → native lazy-load (default for off-screen cards)
   */
  function tile(product, eager) {
    const div = document.createElement('div');
    div.className = 'tile';

    const img = document.createElement('img');
    img.src      = product.photo || '';
    img.alt      = product.name;
    img.className = 'tile__img';
    img.loading  = eager ? 'eager' : 'lazy';
    img.decoding = eager ? 'sync'  : 'async';
    if (eager) img.setAttribute('fetchpriority', 'high');

    /* Fallback to gradient if photo fails to load */
    img.onerror = () => {
      const [a, b] = product.tileColors || ['#e8edf3', '#cfd8e3'];
      div.style.background = `linear-gradient(135deg, ${a}, ${b})`;
      img.remove();
    };
    div.appendChild(img);
    return div;
  }

  /* Build a product card for the grids.
   * eager=true loads the image immediately (no lazy loading).
   */
  function productCard(product, eager) {
    const cat = findCategory(product.categoryId);
    const lo = minPrice(product);
    const hi = maxPrice(product);

    const card = document.createElement("article");
    card.className = "product-card";

    const media = document.createElement("a");
    media.href = `product.html?id=${product.id}`;
    media.className = "product-card__media";
    media.setAttribute("aria-label", product.name);
    media.appendChild(tile(product, eager));
    card.appendChild(media);

    const body = document.createElement("div");
    body.className = "product-card__body";
    body.innerHTML = `
      <span class="product-card__cat">${cat?.name ?? ""}</span>
      <a class="product-card__name" href="product.html?id=${product.id}">${product.name}</a>
      <span class="rating">${product.rating.toFixed(1)} <span style="color:var(--c-muted)">(${product.reviewCount})</span></span>
      <div class="product-card__tiers">
        <span><i class="tier-dot tier-dot--basic"></i> Basic</span>
        <span><i class="tier-dot tier-dot--standard"></i> Standard</span>
        <span><i class="tier-dot tier-dot--premium"></i> Premium</span>
      </div>
      <div class="product-card__price">
        From ${formatPrice(lo)} <small>- up to ${formatPrice(hi)}</small>
      </div>
      <div class="product-card__actions">
        <a class="btn btn--sm btn--ghost" href="product.html?id=${product.id}">View</a>
        <button class="btn btn--sm" data-quick-add="${product.id}">Add Standard</button>
      </div>`;
    card.appendChild(body);

    body.querySelector("[data-quick-add]").addEventListener("click", () => {
      const res = Store.add(product.id, "standard", 1);
      if (res.capped) {
        toast(`Only ${res.stock} in stock for ${product.name} (Standard) — maximum reached.`);
      } else {
        toast(`${product.name} (Standard) added to cart`);
      }
    });

    return card;
  }

  function renderProductGrid(container, products) {
    container.innerHTML = "";
    if (!products.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = "No products match your filters.";
      container.appendChild(empty);
      return;
    }
    const frag = document.createDocumentFragment();
    products.forEach((p, i) => frag.appendChild(productCard(p, i < 4)));
    container.appendChild(frag);
  }

  /* Show the current year in the footer */
  function initFooter() {
    const y = document.querySelector("[data-year]");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  NORDHEM.UI = {
    initHeader,
    initFooter,
    tile,
    productCard,
    renderProductGrid,
    toast,
  };

  document.addEventListener("DOMContentLoaded", () => {
    initHeader();
    initFooter();
  });
})();
