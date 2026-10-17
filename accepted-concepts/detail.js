(() => {
  const params = new URLSearchParams(location.search);
  const record = window.AcceptedRecords.find(item => item.id === params.get('id'));
  const from = params.get('from') || 'index.html';
  const back = document.getElementById('back-to-list');
  back.href = /^(?:index|concept-[123])\.html(?:\?[^#]*)?$/.test(from) ? from : 'index.html';
  if (!record) {
    document.getElementById('missing-record').hidden = false;
    document.getElementById('record-view').hidden = true;
    document.title = 'Запись ВСЭ не найдена — Концепции карточек';
    return;
  }
  document.title = `ВСЭ №${record.id} — ${record.owner}`;
  document.querySelectorAll('[data-field]').forEach(node => { node.textContent = node.dataset.field === 'title' ? `ВСЭ №${record.id}` : record[node.dataset.field]; });
  const result = document.getElementById('detail-result');
  result.classList.add(record.tone);
  result.textContent = record.result;
})();
