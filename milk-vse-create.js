(() => {
  const parties = {
    'ak-bars': { owner: 'КФХ «Ак Барс»', number: 'RU016:260812-007101', date: '12.08.2026 08:40', arrival: '2026-08-12T09:18', product: 'Молоко коровье сырое', amount: '120 л', vehicle: 'А245КМ 116', partLabel: 'Секция', amountLabel: 'Объём', parts: ['40 л', '40 л', '40 л'] },
    nur: { owner: 'КФХ «Нур»', number: 'RU016:260812-007118', date: '12.08.2026 10:15', arrival: '2026-08-12T11:52', product: 'Молоко коровье сырое', amount: '80 л', vehicle: 'Н831ОР 116', partLabel: 'Секция', amountLabel: 'Объём', parts: ['80 л'] },
    sadykova: { owner: 'ЛПХ Садыкова Р.Р.', number: 'RU016:260812-007133', date: '12.08.2026 12:30', arrival: '2026-08-12T13:07', product: 'Творог непромышленного изготовления', amount: '15 кг', vehicle: 'Т019ЕК 716', partLabel: 'Ёмкость', amountLabel: 'Масса', parts: ['5 кг', '5 кг', '5 кг'] }
  };
  const params = new URLSearchParams(location.search);
  const key = parties[params.get('party')] ? params.get('party') : 'ak-bars';
  const party = parties[key];
  document.body.dataset.party = key;
  document.title = `Электронная лаборатория ВСЭ — ${party.owner}`;
  document.getElementById('vsd-number').value = party.number;
  document.getElementById('vsd-date').value = party.date;
  document.getElementById('arrival-time').value = party.arrival;
  document.getElementById('owner').value = party.owner;
  document.getElementById('product').value = party.product;
  document.getElementById('amount').value = party.amount;
  document.getElementById('vehicle').value = party.vehicle;
  const compositionHead = document.querySelector('.composition-head');
  compositionHead.children[0].textContent = party.partLabel;
  compositionHead.children[1].textContent = party.amountLabel;
  document.getElementById('composition-rows').innerHTML = party.parts.map((amount, index) => `<div class="composition-row"><div>${party.partLabel} ${index + 1}</div><div>${amount}</div></div>`).join('');
  const outcomeList = document.getElementById('vse-outcome-list');
  const outcomeParts = party.parts.map((amount, index) => `${party.partLabel} ${index + 1} · ${amount}`);
  VsePartOutcomes.render(outcomeList, outcomeParts, { allowConditional: false });

  const researchGrid = document.getElementById('milk-research-grid');
  MilkSectionResearch.renderEditor(researchGrid, party);
  const studies = [...document.querySelectorAll('.study-card')];
  const isRowFilled = row => {
    const radio = row.querySelector('input[type="radio"]:checked');
    const field = row.querySelector('input[type="number"],select');
    return Boolean(radio || field?.value.trim());
  };
  const updateInvoice = () => {
    const body = document.getElementById('vse-invoice-lines');
    const total = document.getElementById('vse-invoice-total');
    body.replaceChildren();
    let sum = 0;
    studies.forEach(card => {
      const quantity = [...card.querySelectorAll('.part-row')].filter(isRowFilled).length;
      if (!quantity) return;
      const amount = quantity * 100;
      sum += amount;
      const row = body.insertRow();
      const title = card.querySelector('h3')?.textContent.trim().replace(/\s*\*$/, '') || 'Исследование ВСЭ';
      [title, String(quantity), '100 ₽', `${amount} ₽`].forEach(value => row.insertCell().textContent = value);
    });
    total.textContent = `${sum} ₽`;
  };
  document.getElementById('vse-form').addEventListener('input', updateInvoice);
  document.getElementById('vse-form').addEventListener('change', updateInvoice);
  updateInvoice();

  const toast = document.getElementById('toast');
  let toastTimer;
  const notice = message => { clearTimeout(toastTimer); toast.textContent = message; toast.classList.add('show'); toastTimer = setTimeout(() => toast.classList.remove('show'), 2400); };
  document.getElementById('save-draft').addEventListener('click', () => notice(`Черновик ВСЭ для ${party.owner} сохранён`));
  document.getElementById('cancel').addEventListener('click', () => { location.href = 'arrivals-work-milk.html'; });
  document.getElementById('logout').addEventListener('click', () => { location.href = 'login.html'; });
  document.getElementById('vse-form').addEventListener('submit', event => {
    event.preventDefault();
    const invalid = [...event.currentTarget.querySelectorAll('[required]')].find(field => field.type === 'radio' ? !event.currentTarget.querySelector(`[name="${field.name}"]:checked`) : !field.value.trim());
    event.currentTarget.querySelectorAll('.invalid').forEach(field => field.classList.remove('invalid'));
    if (invalid) {
      const target = invalid.type === 'radio' ? invalid.closest('.study-card') : invalid;
      target.classList.add('invalid');
      invalid.focus();
      notice('Заполните обязательные результаты исследований');
      return;
    }
    if (!VsePartOutcomes.validate(outcomeList)) {
      notice('Выберите результат и направление для каждой части партии');
      return;
    }
    const viewParams = new URLSearchParams({ party: key });
    MilkSectionResearch.appendToParams(viewParams, MilkSectionResearch.collect(researchGrid));
    VsePartOutcomes.appendToParams(viewParams, VsePartOutcomes.collect(outcomeList));
    location.href = `vse-view-milk.html?${viewParams.toString()}`;
  });
})();
