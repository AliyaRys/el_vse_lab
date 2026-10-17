# el_vse_lab
Рабочее место сотрудников лабораторий ВСЭ

В репозитории находятся рабочие HTML-макеты электронной лаборатории и локальный каталог Storybook.

## Storybook

```powershell
npm.cmd ci
npm.cmd run storybook
```

После запуска откройте http://localhost:6006. Окно терминала должно оставаться открытым.

Инструкция для аналитика и порядок добавления первых компонентов: [STORYBOOK.md](STORYBOOK.md).

Проверка сборки каталога: `npm.cmd run build-storybook`.

В библиотеку перенесены вход, восстановление пароля и профиль. Помимо компонентов авторизации, добавлены базовые компоненты рабочих экранов: кнопка, информационное поле и уведомление. Страницы используют тот же код, что и Storybook.

Описание API: [components/auth/README.md](components/auth/README.md), [components/app/README.md](components/app/README.md), [components/profile/README.md](components/profile/README.md). Проверки поведения и доступности после сборки: `npm.cmd run test:ui` (используется установленный Google Chrome).
