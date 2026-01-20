# 🔐 Налаштування GitHub Secrets для Production Deployment

## Крок 1: Відкрийте Settings у вашому репозиторії

Перейдіть на: **https://github.com/VitaliyYurakh/reiz/settings/secrets/actions**

## Крок 2: Додайте наступні secrets

Натисніть **"New repository secret"** для кожного з наступних:

### 1. API_SECRET
```
Name: API_SECRET
Value: stst
```

### 2. API_SALT
```
Name: API_SALT
Value: sts
```

### 3. TELEGRAM_BOT_TOKEN
```
Name: TELEGRAM_BOT_TOKEN
Value: 8129127447:AAEtf8pmxeVwiqjBR6kcuslf5-So-feacJk
```

### 4. TELEGRAM_CHAT_ID
```
Name: TELEGRAM_CHAT_ID
Value: 775007115
```

## Крок 3: Підтвердження

Після додавання всіх 4 secrets ви побачите їх у списку:
- ✅ API_SECRET
- ✅ API_SALT
- ✅ TELEGRAM_BOT_TOKEN
- ✅ TELEGRAM_CHAT_ID

## Крок 4: Запустіть deployment

Після додавання secrets, просто запуште commit у main гілку, і GitHub Actions автоматично задеплоїть код з Telegram інтеграцією.

---

**Примітка:** Ці secrets уже налаштовані в оновленому `.github/workflows/deploy.yml` файлі.
