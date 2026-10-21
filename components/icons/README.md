# Иконки интерфейса ВСЭ

`VseIcon.js` — единый runtime-реестр SVG. HTML-страницы подключают его обычным `<script>`, Storybook импортирует тот же файл.

## Правило для сверки данных

Иконка выбирается по назначению блока, а не по типу продукции и не по визуальному сходству. На мясных, молочных и будущих экранах сверки действует одна карта:

| `data-check-section` | Блок | Иконка |
| --- | --- | --- |
| `document` | Документ | `check-document` |
| `participants` | Участники перевозки | `check-participants` |
| `product` | Идентификация продукции | `check-product` |
| `transport` | Идентификация транспорта | `check-transport` |
| `documents` | Сопроводительные документы | `check-documents` |
| `priorVse` | Ранее проведённая ВСЭ | `check-prior-vse` |
| `invoice` | Расчёт стоимости услуг | `check-invoice` |

Для блока «Документ» всегда используется `VseIcons.createCheckSection('document')`. Нельзя вставлять другой SVG или менять path локально в странице.

`VseIcons.enhanceCheckInterface(root)` заполняет слоты `.section-icon` по `data-check-section` и унифицирует иконки кнопок совпадения и расхождения. Новая иконка сначала добавляется в реестр и Storybook, затем используется на странице.

Кнопки результата используют `comparison-match` и `comparison-mismatch`. Действие «Все соответствует» использует `check-complete`. Они также подставляются реестром и показаны в каталоге.
