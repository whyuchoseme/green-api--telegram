# Telegram Web Client (GREEN-API)

Легкий веб-клиент мессенджера, созданный с использованием React и GREEN-API. Проект спроектирован со строгим соблюдением методологии **Feature-Sliced Design (FSD)**, что обеспечивает высокую масштабируемость, переиспользуемость компонентов и чистую архитектуру.

## 🛠 Технологический стек

- **Frontend:** React 19, TypeScript, Vite
- **Стилизация:** SCSS Modules (с использованием гибких миксинов и адаптивной верстки)
- **Архитектура:** Feature-Sliced Design (FSD)
- **API:** GREEN-API (интеграция с WhatsApp/Telegram)

## 🏗 Архитектура (FSD)

Проект разделен на изолированные слои по правилам FSD:

- `app/` — Инициализация приложения, глобальные стили, провайдеры.
- `pages/` — Экраны приложения (например, главная страница чата).
- `features/` — Пользовательские сценарии (например, `SendMessageForm`, `CreateChatForm`).
- `entities/` — Бизнес-сущности (например, `MessageBubble`, `ChatItem`).
- `shared/` — Переиспользуемый код (UI-кит, API-клиенты, утилиты).

## 🚀 Локальный запуск проекта

### 1. Клонирование репозитория

```bash
git clone https://github.com/whyuchoseme/green-api--telegram
```

### 2. Установка зависимостей

```bash
npm i
```

### 3. Запуск сервера для разработки

```bash
npm run dev
```

### 4. Получение учетных данных GREEN-API

- Пройдите регистрацию на сайте [console.green-api.com](https://console.green-api.com/).
- Создайте свой инстанс Telegram [console.green-api.com/instanceList](https://console.green-api.com/instanceList).
- Скопируйте **idInstance** и **apiTokenInstance** из панели управления вашего инстанса.

> **Важно:** Если авторизоваться не получается, убедитесь, что вы подключаетесь по верному `apiUrl`-адресу. Поменять его можно в файле [src/shared/api/client.ts](https://github.com/whyuchoseme/green-api--telegram/blob/main/src/shared/api/client.ts).

## 🌍 Демонстрация проекта

**💻 [Пощупать проект вживую можно по этой ссылке](https://whyuchoseme.github.io/green-api--telegram/)**

> ℹ️ **Примечание:** Для доступа к приложению требуются учетные данные GREEN-API. Если вы не хотите проходить процедуру регистрации, вы можете посмотреть, как выглядит интерфейс, на скриншотах ниже.

<details>
  <summary><b>📸 Посмотреть скриншоты приложения</b></summary>
  
  <br>

  **💻 Десктопная версия**
  | Авторизация | Чат и сайдбар |
  | :---: | :---: |
  | <img width="100%" alt="auth--desktop" src="https://github.com/user-attachments/assets/181e7fb5-7c52-4b8e-8b78-9d0d6393a69c" /> | <img width="100%" alt="sidebar-and-chat--desktop" src="https://github.com/user-attachments/assets/78440b21-3a29-4f05-b7d4-7c3a41a2041f" /> |

  **📲 Планшетная версия**
  | Чат и сайдбар |
  | :---: |
  | <img width="100%" alt="sidebar-and-chat--tablet" src="https://github.com/user-attachments/assets/7c4ca1cb-17bb-4e45-ac48-aa4d0f6b5302" /> |

  **📱 Мобильная версия**
  | Авторизация | Ошибка входа | Сайдбар | Чат |
  | :---: | :---: | :---: | :---: |
  | <img width="100%" alt="auth--mobile" src="https://github.com/user-attachments/assets/694672e0-f8ed-4400-b772-1a7f763822ea" /> | <img width="100%" alt="auth-error--mobile" src="https://github.com/user-attachments/assets/8189986c-c4c4-4fe5-b769-1c3e5e7156e5" /> | <img width="100%" alt="sidebar--mobile" src="https://github.com/user-attachments/assets/f85636de-297d-4615-9972-e835c381782a" /> | <img width="100%" alt="chat--mobile" src="https://github.com/user-attachments/assets/26fda018-1abf-43cb-970b-755247144dea" /> |

</details>
