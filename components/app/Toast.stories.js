import { app } from './story-support.js';

export default {
  id: 'app-toast', title: 'Рабочие компоненты/Уведомление', tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Общее краткое уведомление рабочих экранов. Используется для результата действия, который не требует исправления в конкретном поле. Метод show(message, {duration}) обновляет единый live-region; hide() закрывает его.' } } },
  argTypes: { message: { control: 'text', description: 'Текст уведомления' } },
  args: { message: 'Смена пароля — демонстрация' },
  render: ({ message }) => {
    const surface = document.createElement('div');
    surface.className = 'vse-app';
    surface.style.minHeight = '220px';
    const toast = app.createToast();
    surface.append(toast);
    requestAnimationFrame(() => toast.show(message, { duration: 0 }));
    return surface;
  },
};
export const Default = { name: 'Обычное уведомление' };
export const LongMessage = { name: 'Длинное сообщение', args: { message: 'Изменения сохранены только в демонстрационном макете и не отправлены в информационную систему.' } };
