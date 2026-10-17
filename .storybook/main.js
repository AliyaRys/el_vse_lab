

/** @type { import('@storybook/html-vite').StorybookConfig } */
const config = {
  "stories": ["../stories/Introduction.mdx"],
  "addons": [
    "@storybook/addon-a11y",
    "@storybook/addon-docs"
  ],
  "framework": "@storybook/html-vite",
  "core": { "disableTelemetry": true }
};
export default config;
