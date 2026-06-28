/* Shopping cart, saved in localStorage */
(function () {
  const KEY = "nordhem.cart";
  const listeners = new Set();

  function read() {
    try {
      const raw = localStorage.getItem(KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }
  function write(items) {
    localStorage.setItem(KEY, JSON.stringify(items));
    listeners.forEach((fn) => {
      try {
        fn(items);
      } catch {}
    });
  }

  /* Available stock for a variant; Infinity if the product data isn't loaded */
  function stockOf(productId, tier) {
    const product = NORDHEM.findProduct(productId);
    const variant = product ? NORDHEM.findVariant(product, tier) : null;
    return variant ? variant.stock : Infinity;
  }

  const Store = {
    items: () => read(),

    add(productId, tier, qty = 1) {
      const items = read();
      const idx = items.findIndex(
        (i) => i.productId === productId && i.tier === tier,
      );
      const current = idx >= 0 ? items[idx].qty : 0;
      const stock = stockOf(productId, tier);
      const desired = current + qty;
      const next = Math.min(desired, stock);
      const capped = next < desired;
      if (next > current) {
        if (idx >= 0) items[idx].qty = next;
        else items.push({ productId, tier, qty: next });
        write(items);
      }
      return { ok: !capped, added: next - current, qty: next, stock, capped };
    },

    setQty(productId, tier, qty) {
      const stock = stockOf(productId, tier);
      const clamped = Math.max(1, Math.min(qty, stock));
      const capped = clamped < qty;
      const items = read().map((i) =>
        i.productId === productId && i.tier === tier
          ? { ...i, qty: clamped }
          : i,
      );
      write(items);
      return { ok: !capped, qty: clamped, stock, capped };
    },

    remove(productId, tier) {
      write(
        read().filter((i) => !(i.productId === productId && i.tier === tier)),
      );
    },

    clear() {
      write([]);
    },

    count() {
      return read().reduce((s, i) => s + i.qty, 0);
    },

    detailed() {
      return read()
        .map((i) => {
          const product = NORDHEM.findProduct(i.productId);
          const variant = product ? NORDHEM.findVariant(product, i.tier) : null;
          return { ...i, product, variant };
        })
        .filter((x) => x.product && x.variant);
    },

    total() {
      return Store.detailed().reduce((s, x) => s + x.variant.price * x.qty, 0);
    },

    onChange(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };

  NORDHEM.Store = Store;
})();
