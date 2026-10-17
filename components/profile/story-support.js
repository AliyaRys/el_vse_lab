import { app, wrapApp, delay } from '../app/story-support.js';
import './ProfileSummary.js';
import './PasswordChangeForm.js';
import './ProfileScreen.js';
import './profile.css';

export { app, wrapApp };
export const profile = globalThis.VseProfile;
export const demoPasswordChange = async () => { await delay(); };
export const demoPasswordFailure = async () => { await delay(); return { error: 'Не удалось сменить пароль. Проверьте данные и попробуйте снова.' }; };
