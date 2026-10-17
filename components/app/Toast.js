(() => {
  const ui = globalThis.VseApp ||= {};

  /** Shared polite notification for routine completion on working screens. */
  ui.createToast = () => {
    const toast = document.createElement('div');
    toast.className = 'vse-app app-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.setAttribute('aria-atomic', 'true');
    let timer;
    toast.hide = () => {
      clearTimeout(timer);
      toast.classList.remove('show');
    };
    toast.show = (message, { duration = 2600 } = {}) => {
      clearTimeout(timer);
      toast.textContent = message;
      toast.classList.add('show');
      if (duration > 0) timer = setTimeout(toast.hide, duration);
    };
    return toast;
  };
})();
