/* Единый перечень исследований молока и молочной продукции.
   Состав синхронизирован с directory-price-edit-milk.html. */
(() => {
  const source = 'https://eec.eaeunion.org/upload/medialibrary/789/TR-TS-033_2013.pdf';
  const n = (id, label, unit, min, max) => ({ id, label, unit, min, max, kind: 'number' });
  const choice = (id, label, value, options) => ({ id, label, value, options, kind: 'choice' });

  const base = [
    choice('consistency', 'Консистенция', 'Соответствует', ['Соответствует', 'Не соответствует']),
    choice('taste-smell', 'Вкус и запах', 'Соответствует', ['Соответствует', 'Не соответствует']),
    choice('color', 'Цвет', 'Соответствует', ['Соответствует', 'Не соответствует']),
    n('temperature', 'Температура', '°C', 2, 6),
    n('fat', 'Массовая доля жира', '%', 2.8, null),
    n('protein', 'Массовая доля белка', '%', 2.8, null),
    n('density', 'Плотность', 'кг/м³', 1027, null),
    n('acidity', 'Кислотность', '°Т', 16, 21),
    n('somo', 'Сухой обезжиренный молочный остаток (СОМО)', '%', 8.2, null),
    n('somatic', 'Соматические клетки', 'тыс./см³', null, 750),
    choice('brucellosis', 'Кольцевая реакция на бруцеллёз', 'Отрицательная', ['Отрицательная', 'Положительная'])
  ];

  const danger = [
    n('chloramphenicol', 'Левомицетин (хлорамфеникол)', 'мг/кг (л)', null, .0003),
    n('tetracyclines', 'Антибиотики тетрациклиновой группы', 'мг/кг (л)', null, .01),
    n('streptomycin', 'Стрептомицин', 'мг/кг (л)', null, .2),
    n('penicillin', 'Пенициллин', 'мг/кг (л)', null, .004),
    n('lead', 'Свинец', 'мг/кг', null, .1),
    n('arsenic', 'Мышьяк', 'мг/кг', null, .05),
    n('cadmium', 'Кадмий', 'мг/кг', null, .03),
    n('mercury', 'Ртуть', 'мг/кг', null, .005),
    n('hch', 'ГХЦГ (альфа-, бета-, гамма-изомеры)', 'мг/кг', null, .05),
    n('ddt', 'ДДТ и его метаболиты', 'мг/кг', null, .05),
    n('aflatoxin-m1', 'Афлатоксин М1', 'мг/кг', null, .0005),
    n('cesium-137', 'Цезий-137', 'Бк/кг', null, 100),
    n('strontium-90', 'Стронций-90', 'Бк/кг', null, 25)
  ];

  const products = [
    ['Сырьё', 'raw-cow', 'Сырое молоко'],
    ['Питьевые и кисломолочные', 'drinking-milk', 'Питьевое молоко'],
    ['Питьевые и кисломолочные', 'drinking-cream', 'Питьевые сливки'],
    ['Питьевые и кисломолочные', 'kefir', 'Кефир'],
    ['Питьевые и кисломолочные', 'yogurt', 'Йогурт'],
    ['Питьевые и кисломолочные', 'sour-cream', 'Сметана'],
    ['Творожная продукция', 'curd', 'Творог'],
    ['Масло и жир', 'butter-unsalted', 'Сливочное масло'],
    ['Сыры', 'cheese-hard', 'Твёрдый сыр'],
    ['Мороженое', 'ice-plombir', 'Пломбир']
  ];
  const studies = [...base, ...danger];
  const catalog = products.map(([group, slug, title]) => ({
    group,
    slug,
    title,
    rows: studies.map(row => ({ ...row, options: row.options ? [...row.options] : undefined })),
    file: slug === 'raw-cow' ? 'directory-norms-edit-milk.html' : `directory-norms-edit-milk-${slug}.html`
  }));

  window.milkNormsCatalog = Object.freeze({ source, catalog, base, danger, studies });
})();
