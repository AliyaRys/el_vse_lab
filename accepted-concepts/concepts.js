(() => {
  'use strict';
  const records = window.AcceptedRecords;
  const params = new URLSearchParams(location.search);
  const e = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icon = name => {
    const paths = {
      arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
      chevron: '<path d="m6 9 6 6 6-6"/>',
      eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="2.5"/>',
      search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
      close: '<path d="m6 6 12 12M6 18 18 6"/>',
      more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>'
    };
    return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name]}</svg>`;
  };
  const from = () => {
    const file = location.pathname.split('/').pop() || 'index.html';
    return `${file}${location.search}`;
  };
  const recordUrl = r => `vse-card.html?id=${e(r.id)}&from=${encodeURIComponent(from())}`;
  const badge = r => `<span class="badge badge-result ${e(r.tone)}">${e(r.result)}</span>`;
  const fact = (name, value, full = false) => `<div${full ? ' class="full"' : ''}><dt>${e(name)}</dt><dd>${e(value)}</dd></div>`;
  const facts = r => `<dl class="mini-facts">${fact('Вес партии', r.amount)}${fact('Срок реализации', r.expiry)}</dl>`;
  const checkText = r => `<strong>${e(r.check)}</strong>${e(r.checker)}<br>${e(r.checkDate)}`;
  const openLink = (r, classes = 'btn btn-primary', text = 'Открыть ВСЭ') => `<a class="${classes}" href="${recordUrl(r)}" aria-label="Открыть карточку ВСЭ №${e(r.id)} — ${e(r.owner)}">${text}${icon('arrow')}</a>`;
  const modalButton = (r, view, text, classes = 'btn btn-link') => `<button type="button" class="${classes}" data-bs-toggle="modal" data-bs-target="#recordModal" data-record="${e(r.id)}" data-view="${view}">${text}</button>`;
  const dropdown = r => `<div class="dropdown"><button class="btn btn-neutral" type="button" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Другие сведения о партии ${e(r.owner)}">${icon('more')}</button><ul class="dropdown-menu dropdown-menu-end"><li>${modalButton(r, 'check', 'Сверка данных', 'dropdown-item')}</li><li>${modalButton(r, 'history', `Повторные ветосмотры (${r.history.length})`, 'dropdown-item')}</li></ul></div>`;
  const passport = (r, withAction = true) => `<section class="vse-passport" aria-label="Все сведения о ВСЭ №${e(r.id)}"><div class="passport-top"><a class="vse-heading" href="${recordUrl(r)}">ВСЭ №${e(r.id)}</a>${badge(r)}</div><div class="vse-date">${e(r.vseDate)}<span class="vse-cost">Стоимость: ${e(r.cost)}</span></div><div><div class="vse-author">${e(r.doctor)}</div><div class="vse-lab">${e(r.lab)}</div></div><div class="vse-origin">${e(r.origin)}</div>${withAction ? `<div class="passport-actions">${openLink(r)}${modalButton(r, 'history', `Ветосмотры: ${r.history.length}`)}</div>` : ''}</section>`;
  const renderPassport = r => `<article class="card record-card passport-card" data-record="${e(r.id)}"><div class="party-half"><div class="party-identity"><h3 class="owner">${e(r.owner)}</h3>${dropdown(r)}</div><p class="product">${e(r.product)}</p><div class="code">ВСД ${e(r.vsd)}</div>${facts(r)}<div class="party-check"><button class="btn" type="button" data-bs-toggle="collapse" data-bs-target="#passport-check-${e(r.id)}" aria-expanded="false" aria-controls="passport-check-${e(r.id)}">Сверка: ${e(r.check)} ${icon('chevron')}</button><div class="collapse" id="passport-check-${e(r.id)}"><div class="check-detail">${checkText(r)}</div></div></div></div>${passport(r)}</article>`;
  const renderLedger = r => {
    const expanded = r.id === '882';
    return `<article class="accordion-item ledger-item" data-record="${e(r.id)}"><div class="ledger-row"><div class="ledger-identity"><h3 class="owner">${e(r.owner)}</h3><p class="product">${e(r.product)}</p></div><div class="ledger-amount">${e(r.amount)}</div><div class="ledger-vse"><a href="${recordUrl(r)}">ВСЭ №${e(r.id)}</a>${badge(r)}</div>${openLink(r, 'btn btn-outline-primary ledger-open')}<button class="expand-trigger${expanded ? '' : ' collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#ledger-detail-${e(r.id)}" aria-expanded="${expanded}" aria-controls="ledger-detail-${e(r.id)}" aria-label="Сведения о партии ${e(r.owner)}" title="Сведения о партии">${icon('chevron')}</button></div><div id="ledger-detail-${e(r.id)}" class="accordion-collapse collapse${expanded ? ' show' : ''}" data-bs-parent="#ledger-list"><div class="ledger-details"><div><div class="code">ВСД ${e(r.vsd)}</div>${facts(r)}<div class="check-detail">${checkText(r)}</div>${modalButton(r, 'history', `Повторные ветосмотры (${r.history.length})`)}</div>${passport(r, false)}</div></div></article>`;
  };
  const renderGallery = r => `<article class="gallery-card ${e(r.tone)}" data-record="${e(r.id)}"><div class="gallery-top"><span>Ветеринарная экспертиза</span>${badge(r)}</div><a class="gallery-hit" href="${recordUrl(r)}" aria-label="Открыть карточку ВСЭ №${e(r.id)} — ${e(r.owner)}"><div class="vse-number"><small>№</small> ${e(r.id)}</div><h3 class="product">${e(r.product)}</h3><div class="owner">${e(r.owner)}</div><div class="gallery-quantity">${e(r.amount)}</div><div class="code">ВСД ${e(r.vsd)}</div><div class="open-link">Открыть ВСЭ ${icon('arrow')}</div></a><div class="gallery-footer">${modalButton(r, 'record', `${icon('eye')} Быстрый просмотр`, 'btn btn-neutral')}${dropdown(r)}</div></article>`;
  const renderers = { '1': renderPassport, '2': renderLedger, '3': renderGallery };
  const shell = document.getElementById('page-frame');
  const search = document.getElementById('record-search');
  const clear = document.getElementById('clear-search');
  let result = ['all', 'good', 'conditional'].includes(params.get('result')) ? params.get('result') : 'all';
  let query = params.get('q') || '';
  let composition = false;
  if (search) search.value = query;
  function syncUrl() {
    const next = new URLSearchParams(location.search);
    query ? next.set('q', query) : next.delete('q');
    result === 'all' ? next.delete('result') : next.set('result', result);
    const str = next.toString();
    history.replaceState(null, '', `${location.pathname}${str ? '?' + str : ''}`);
  }
  function refresh() {
    const found = records.filter(r => (result === 'all' || r.tone === result) && [r.owner, r.product, r.vsd, r.id, r.doctor, r.lab].join(' ').toLocaleLowerCase('ru').includes(query.trim().toLocaleLowerCase('ru')));
    document.querySelectorAll('[data-record-list]').forEach(list => {
      list.querySelectorAll('.collapse').forEach(node => bootstrap.Collapse.getInstance(node)?.dispose());
      list.innerHTML = found.map(renderers[list.dataset.recordList]).join('');
    });
    document.querySelectorAll('[data-empty]').forEach(node => { node.hidden = found.length > 0; });
    document.querySelectorAll('[data-count]').forEach(node => { node.textContent = `Показано ${found.length} из ${records.length} партий`; });
    document.querySelectorAll('[data-result]').forEach(button => { button.setAttribute('aria-pressed', String(button.dataset.result === result)); });
    if (clear) clear.hidden = !query;
  }
  if (search) {
    search.addEventListener('compositionstart', () => { composition = true; });
    search.addEventListener('compositionend', () => { composition = false; query = search.value; syncUrl(); refresh(); });
    search.addEventListener('input', () => { if (!composition) { query = search.value; syncUrl(); refresh(); } });
    clear.addEventListener('click', () => { search.value = ''; query = ''; syncUrl(); refresh(); search.focus(); });
  }
  document.querySelectorAll('[data-result]').forEach(button => button.addEventListener('click', () => { result = button.dataset.result; syncUrl(); refresh(); }));
  document.querySelectorAll('[data-reset-filters]').forEach(button => button.addEventListener('click', () => { query = ''; result = 'all'; search.value = ''; syncUrl(); refresh(); search.focus(); }));
  const modal = document.getElementById('recordModal');
  let modalReturnFocus = null;
  if (modal) {
    modal.addEventListener('show.bs.modal', event => {
      const trigger = event.relatedTarget;
      const record = records.find(r => r.id === trigger?.dataset.record);
      if (!record) { event.preventDefault(); return; }
      modalReturnFocus = trigger.closest('.dropdown')?.querySelector('[data-bs-toggle="dropdown"]') || trigger;
      const view = trigger.dataset.view;
      const title = document.getElementById('recordModalTitle');
      const description = document.getElementById('recordModalDescription');
      const body = document.getElementById('recordModalBody');
      title.textContent = view === 'check' ? 'Сверка данных партии' : view === 'history' ? 'Повторные ветосмотры' : `ВСЭ №${record.id}`;
      description.textContent = `${record.owner} — ${record.product}`;
      if (view === 'check') {
        body.innerHTML = `<dl class="detail-grid">${fact('Результат сверки', record.check)}${fact('Дата и время', record.checkDate)}${fact('Специалист', record.checker)}${fact('Номер ВСД', record.vsd)}</dl>`;
      } else if (view === 'history') {
        body.innerHTML = record.history.length ? `<ul class="history-list">${record.history.map(item => `<li><strong>${e(item.date)}</strong>${e(item.result)}<small>${e(item.doctor)} · Остаток ${e(item.amount)} · ${e(item.cost)}</small></li>`).join('')}</ul>` : `<p class="mb-0">Повторные ветосмотры по этой партии не зарегистрированы.</p>`;
      } else {
        body.innerHTML = `<section class="detail-section"><h3>Экспертиза</h3><dl class="detail-grid">${fact('Результат', record.result)}${fact('Дата и время ВСЭ', record.vseDate)}${fact('Специалист', record.doctor)}${fact('Лаборатория', record.lab)}${fact('Источник результата', record.origin, true)}</dl></section><section class="detail-section"><h3>Партия</h3><dl class="detail-grid">${fact('Общий вес', record.amount)}${fact('Номер ВСД', record.vsd)}${fact('Стоимость ВСЭ', record.cost)}${fact('Срок реализации', record.expiry)}</dl></section>`;
      }
      const link = document.getElementById('recordModalLink');
      link.href = recordUrl(record);
      link.setAttribute('aria-label', `Открыть карточку ВСЭ №${record.id}`);
      shell.inert = true;
    });
    modal.addEventListener('hidden.bs.modal', () => { shell.inert = false; modalReturnFocus?.focus(); });
  }
  const tabButtons = [...document.querySelectorAll('[data-bs-toggle="tab"]')];
  const requested = params.get('concept');
  if (requested && /^[123]$/.test(requested) && tabButtons.length) {
    const tab = document.getElementById(`concept-tab-${requested}`);
    if (tab) bootstrap.Tab.getOrCreateInstance(tab).show();
  }
  tabButtons.forEach(button => button.addEventListener('shown.bs.tab', () => { const next = new URLSearchParams(location.search); next.set('concept', button.dataset.conceptId); history.replaceState(null, '', `${location.pathname}?${next}`); }));
  if (document.querySelector('[data-record-list]')) refresh();
  window.AcceptedConcepts = { records, refresh, recordUrl };
})();
