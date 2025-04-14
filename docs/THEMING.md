# 🎨 Theming & Design System – Kitchen Nightmares

## 🧠 Strategy

This project uses **Tailwind CSS v4’s CSS-first theming system**. All theme tokens (colors, fonts, spacing, breakpoints) are defined in the `@theme` block inside `index.css`, with modern **OKLCH color values** and runtime-safe CSS variables.

---

## 🎯 Why OKLCH?

OKLCH is perceptually uniform, contrast-safe, and future-friendly — perfect for maintaining visual clarity across light and dark themes.

```css
--color-primary: oklch(0.65 0.24 25);
--color-bg: oklch(0.14 0.03 30);
```

---

## 🎨 Theme Tokens (Defined in `index.css`)

```css
@theme {
  --font-display: 'Satoshi', sans-serif;
  --font-body: 'Inter', sans-serif;

  --color-primary: 0.65 0.24 25;
  --color-secondary: 0.55 0.17 15;
  --color-accent: 0.85 0.1 75;
  --color-bg: 0.14 0.03 30;
  --color-surface: 0.18 0.02 30;
  --color-text: 0.95 0.02 90;

  --ease-fast: cubic-bezier(0.3, 0, 0, 1);
  --ease-bounce: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

> Note: All colors are stored **without the `oklch()` wrapper** for flexibility — use like `oklch(var(--color-bg))`.

---

## 🌗 Applying the Theme

### Base Styles

```css
@layer base {
  html {
    background-color: oklch(var(--color-bg));
    color: oklch(var(--color-text));
    font-family: var(--font-body);
  }
  h1,
  h2,
  h3 {
    font-family: var(--font-display);
  }
}
```

### Utility Aliases

```css
@layer utilities {
  .bg-primary {
    background-color: oklch(var(--color-primary));
  }
  .text-accent {
    color: oklch(var(--color-accent));
  }
  .font-display {
    font-family: var(--font-display);
  }
}
```

---

## 🎛 Runtime Theming (Optional)

You can enable live theme switching by updating variables dynamically:

```ts
document.documentElement.style.setProperty('--color-bg', '0.1 0.03 250')
```

> Tip: Add a `<ThemeSwitcher />` component with color presets for accessibility testing or style variants.

---

## 💡 Tips

- Use [oklch.com](https://oklch.com/) for creating accessible palettes
- Keep 1–2 “core” themes and modify surface/accent for variation
- Use `font-display: optional` on self-hosted fonts to eliminate FOUT
- Preload fonts in `index.html` to boost perceived speed

---

## ✅ Theming Goals

- Avoid FOUT and layout shift
- Enable easy design iteration
- Keep a professional, game-appropriate look
- Maintain legibility in chaotic environments
