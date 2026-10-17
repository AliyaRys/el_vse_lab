import { ui, wrap, preventNavigation } from './story-support.js';

export default {
  id: 'auth-link', title: 'Вход/Ссылка', tags: ['autodocs'],
  parameters: { layout: 'centered', docs: { description: { component: 'Ссылка для перехода к восстановлению пароля. Параметры: label, href, onClick. В приложении ведёт на password-recovery.html; в примерах переход отменяется, чтобы оставаться в каталоге. Наведение и клавиатурный фокус можно проверить на самом элементе.' } } },
  argTypes: { label: { control: 'text', description: 'Текст ссылки' } },
  args: { label: 'Забыли пароль?' },
  render: args => wrap(ui.createTextLink({ ...args, onClick: preventNavigation })),
};
export const Default = { name: 'Восстановление пароля' };
export const Focus = { name: 'В фокусе', play: ({ canvasElement }) => canvasElement.querySelector('a').focus() };
export const LongLabel = { name: 'Длинная подпись', args: { label: 'Восстановить доступ к учётной записи электронной лаборатории' } };
