import '../app/app.css';
import '../app/Icon.js';
import '../app/Button.js';
import '../app/InfoField.js';
import '../icons/VseIcon.js';
import './AdminData.js';
import './AdminDemoStore.js';
import './UserStatusDialog.js';
import './UserDeleteDialog.js';
import './AdminTextField.js';
import './AccessEditor.js';
import './CreateUserForm.js';
import './AdminUsersList.js';
import './UserHistory.js';
import './admin.css';
import './admin-forms.css';
import './admin-history.css';

export const admin = globalThis.VseAdmin;
export const renderUsersList = options => {
  const stage = document.createElement('div');
  stage.className = 'vse-app admin-story-stage';
  stage.style.padding = '28px';
  stage.style.background = 'var(--app-page)';
  stage.style.minHeight = '100vh';
  stage.append(admin.createUsersList({ restoreState: false, ...options }));
  stage.querySelectorAll('a').forEach(link => link.addEventListener('click', event => event.preventDefault()));
  return stage;
};

export const renderAdminComponent = (element, width = '960px') => {
  const stage = document.createElement('div');
  stage.className = 'vse-app admin-story-stage';
  stage.style.width = `min(${width}, calc(100vw - 32px))`;
  stage.style.margin = '0 auto';
  stage.style.padding = '28px 0';
  stage.append(element);
  stage.querySelectorAll('a').forEach(link => link.addEventListener('click', event => event.preventDefault()));
  return stage;
};

export const renderUserHistory = options => renderAdminComponent(admin.createUserHistory({ restoreState: false, ...options }), '920px');
