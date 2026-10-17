(() => {
  const storageKey = 'vse-product-type';
  const products = {
    meat: {
      label: 'Мясо и продукты убоя',
      shortLabel: 'Мясо'
    },
    milk: {
      label: 'Молоко и молочная продукция',
      shortLabel: 'Молоко'
    }
  };

  const routes = [
    { meat: 'journal.html', milk: 'journal-milk.html' },
    { meat: 'arrivals.html', milk: 'arrivals-milk.html' },
    { meat: 'arrivals-work.html', milk: 'arrivals-work-milk.html' },
    { meat: 'arrivals-accepted.html', milk: 'arrivals-accepted-milk.html' },
    { meat: 'additional-vet-inspection-create.html', milk: 'additional-vet-inspection-create-milk.html' },
    { meat: 'directory-price-edit.html', milk: 'directory-price-edit-milk.html' },
    { meat: 'directory-repeat-price-edit.html', milk: 'directory-repeat-price-edit-milk.html' },
    { meat: 'directory-norms-edit.html', milk: 'directory-norms-edit-milk.html' }
  ];
  const pageName = location.pathname.split('/').pop() || '';
  const pageRoute = routes.find(route => Object.values(route).includes(pageName)) ||
    (/^directory-norms-edit-milk-[a-z0-9-]+\.html$/.test(pageName)
      ? { meat: 'directory-norms-edit.html', milk: pageName }
      : /^evsd-check-milk-(ak-bars|nur|sadykova|tan)\.html$/.test(pageName)
        ? { meat: 'evsd-check-usmanov.html', milk: pageName }
        : pageName === 'electronic-vse-journal-milk.html'
          ? { meat: 'electronic-vse-journal-biektau.html', milk: pageName }
          : (pageName === 'electronic-vse-journal-biektau.html' || pageName === 'electronic-vse-journal-kazan-bacon.html')
            ? { meat: pageName, milk: 'electronic-vse-journal-milk.html' }
          : null);
  const forcedProduct = pageRoute ? (pageRoute.milk === pageName ? 'milk' : 'meat') : null;
  function readProduct() {
    try { return localStorage.getItem(storageKey); } catch { return null; }
  }
  function saveProduct(product) {
    try { localStorage.setItem(storageKey, product); } catch { /* The page URL still defines the active product. */ }
  }
  let selectedProduct = forcedProduct || readProduct() || 'meat';
  if (!products[selectedProduct]) selectedProduct = 'meat';

  const switcher = document.querySelector('.product-switcher');
  const trigger = document.getElementById('product-switcher');
  const label = document.querySelector('[data-product-label]');
  const options = [...document.querySelectorAll('[data-product-option]')];
  const productIcons = {
    meat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.7 3.3c4.8-.5 8.1 2.5 8.1 6.8 0 5.5-4.4 10.5-9.8 10.5-4.4 0-7.8-2.7-7.8-6.7 0-3.1 1.9-5.7 4.7-7.1 1.7-.9 2.5-3.2 4.8-3.5Z"/><path d="M12.6 7.3c2.7-.4 4.6 1.2 4.6 3.4 0 2.7-2.5 5-5.2 5-2.2 0-3.8-1.4-3.8-3.5 0-1.8 1.7-3.3 4.4-4.9Z"/></svg>',
    milk: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6v3l1.5 2.5V19a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2V8.5L9 6V3Z"/><path d="M9 6h6M7.5 11h9M7.5 16h9"/></svg>'
  };
  if (trigger) {
    if (!trigger.querySelector('.product-icon')) {
      const icon = document.createElement('span');
      icon.className = 'product-icon';
      icon.setAttribute('aria-hidden', 'true');
      trigger.insertBefore(icon, label || trigger.firstChild);
    }
  }
  options.forEach(option => {
    const icon = document.createElement('span');
    icon.className = 'product-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML = productIcons[option.dataset.productOption] || '';
    option.prepend(icon);
  });

  function renderProduct(product) {
    selectedProduct = product;
    const config = products[product];
    document.documentElement.dataset.productType = product;
    if (label && label.textContent !== config.label) label.textContent = config.label;
    const triggerIcon = trigger?.querySelector('.product-icon');
    if (triggerIcon && triggerIcon.dataset.productIcon !== product) {
      triggerIcon.innerHTML = productIcons[product];
      triggerIcon.dataset.productIcon = product;
    }
    if (trigger) {
      trigger.setAttribute('aria-label', `Тип продукции: ${config.label}`);
      trigger.dataset.shortLabel = config.shortLabel;
    }
    options.forEach(option => {
      const active = option.dataset.productOption === product;
      option.classList.toggle('active', active);
      option.setAttribute('aria-selected', String(active));
    });
    document.querySelectorAll('a[href], [data-href]').forEach(link => {
      const attribute = link.hasAttribute('data-href') ? 'data-href' : 'href';
      const target = link.getAttribute(attribute);
      const path = target?.split(/[?#]/)[0];
      const route = routes.find(item => Object.values(item).includes(path));
      if (route) link.setAttribute(attribute, route[product] + target.slice(path.length));
    });
  }

  function setOpen(open, returnFocus = false) {
    if (!switcher || !trigger) return;
    switcher.classList.toggle('open', open);
    trigger.setAttribute('aria-expanded', String(open));
    if (returnFocus) trigger.focus();
  }

  renderProduct(selectedProduct);
  if (forcedProduct) saveProduct(forcedProduct);

  trigger?.addEventListener('click', () => setOpen(!switcher.classList.contains('open')));
  trigger?.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      (options.find(option => option.dataset.productOption === selectedProduct) || options[0])?.focus();
    }
  });

  options.forEach((option, index) => {
    option.addEventListener('click', () => {
      const product = option.dataset.productOption;
      saveProduct(product);
      if (pageRoute && product !== forcedProduct) {
        setOpen(false);
        location.href = pageRoute[product];
        return;
      }
      renderProduct(product);
      setOpen(false, true);
    });
    option.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false, true);
      }
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const direction = event.key === 'ArrowDown' ? 1 : -1;
        options[(index + direction + options.length) % options.length].focus();
      }
    });
  });

  document.addEventListener('click', event => {
    if (switcher && !switcher.contains(event.target)) setOpen(false);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && switcher?.classList.contains('open')) setOpen(false, true);
  });

})();
