/* NORDHEM - cart store, persisted to localStorage. */
(function () {
  const KEY = 'nordhem.cart';
  const listeners = new Set();

  function read() {
    try {
      const raw = localStorage.getItem(KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch { return []; }
  }
  function write(items) {
    localStorage.setItem(KEY, JSON.stringify(items));
    listeners.forEach(fn => { try { fn(items); } catch {} });
  }

  const Store = {
    items: () => read(),

    add(productId, tier, qty = 1) {
      const items = read();
      const idx = items.findIndex(i => i.productId === productId && i.tier === tier);
      if (idx >= 0) items[idx].qty += qty;
      else items.push({ productId, tier, qty });
      write(items);
    },

    setQty(productId, tier, qty) {
      const items = read().map(i =>
        (i.productId === productId && i.tier === tier) ? { ...i, qty: Math.max(1, qty) } : i
      );
      write(items);
    },

    remove(productId, tier) {
      write(read().filter(i => !(i.productId === productId && i.tier === tier)));
    },

    clear() { write([]); },

    count() { return read().reduce((s, i) => s + i.qty, 0); },

    detailed() {
      return read().map(i => {
        const product = NORDHEM.findProduct(i.productId);
        const variant = product ? NORDHEM.findVariant(product, i.tier) : null;
        return { ...i, product, variant };
      }).filter(x => x.product && x.variant);
    },

    total() {
      return Store.detailed().reduce((s, x) => s + x.variant.price * x.qty, 0);
    },

    onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); },
  };

  NORDHEM.Store = Store;
})();
