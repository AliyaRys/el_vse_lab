(() => {
  const ui = globalThis.VseCheck ||= {};
  const iconLibrary = globalThis.VseIcons;
  let sequence = 0;

  const create = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  };

  const createSectionIcon = section => {
    if (!iconLibrary) throw new Error('VseIcons должен быть подключён перед CheckUi.js');
    const wrapper = create('span', 'section-icon');
    wrapper.append(iconLibrary.createCheckSection(section));
    return wrapper;
  };

  const createStateIcon = state => iconLibrary.create(state === 'ok' ? 'comparison-match' : 'comparison-mismatch');

  ui.createSectionHeader = ({ title, description = '', section = 'document', price = '' }) => {
    const header = create('div', 'section-head');
    const titleGroup = create('div', 'section-title');
    const copy = create('div');
    copy.append(create('h2', '', title));
    if (description) copy.append(create('p', '', description));
    titleGroup.append(createSectionIcon(section), copy);
    header.append(titleGroup);
    if (price) {
      const priceNode = create('div', 'section-price');
      priceNode.append(create('strong', '', price), create('small', '', 'за сверку'));
      header.append(priceNode);
    }
    return header;
  };

  ui.createComparisonActions = ({ label = 'Поле', state = '', disabled = false } = {}) => {
    const fragment = document.createDocumentFragment();
    ['ok', 'bad'].forEach(value => {
      const button = create('button', `check-button ${value}${state === value ? ' active' : ''}`);
      button.type = 'button';
      button.dataset.state = value;
      button.setAttribute('aria-label', `${label} ${value === 'ok' ? 'соответствует' : 'не соответствует'}`);
      button.setAttribute('aria-pressed', String(state === value));
      button.disabled = disabled;
      button.append(createStateIcon(value));
      fragment.append(button);
    });
    return fragment;
  };

  ui.setComparisonState = (row, state, { focusFact = false } = {}) => {
    if (!row || !['ok', 'bad', ''].includes(state)) return;
    row.dataset.state = state;
    row.classList.toggle('match', state === 'ok');
    row.classList.toggle('mismatch', state === 'bad');
    row.querySelectorAll('.check-button').forEach(button => {
      const active = button.dataset.state === state;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    const fact = row.querySelector('.fact-field input, .fact-field textarea');
    if (fact) fact.required = state === 'bad';
    if (focusFact && state === 'bad') fact?.focus();
  };

  ui.bindComparisonField = row => {
    if (!row || row.dataset.checkUiBound === 'true') return row;
    row.dataset.checkUiBound = 'true';
    row.querySelectorAll('.check-button').forEach(button => button.addEventListener('click', () => {
      ui.setComparisonState(row, button.dataset.state, { focusFact: true });
      row.dispatchEvent(new CustomEvent('vse-check-change', { bubbles: true, detail: { state: button.dataset.state } }));
    }));
    return row;
  };

  ui.createComparisonField = ({ label, value, key = '', state = '', reference = false, factValue = '', factPlaceholder = 'Укажите фактическое значение', factType = 'text', disabled = false, error = '' }) => {
    const id = `check-fact-${++sequence}`;
    const row = create('div', `compare-row${reference ? ' reference' : ''}`);
    if (key) row.dataset.check = key;
    row.append(create('div', 'field-name', label), create('div', 'mercury-value', value));
    if (!reference) {
      row.append(ui.createComparisonActions({ label, state, disabled }));
      const fact = create('div', 'fact-field');
      const fieldLabel = create('label', '', 'Фактическое значение');
      fieldLabel.htmlFor = id;
      const input = create(factType === 'textarea' ? 'textarea' : 'input');
      input.id = id;
      if (factType !== 'textarea') input.type = factType;
      input.placeholder = factPlaceholder;
      input.value = factValue;
      input.disabled = disabled;
      if (error) {
        const errorId = `${id}-error`;
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', errorId);
        const errorNode = create('div', 'field-error', error);
        errorNode.id = errorId;
        errorNode.setAttribute('role', 'alert');
        fact.append(fieldLabel, input, errorNode);
      } else {
        fact.append(fieldLabel, input);
      }
      row.append(fact);
      ui.bindComparisonField(row);
      ui.setComparisonState(row, state);
    }
    return row;
  };

  ui.createCompositionTable = ({ label = 'Состав партии', columns, rows }) => {
    const table = create('div', 'parts-table');
    table.setAttribute('role', 'table');
    table.setAttribute('aria-label', label);
    const head = create('div', 'parts-row parts-head');
    head.setAttribute('role', 'row');
    columns.forEach(column => {
      const cell = create('div', '', column);
      cell.setAttribute('role', 'columnheader');
      head.append(cell);
    });
    table.append(head);
    rows.forEach(values => {
      const row = create('div', 'parts-row');
      row.setAttribute('role', 'row');
      values.forEach(value => {
        const cell = create('div', '', value);
        cell.setAttribute('role', 'cell');
        row.append(cell);
      });
      table.append(row);
    });
    table.style.setProperty('--parts-columns', columns.length);
    return table;
  };

  const positiveValues = new Set(['Соответствует требованиям', 'Нет', 'Да, грузы разделены']);
  const negativeValues = new Set(['Есть загрязнения или повреждения', 'Есть загрязнения и повреждения', 'Да, разделение не обеспечено']);

  ui.syncTransportObservation = observation => {
    const select = observation?.querySelector('select');
    if (!select) return 'neutral';
    const value = select.value.trim();
    const tone = positiveValues.has(value) ? 'positive' : negativeValues.has(value) ? 'negative' : 'neutral';
    observation.classList.toggle('selected', tone !== 'neutral');
    observation.classList.toggle('is-positive', tone === 'positive');
    observation.classList.toggle('is-negative', tone === 'negative');
    observation.dataset.statusTone = tone;
    return tone;
  };

  ui.bindTransportObservation = observation => {
    if (!observation || observation.dataset.checkUiBound === 'true') return observation;
    observation.dataset.checkUiBound = 'true';
    const select = observation.querySelector('select');
    select?.addEventListener('change', () => ui.syncTransportObservation(observation));
    ui.syncTransportObservation(observation);
    return observation;
  };

  ui.createTransportObservation = ({ label, options, value = '', id = `transport-${++sequence}`, disabled = false }) => {
    const observation = create('div', 'transport-observation');
    const fieldLabel = create('label', '', label);
    fieldLabel.htmlFor = id;
    const select = create('select');
    select.id = id;
    select.required = true;
    select.disabled = disabled;
    const placeholder = create('option', '', 'Выберите значение');
    placeholder.value = '';
    placeholder.disabled = true;
    placeholder.hidden = true;
    placeholder.selected = !value;
    select.append(placeholder);
    options.forEach(optionValue => {
      const option = create('option', '', optionValue);
      option.value = optionValue;
      option.selected = optionValue === value;
      select.append(option);
    });
    observation.append(fieldLabel, select);
    return ui.bindTransportObservation(observation);
  };

  ui.createResearchResult = ({ name, value, optional = false }) => {
    const item = create('div', `research-item${optional ? ' optional' : ''}`);
    item.append(create('div', 'research-name', name), create('div', 'research-value', value));
    return item;
  };

  ui.createResearchDisclosure = ({ title = 'Результаты исследований', items = [], open = true }) => {
    const details = create('details', 'research-results');
    details.open = open;
    details.append(create('summary', '', title));
    const list = create('div', 'research-list');
    items.forEach(item => list.append(ui.createResearchResult(item)));
    details.append(list);
    return details;
  };

  ui.createInvoice = ({ lines, total }) => {
    const fragment = document.createDocumentFragment();
    const wrap = create('div', 'invoice-table-wrap');
    const table = create('table', 'invoice-table standardized-columns');
    const head = document.createElement('thead');
    const headRow = document.createElement('tr');
    [['Услуга', 'invoice-service-column'], ['Количество', 'invoice-quantity-column'], ['Тариф', 'invoice-rate-column'], ['Сумма', 'invoice-sum-column']].forEach(([label, className]) => {
      const th = create('th', className, label);
      th.scope = 'col';
      headRow.append(th);
    });
    head.append(headRow);
    const body = document.createElement('tbody');
    lines.forEach(line => {
      const row = document.createElement('tr');
      [line.service, line.quantity, line.rate, line.sum].forEach(value => row.append(create('td', '', value)));
      body.append(row);
    });
    table.append(head, body);
    wrap.append(table);
    const totalNode = create('div', 'invoice-total');
    totalNode.append(create('span', '', 'Итого к оплате'), create('strong', '', total));
    fragment.append(wrap, totalNode);
    return fragment;
  };

  ui.createSection = ({ title, description = '', section: sectionKey = 'document', price = '', content = [] }) => {
    const section = create('section', 'section');
    section.dataset.checkSection = sectionKey;
    section.append(ui.createSectionHeader({ title, description, section: sectionKey, price }));
    content.forEach(node => section.append(node));
    return section;
  };

  ui.enhance = (root = document) => {
    iconLibrary?.enhanceCheckInterface(root);
    root.querySelectorAll('.vse-check-ui .check-button').forEach(button => {
      if (!button.hasAttribute('aria-pressed')) button.setAttribute('aria-pressed', String(button.classList.contains('active')));
    });
    root.querySelectorAll('.vse-check-ui .transport-observation').forEach(ui.bindTransportObservation);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => ui.enhance());
  else ui.enhance();
})();
