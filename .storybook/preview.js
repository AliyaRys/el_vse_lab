/** @type { import('@storybook/html-vite').Preview } */
const preview = {
  parameters: {
    viewport: { options: {
      mobile1: { name: 'Телефон — 390 px', styles: { width: '390px', height: '844px' }, type: 'mobile' },
      desktop: { name: 'Компьютер — 1440 px', styles: { width: '1440px', height: '1000px' }, type: 'desktop' },
    } },
    options: { storySort: { order: ['Начало работы', 'Вход', ['Поле ввода', 'Кнопка', 'Ссылка', 'Форма входа', 'Экран входа', 'Восстановление пароля', ['Форма', 'Экраны']], 'Рабочие компоненты', ['Кнопка', 'Информационное поле', 'Уведомление'], 'Профиль', ['Карточка пользователя', 'Смена пароля', 'Экран профиля']] } },
    docs: { toc: true },
    a11y: { test: 'todo' },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;
