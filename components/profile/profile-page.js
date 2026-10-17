(() => {
  const app = globalThis.VseApp;
  const profile = globalThis.VseProfile;
  const toast = app.createToast();
  const screen = profile.createScreen({
    onPhotoSelect: () => toast.show('Выбор фото — демонстрация'),
    onPasswordSubmit: async () => {
      toast.show('Смена пароля — демонстрация');
    },
  });
  document.getElementById('profile-root')?.replaceWith(screen);
  document.body.append(toast);
  document.getElementById('logout')?.addEventListener('click', () => { window.location.href = 'login.html'; });
})();
