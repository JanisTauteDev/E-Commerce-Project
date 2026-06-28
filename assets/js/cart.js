/* Cart page */
(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const { Store, UI, formatPrice } = NORDHEM;

    const list = document.querySelector("[data-cart-list]");
    const summary = document.querySelector("[data-cart-summary]");
    if (!list) return;

    function render() {
      const items = Store.detailed();
      if (!items.length) {
        list.innerHTML = `<div class="empty-state">
          Your cart is empty. <a href="shop.html">Continue shopping</a>.
        </div>`;
        summary.innerHTML = "";
        return;
      }

      list.innerHTML = "";
      items.forEach(({ product, variant, qty }) => {
        const row = document.createElement("div");
        row.className = "cart-line";

        const media = document.createElement("div");
        media.className = "cart-line__media";
        media.appendChild(UI.tile(product, ""));

        const info = document.createElement("div");
        info.innerHTML = `
          <div style="display:flex;gap:var(--s-2);align-items:center;flex-wrap:wrap">
            <a href="product.html?id=${product.id}&tier=${variant.tier}" style="font-weight:600;color:var(--c-ink)">${product.name}</a>
            <span class="tier tier--${variant.tier}">${variant.tier}</span>
          </div>
          <div style="color:var(--c-muted);font-size:.9rem;margin-top:4px">${variant.sku} · ${formatPrice(variant.price)} each</div>
          <div class="flex" style="margin-top:var(--s-2);gap:var(--s-3)">
            <div class="qty">
              <button type="button" data-dec aria-label="Decrease">−</button>
              <span>${qty}</span>
              <button type="button" data-inc aria-label="Increase">+</button>
            </div>
            <button class="btn btn--sm btn--ghost" data-remove>Remove</button>
          </div>`;

        const price = document.createElement("div");
        price.style.fontWeight = "700";
        price.textContent = formatPrice(variant.price * qty);

        row.append(media, info, price);
        list.appendChild(row);

        info.querySelector("[data-inc]").addEventListener("click", () => {
          Store.setQty(product.id, variant.tier, qty + 1);
        });
        info.querySelector("[data-dec]").addEventListener("click", () => {
          if (qty <= 1) Store.remove(product.id, variant.tier);
          else Store.setQty(product.id, variant.tier, qty - 1);
        });
        info.querySelector("[data-remove]").addEventListener("click", () => {
          Store.remove(product.id, variant.tier);
        });
      });

      const subtotal = Store.total();
      const shipping = subtotal > 0 ? (subtotal >= 200 ? 0 : 9.99) : 0;
      const total = subtotal + shipping;

      summary.innerHTML = `
        <div class="summary">
          <h3 style="margin:0 0 var(--s-3)">Order summary</h3>
          <div class="summary__row"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
          <div class="summary__row"><span>Shipping</span><span>${shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
          <div class="summary__row summary__total"><span>Total</span><span>${formatPrice(total)}</span></div>
          <a class="btn btn--block" href="checkout.html" style="margin-top:var(--s-3)">Checkout</a>
          <button class="btn btn--ghost btn--block" data-clear style="margin-top:var(--s-2)">Clear cart</button>
        </div>`;

      summary.querySelector("[data-clear]").addEventListener("click", () => {
        if (confirm("Clear your cart?")) Store.clear();
      });
    }

    render();
    Store.onChange(render);
  });
})();
