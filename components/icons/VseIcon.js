(() => {
  const api = globalThis.VseIcons ||= {};
  const svgNamespace = 'http://www.w3.org/2000/svg';

  const definitions = Object.freeze({
    'check-document': [
      ['path', { d: 'M7 3h7l4 4v14H7z' }],
      ['path', { d: 'M14 3v5h5' }],
    ],
    'check-participants': [
      ['path', { d: 'M4 21V7l8-4 8 4v14' }],
      ['path', { d: 'M9 21v-7h6v7' }],
    ],
    'check-product': [
      ['path', { d: 'M3 7V5a2 2 0 0 1 2-2h2' }],
      ['path', { d: 'M17 3h2a2 2 0 0 1 2 2v2' }],
      ['path', { d: 'M21 17v2a2 2 0 0 1-2 2h-2' }],
      ['path', { d: 'M7 21H5a2 2 0 0 1-2-2v-2' }],
      ['circle', { cx: '12', cy: '12', r: '1' }],
      ['path', { d: 'M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0' }],
    ],
    'check-transport': [
      ['path', { d: 'M3 16h13V6H3z' }],
      ['path', { d: 'M16 10h3l2 3v3h-5z' }],
      ['circle', { cx: '7', cy: '18', r: '2' }],
      ['circle', { cx: '18', cy: '18', r: '2' }],
    ],
    'check-documents': [
      ['path', { d: 'M8 7h8' }],
      ['path', { d: 'M8 11h8' }],
      ['path', { d: 'M8 15h5' }],
      ['path', { d: 'M5 3h14v18H5z' }],
    ],
    'check-prior-vse': [
      ['circle', { cx: '10.5', cy: '10.5', r: '6.5' }],
      ['path', { d: 'M15.5 15.5 21 21' }],
    ],
    'check-invoice': [
      ['path', { d: 'M5 3h14v18l-3-2-4 2-4-2-3 2V3Z' }],
      ['path', { d: 'M8 8h8M8 12h8M8 16h5' }],
    ],
    'comparison-match': [['path', { d: 'M20 6 9 17l-5-5' }]],
    'comparison-mismatch': [
      ['path', { d: 'M18 6 6 18' }],
      ['path', { d: 'm6 6 12 12' }],
    ],
    'check-complete': [
      ['path', { d: 'm3.5 12.5 3.5 3.5 7-8' }],
      ['path', { d: 'm10.5 12.5 3.5 3.5 7-8' }],
    ],
    'admin-users': [
      ['path', { d: 'M18 21a8 8 0 0 0-16 0' }],
      ['circle', { cx: '10', cy: '8', r: '5' }],
      ['path', { d: 'M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3' }],
    ],
    'admin-user-add': [
      ['path', { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' }],
      ['circle', { cx: '9', cy: '7', r: '4' }],
      ['line', { x1: '19', x2: '19', y1: '8', y2: '14' }],
      ['line', { x1: '22', x2: '16', y1: '11', y2: '11' }],
    ],
    'admin-edit': [
      ['path', { d: 'M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z' }],
      ['path', { d: 'm15 5 4 4' }],
    ],
    'admin-lock': [
      ['circle', { cx: '12', cy: '16', r: '1' }],
      ['rect', { x: '3', y: '10', width: '18', height: '12', rx: '2' }],
      ['path', { d: 'M7 10V7a5 5 0 0 1 10 0v3' }],
    ],
    'admin-unlock': [
      ['circle', { cx: '12', cy: '16', r: '1' }],
      ['rect', { x: '3', y: '10', width: '18', height: '12', rx: '2' }],
      ['path', { d: 'M7 10V7a5 5 0 0 1 9.33-2.5' }],
    ],
    'admin-delete': [
      ['path', { d: 'M10 11v6M14 11v6' }],
      ['path', { d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6' }],
      ['path', { d: 'M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' }],
    ],
    'admin-history': [
      ['path', { d: 'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8' }],
      ['path', { d: 'M3 3v5h5M12 7v5l4 2' }],
    ],
    'admin-invite': [
      ['path', { d: 'm22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7' }],
      ['rect', { x: '2', y: '4', width: '20', height: '16', rx: '2' }],
    ],
    'admin-retry': [
      ['path', { d: 'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8' }],
      ['path', { d: 'M3 3v5h5' }],
    ],
    'admin-clear': [
      ['path', { d: 'M18 6 6 18M6 6l12 12' }],
    ],
    'admin-search': [
      ['path', { d: 'm21 21-4.34-4.34' }],
      ['circle', { cx: '11', cy: '11', r: '8' }],
    ],
    'admin-more': [
      ['circle', { cx: '5', cy: '12', r: '1' }],
      ['circle', { cx: '12', cy: '12', r: '1' }],
      ['circle', { cx: '19', cy: '12', r: '1' }],
    ],
    'chevron-left': [['path', { d: 'm15 18-6-6 6-6' }]],
    'chevron-right': [['path', { d: 'm9 18 6-6-6-6' }]],
  });

  const checkSections = Object.freeze({
    document: Object.freeze({ icon: 'check-document', label: 'Документ' }),
    participants: Object.freeze({ icon: 'check-participants', label: 'Участники перевозки' }),
    product: Object.freeze({ icon: 'check-product', label: 'Идентификация продукции' }),
    transport: Object.freeze({ icon: 'check-transport', label: 'Идентификация транспорта' }),
    documents: Object.freeze({ icon: 'check-documents', label: 'Сопроводительные документы' }),
    priorVse: Object.freeze({ icon: 'check-prior-vse', label: 'Ранее проведённая ВСЭ' }),
    invoice: Object.freeze({ icon: 'check-invoice', label: 'Расчёт стоимости услуг' }),
  });

  const checkActions = Object.freeze([
    Object.freeze({ icon: 'comparison-match', label: 'Поле соответствует данным эВСД' }),
    Object.freeze({ icon: 'comparison-mismatch', label: 'Поле не соответствует данным эВСД' }),
    Object.freeze({ icon: 'check-complete', label: 'Отметить все поля соответствующими' }),
  ]);

  const adminIcons = Object.freeze([
    'admin-users', 'admin-user-add', 'admin-edit', 'admin-lock', 'admin-unlock',
    'admin-delete', 'admin-history', 'admin-invite', 'admin-retry', 'admin-clear',
    'admin-search', 'admin-more', 'chevron-left', 'chevron-right',
  ]);

  const createNode = ([tag, attributes]) => {
    const node = document.createElementNS(svgNamespace, tag);
    Object.entries(attributes).forEach(([attribute, value]) => node.setAttribute(attribute, value));
    return node;
  };

  api.create = (name, { label = '', className = '' } = {}) => {
    const definition = definitions[name];
    if (!definition) throw new TypeError(`Неизвестная иконка: ${name}`);
    const svg = document.createElementNS(svgNamespace, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.dataset.vseIcon = name;
    if (className) svg.setAttribute('class', className);
    if (label) {
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', label);
    } else {
      svg.setAttribute('aria-hidden', 'true');
    }
    definition.forEach(part => svg.append(createNode(part)));
    return svg;
  };

  api.getCheckSection = key => {
    const definition = checkSections[key];
    if (!definition) throw new TypeError(`Неизвестный блок сверки: ${key}`);
    return definition;
  };

  api.createCheckSection = key => api.create(api.getCheckSection(key).icon);
  api.listCheckSections = () => Object.entries(checkSections).map(([key, value]) => ({ key, ...value }));
  api.listCheckActions = () => checkActions.map(value => ({ ...value }));
  api.listAdminIcons = () => [...adminIcons];

  api.enhanceCheckInterface = (root = document) => {
    root.querySelectorAll('[data-check-section]').forEach(section => {
      const slot = section.querySelector('.section-title .section-icon');
      if (!slot) return;
      slot.replaceChildren(api.createCheckSection(section.dataset.checkSection));
    });
    root.querySelectorAll('.check-button.ok').forEach(button => button.replaceChildren(api.create('comparison-match')));
    root.querySelectorAll('.check-button.bad').forEach(button => button.replaceChildren(api.create('comparison-mismatch')));
    root.querySelectorAll('[data-check-complete-icon]').forEach(control => {
      const current = control.querySelector(':scope > svg');
      if (current) current.replaceWith(api.create('check-complete'));
      else control.prepend(api.create('check-complete'));
    });
  };
})();
