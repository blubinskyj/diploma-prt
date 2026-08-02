# Налаштування Prettier в JetBrains IDE

## Автоматичне форматування при збереженні

### Метод 1: Через UI IDE (рекомендується)

1. Відкрийте **Settings** / **Preferences** (Ctrl+Alt+S / Cmd+,)
2. Перейдіть до **Languages & Frameworks** → **TypeScript** → **Prettier**
3. Встановіть такі параметри:
   - ✓ Run for files: `{ts,tsx,css,md,js,json}`
   - ✓ On Save

4. Перейдіть до **Languages & Frameworks** → **JavaScript** → **Prettier**
   - Встановіть той же конфіг

5. Натисніть **Apply** та **OK**

### Метод 2: Автоматичне форматування через ESLint

1. Відкрийте **Settings** / **Preferences** (Ctrl+Alt+S / Cmd+,)
2. Перейдіть до **Languages & Frameworks** → **JavaScript** → **Code Quality Tools** → **ESLint**
3. Встановіть:
   - ✓ Automatic ESLint configuration
   - ✓ Run eslint --fix on Save

### Метод 3: Налаштування File Watchers

1. Відкрийте **Settings** / **Preferences** (Ctrl+Alt+S / Cmd+,)
2. Перейдіть до **Tools** → **File Watchers**
3. Натисніть **+** і виберіть **Prettier**
4. Встановіть параметр **Run on save**

## Ручне форматування

Щоб вручну відформатувати файл:

- **Ctrl+Alt+Shift+P** (Windows/Linux) або **Cmd+Shift+P** (Mac) → Reformat with Prettier
- Або через меню: **Code** → **Reformat Code** → **Prettier**

## Командна стрічка

Для форматування всіх файлів:

```bash
npm run format
```

Для перевірки без змін:

```bash
npm run format:check
```
