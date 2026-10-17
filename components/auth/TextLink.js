(() => {
  const ui = globalThis.VseAuth ||= {};

  /** Навигационная ссылка варианта login. По умолчанию ведёт на существующий макет восстановления. */
  ui.createTextLink = ({ label = 'Забыли пароль?', href = 'password-recovery.html', onClick } = {}) => {
    const link = document.createElement('a');
    link.className = 'vse-auth auth-link';
    link.textContent = label;
    link.href = href;
    if (onClick) link.addEventListener('click', onClick);
    return link;
  };
})();
