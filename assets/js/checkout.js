/* NORDHEM - checkout & contact form validation. */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const { Store, UI, formatPrice } = NORDHEM;

    /* ---- order summary on checkout ---- */
    const summary = document.querySelector('[data-checkout-summary]');
    if (summary) {
      const items = Store.detailed();
      if (!items.length) {
        summary.innerHTML = `<div class="empty-state">Your cart is empty. <a href="shop.html">Shop now</a>.</div>`;
      } else {
        const subtotal = Store.total();
        const shipping = subtotal >= 200 ? 0 : 9.99;
        summary.innerHTML = `
          <div class="summary">
            <h3 style="margin:0 0 var(--s-3)">Your order</h3>
            ${items.map(({ product, variant, qty }) => `
              <div class="summary__row">
                <span>${product.name} <span class="tier tier--${variant.tier}" style="margin-left:6px">${variant.tier}</span> × ${qty}</span>
                <span>${formatPrice(variant.price * qty)}</span>
              </div>`).join('')}
            <div class="summary__row"><span>Shipping</span><span>${shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
            <div class="summary__row summary__total"><span>Total</span><span>${formatPrice(subtotal + shipping)}</span></div>
          </div>`;
      }
    }

    /* ---- generic validator ---- */
    function validate(form, rules) {
      let ok = true;
      Object.entries(rules).forEach(([name, rule]) => {
        const field = form.elements[name];
        const wrap = field.closest('.field');
        const err = wrap?.querySelector('.field__error');
        const val = (field.value || '').trim();
        let msg = '';
        if (rule.required && !val) msg = 'Required';
        else if (rule.minLength && val.length < rule.minLength) msg = `Min ${rule.minLength} characters`;
        else if (rule.pattern && !rule.pattern.test(val)) msg = rule.message || 'Invalid format';
        if (msg) { ok = false; wrap?.classList.add('field--error'); if (err) err.textContent = msg; }
        else { wrap?.classList.remove('field--error'); if (err) err.textContent = ''; }
      });
      return ok;
    }

    const checkoutForm = document.querySelector('[data-checkout-form]');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!Store.count()) { UI.toast('Your cart is empty'); return; }
        const ok = validate(checkoutForm, {
          name:    { required: true, minLength: 2 },
          email:   { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
          address: { required: true, minLength: 5 },
          city:    { required: true },
          zip:     { required: true, pattern: /^[A-Za-z0-9 -]{3,10}$/, message: 'Invalid postal code' },
          card:    { required: true, pattern: /^[0-9 ]{13,19}$/, message: 'Invalid card number' },
        });
        if (!ok) { UI.toast('Please fix the highlighted fields'); return; }
        Store.clear();
        checkoutForm.style.display = 'none';
        const ok2 = document.querySelector('[data-checkout-success]');
        if (ok2) ok2.hidden = false;
        UI.toast('Order placed!');
      });
    }

    const contactForm = document.querySelector('[data-contact-form]');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const ok = validate(contactForm, {
          name:    { required: true, minLength: 2 },
          email:   { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
          message: { required: true, minLength: 10 },
        });
        if (!ok) return;
        contactForm.reset();
        UI.toast('Thanks - we\'ll get back to you soon');
      });
    }
  });
})();
