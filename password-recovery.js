(() => {
  const storageKey = 'vse-password-recovery-email';
  const form = document.getElementById('recovery-form');
  const readEmail = () => { try { return sessionStorage.getItem(storageKey) || ''; } catch { return ''; } };
  if (form) {
    const email = document.getElementById('recovery-email');
    const error = document.getElementById('recovery-error');
    const submit = document.getElementById('recovery-submit');
    window.addEventListener?.('pageshow', event => {
      if (!event.persisted) return;
      submit.disabled = false;
      submit.removeAttribute('aria-busy');
      submit.textContent = 'Восстановить пароль';
    });
    email.value = readEmail();
    email.addEventListener('input', () => {
      email.removeAttribute('aria-invalid');
      error.textContent = '';
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (submit.disabled) return;
      email.value = email.value.trim();
      if (!email.validity.valid) {
        error.textContent = email.validity.valueMissing ? 'Укажите электронную почту.' : 'Проверьте адрес электронной почты.';
        email.setAttribute('aria-invalid', 'true');
        email.focus();
        return;
      }
      submit.disabled = true;
      submit.setAttribute('aria-busy', 'true');
      submit.textContent = 'Отправляем…';
      try { sessionStorage.setItem(storageKey, email.value); } catch { /* The confirmation can render without the email. */ }
      // Prototype transition; the mockup does not call an email service.
      setTimeout(() => { window.location.href = 'password-recovery-sent.html'; }, 350);
    });
  }
  const confirmation = document.querySelector('[data-recovery-email]');
  if (confirmation) {
    const email = readEmail();
    confirmation.textContent = email ? `с адресом «${email}»` : '';
  }
  document.querySelector('[data-clear-recovery]')?.addEventListener('click', () => {
    try { sessionStorage.removeItem(storageKey); } catch { /* No storage to clear. */ }
  });
})();
