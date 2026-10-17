(() => {
  if (document.body.dataset.milkStage !== 'accepted') return;
  const notify = message => {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2600);
  };
  const menus = [...document.querySelectorAll('.conclusion-menu')];
  const inspectionMenus = [...document.querySelectorAll('.inspection-menu')];
  menus.forEach(menu => menu.addEventListener('toggle', () => {
    if (menu.open) menus.filter(other => other !== menu).forEach(other => other.open = false);
  }));
  inspectionMenus.forEach(menu => menu.addEventListener('toggle', () => {
    if (menu.open) inspectionMenus.filter(other => other !== menu).forEach(other => other.open = false);
  }));
  document.addEventListener('click', event => {
    menus.forEach(menu => { if (!menu.contains(event.target)) menu.open = false; });
    inspectionMenus.forEach(menu => { if (!menu.contains(event.target)) menu.open = false; });
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      menus.forEach(menu => menu.open = false);
      inspectionMenus.forEach(menu => menu.open = false);
    }
  });

  document.querySelectorAll('.inspection-view').forEach(button => button.addEventListener('click', event => {
    event.preventDefault();
    const card = button.closest('.accepted-row');
    button.closest('.inspection-menu').open = false;
    const item = card?.querySelector('.inspection-item');
    if (item) {
      item.closest('details')?.setAttribute('open', '');
      item.click();
    } else {
      notify('Повторные ветосмотры пока не добавлены');
    }
  }));

  const printImage = document.getElementById('print-image');
  let printing = false;
  document.querySelectorAll('.conclusion-print').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    link.closest('.conclusion-menu').open = false;
    if (printing) return;
    printing = true;
    link.setAttribute('aria-busy', 'true');
    const finish = () => { printing = false; link.removeAttribute('aria-busy'); };
    const openPrint = () => {
      finish();
      printImage.onload = null;
      printImage.onerror = null;
      window.print();
    };
    printImage.onload = openPrint;
    printImage.onerror = () => { finish(); printImage.onload = null; printImage.onerror = null; notify('Не удалось загрузить заключение для печати'); };
    printImage.src = link.dataset.conclusionFile;
    if (printImage.complete && printImage.naturalWidth) openPrint();
  }));
  document.querySelectorAll('.conclusion-download').forEach(link => link.addEventListener('click', () => {
    link.closest('.conclusion-menu').open = false;
    notify('Скачивание заключения начато');
  }));

  const dialog = document.getElementById('milk-max');
  const phone = document.getElementById('max-phone');
  const submit = document.getElementById('max-submit');
  const result = document.getElementById('max-result');
  let maxTrigger, documentName;
  const validPhone = () => /^[78]\d{10}$/.test(phone.value.replace(/\D/g, ''));
  document.querySelectorAll('.conclusion-max').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    maxTrigger = link;
    link.closest('.conclusion-menu').open = false;
    const data = link.closest('.accepted-row').dataset;
    documentName = `Заключение № ${data.vseNumber} · ${data.product}`;
    document.getElementById('max-document-name').textContent = documentName;
    document.getElementById('max-conclusion-file').href = link.dataset.conclusionFile;
    document.getElementById('max-recipient').textContent = 'Владелец: ' + data.owner;
    phone.value = '';
    submit.disabled = true;
    result.textContent = '';
    result.classList.remove('visible');
    dialog.showModal();
    phone.focus();
  }));
  phone.addEventListener('input', () => {
    submit.disabled = !validPhone();
    result.classList.remove('visible');
  });
  document.getElementById('max-form').addEventListener('submit', event => {
    event.preventDefault();
    if (!validPhone() || submit.disabled) return;
    result.textContent = `Демонстрационная отправка: ${documentName}, телефон ${phone.value.trim()}`;
    result.classList.add('visible');
    submit.disabled = true;
  });
  dialog.querySelectorAll('[data-close-max]').forEach(button => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => maxTrigger?.closest('.conclusion-menu').querySelector('summary').focus());

  let inspections = [];
  try {
    const stored = JSON.parse(localStorage.getItem('vse-milk-repeat-inspections') || '[]');
    if (Array.isArray(stored)) inspections = stored.filter(item => item && ['party','date','decision','author','remaining'].every(key => typeof item[key] === 'string'));
  } catch { /* No saved inspections in this mockup session. */ }
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const displayDate = value => value ? `${value.slice(8,10)}.${value.slice(5,7)}.${value.slice(0,4)} ${value.slice(11,16)}` : '—';
  const inspectionDialog = document.getElementById('milk-inspection-summary');
  let inspectionTrigger;
  document.querySelectorAll('.accepted-row').forEach(card => {
    const items = inspections.filter(item => String(item.party) === card.dataset.vseNumber);
    if (!items.length) return;
    const line = document.createElement('div');
    line.className = 'inspection-line has-history';
    line.innerHTML = `<details><summary><span>Повторные ветосмотры (${items.length})</span><svg class="caret" viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg></summary><div class="inspection-list"></div></details>`;
    items.forEach(item => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'inspection-item';
      button.setAttribute('aria-label', 'Открыть повторный ветосмотр от ' + displayDate(item.date));
      button.innerHTML = `<span>${escape(displayDate(item.date))}</span><strong>${escape(item.decision)}</strong><span>${escape(item.author)} · остаток ${escape(item.remaining)} ${escape(item.unit)}</span><em>${escape(item.cost)} ₽</em>`;
      button.addEventListener('click', () => {
        inspectionTrigger = button;
        const fields = [['Дата осмотра', displayDate(item.date)], ['Хозяйство', card.dataset.owner], ['Продукция', card.dataset.product], ['Номер ВСД', card.dataset.number], ['Специалист', item.author], ['Остаток партии', `${item.remaining} ${item.unit}`], ['Результат осмотра', item.decision], ['Стоимость', item.cost + ' ₽']];
        if (item.comment) fields.push(['Комментарий', item.comment]);
        if (item.address) fields.push(['Адрес предприятия', item.address]);
        if (item.storage) fields.push(['Условия хранения', item.storage]);
        (Array.isArray(item.tests) ? item.tests : []).forEach(test => fields.push([test.name, test.value]));
        document.getElementById('milk-inspection-fields').innerHTML = fields.map(([label,value]) => `<div><dt>${escape(label)}</dt><dd>${escape(value)}</dd></div>`).join('');
        inspectionDialog.showModal();
      });
      line.querySelector('.inspection-list').append(button);
    });
    card.querySelector('.accepted-actions-cell').append(line);
  });
  inspectionDialog.querySelectorAll('[data-close-inspection]').forEach(button => button.addEventListener('click', () => inspectionDialog.close()));
  inspectionDialog.addEventListener('click', event => { if (event.target === inspectionDialog) inspectionDialog.close(); });
  inspectionDialog.addEventListener('close', () => inspectionTrigger?.focus());
})();
