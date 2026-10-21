(() => {
  if (!globalThis.VseAppHeader) throw new Error('components/shell/AppHeader.js должен быть подключён перед app-shell.js');
  globalThis.VseAppHeader.mountPage(document);
})();
