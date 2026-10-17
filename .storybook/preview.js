/** @type { import('@storybook/html-vite').Preview } */
const preview = {
  parameters: {
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
