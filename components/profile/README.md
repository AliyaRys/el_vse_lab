# Компоненты профиля

`profile.html` и Storybook используют один код из этой папки. Экран повторно использует общие рабочие `Button`, `InfoField` и системные иконки из `components/app/`.

## API

| Функция | Параметры | Результат |
| --- | --- | --- |
| `createSummary(options)` | имя, логин, инициалы, права, типы продукции, `disabled`, `onPhotoSelect(file)` | Карточка пользователя с `.photoInput` |
| `createPasswordChangeForm(options)` | `idPrefix`, `open`, `disabled`, `busy`, `error`, `onSubmit` | Раскрываемая форма с `setOpen`, `setBusy`, `setError`, `.fields`, `.toggleButton`, `.submitButton` |
| `createScreen(options)` | данные пользователя, состояния формы, обработчики фото и пароля | Основное содержимое профиля с `.summary` и `.passwordForm` |

`onSubmit` получает `{ currentPassword, newPassword }`, может вернуть `{ error }` или завершиться успешно. Поля маскированы, используют `current-password` и `new-password`, не сохраняются. Макет не меняет реальный пароль и не загружает фото на сервер.

Общая шапка приложения создаётся `components/shell/AppHeader.js`, подключается через `app-shell.js` и показана отдельным компонентом Storybook. Экран профиля её не копирует.
