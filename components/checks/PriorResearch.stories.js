import { check, wrapCheck } from './story-support.js';

const meatItems = [
  { name: 'Органолептика', value: 'Соответствует' },
  { name: 'Идентификация', value: 'Соответствует' },
  { name: 'Температура в толще мышц, °C', value: '3,0' },
  { name: 'Трихинеллоскопия', value: 'Не обнаружено' },
];
const milkItems = [
  { name: 'Консистенция', value: 'Однородная жидкость' },
  { name: 'Вкус и запах', value: 'Чистые, без посторонних привкусов' },
  { name: 'Кислотность, °Т', value: '17' },
  { name: 'Кольцевая реакция на бруцеллёз', value: 'Отрицательная' },
];

export default {
  id: 'check-prior-research',
  title: 'Сверка данных/Блоки/Ранее проведённая ВСЭ',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: { title: { control: 'text' }, items: { control: 'object' }, open: { control: 'boolean' } },
  args: { title: 'Результаты исследований', items: meatItems, open: true },
  render: args => wrapCheck(check.createResearchDisclosure(args), 'check-story-block'),
};

export const Meat = { name: 'Мясо' };
export const Milk = { name: 'Молоко', args: { items: milkItems } };
export const Collapsed = { name: 'Свёрнуто', args: { open: false } };
export const Narrow = { name: 'Узкий экран', args: { items: milkItems }, parameters: { viewport: { defaultViewport: 'mobile1' } } };
