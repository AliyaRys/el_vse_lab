import { check, wrapCheck } from './story-support.js';

export default {
  id: 'check-comparison-field',
  title: 'Сверка данных/Компоненты/Поле сверки',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    label: { control: 'text' }, value: { control: 'text' },
    state: { control: 'radio', options: ['', 'ok', 'bad'] },
    reference: { control: 'boolean' }, factValue: { control: 'text' },
    disabled: { control: 'boolean' }, error: { control: 'text' },
  },
  args: { label: 'Вид продукции', value: 'Свинина охлажденная', state: '', reference: false, factValue: '', disabled: false, error: '' },
  render: args => wrapCheck(check.createComparisonField(args), 'check-story-field'),
};

export const Idle = { name: 'Ожидает проверки' };
export const Match = { name: 'Совпадение', args: { state: 'ok' } };
export const Mismatch = { name: 'Расхождение', args: { state: 'bad', factValue: 'Свинина замороженная' } };
export const Reference = { name: 'Справочное значение', args: { label: 'Номер эВСД', value: 'RU016:260812-005118', reference: true } };
export const LongValue = { name: 'Длинное значение', args: { label: 'Связанные документы', value: 'Удостоверение качества № 91/26, декларация соответствия ЕАЭС N RU Д-RU.РА02' } };
export const Error = { name: 'Ошибка фактического значения', args: { state: 'bad', error: 'Укажите фактическое значение.' } };
export const Disabled = { name: 'Недоступно', args: { disabled: true } };
export const Narrow = { name: 'Узкий экран', parameters: { viewport: { defaultViewport: 'mobile1' } } };
