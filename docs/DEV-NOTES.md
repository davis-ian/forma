# 🧪 Dev Notes – Kitchen Nightmares

This file is a running log of **key technical decisions**, **engineering notes**, and **future TODOs** to support team growth, onboarding, and transparency.

---

## 📅 Dev Changelog

### 2025-04-13

- Initial game scaffold with Vite + Vue 3 + TypeScript
- TailwindCSS v4 configured with `@theme` block + OKLCH tokens
- Self-hosted Satoshi font w/ preload for FOUT prevention
- Custom Three.js renderer integrated
- Created basic ECS architecture (Entity, Component, System, World)
- Home screen UI built and themed

---

## ⚙️ Technical Decisions

### Why ECS over Object-Oriented Inheritance?

- Composable: behavior is added via data
- Easier to scale: systems can operate over multiple types
- Debuggable: state and logic are separate

### 🧱 Object-Oriented Example (Inheritance)

```
class Character {
  move() { ... }
}

class Enemy extends Character {
  attack() { ... }
}

class BossEnemy extends Enemy {
  specialAttack() { ... }
}

```

- You start with a base class

- Then extend it to add behavior

- Over time, inheritance trees get deep and complex

🔻 Problems:

- Hard to mix and match behavior (e.g. what if a Boss can also be a vendor?)

- Can’t inherit from multiple parents

- Adding new behavior often means rewriting or extending classes

### 🧩 ECS Example (Composition)

```
// Entity is just an ID
const bossEnemy = createEntity()

// Attach components (just data)
addComponent(bossEnemy, new PositionComponent(x, y))
addComponent(bossEnemy, new HealthComponent(100))
addComponent(bossEnemy, new AIComponent("boss"))
addComponent(bossEnemy, new SpecialAttackComponent())

// Systems handle logic
movementSystem.update()
combatSystem.update()
```

- Each piece of behavior is in a Component (just data)

- Systems are functions that run on entities with specific components

- No inheritance trees — everything is modular and composable

### Why Tailwind + CSS-first theming?

- Zero config needed in `tailwind.config.js`
- Full control via CSS vars
- Supports live theme switching + OKLCH

### Why self-host fonts?

- Avoid FOUT
- Avoid Google CDN analytics
- Total control over loading weights

### Why Vue for UI?

- Familiarity
- Lightweight compared to React for overlays
- Excellent for HUD and menu state binding

---

## 📌 TODO List

### MVP

- [ ] ECS Movement System w/ player controller
- [ ] Collision detection & enemy knockback
- [ ] Cooking mechanic MVP
- [ ] Room transitions and fade animations

### Nice-to-Haves

- [ ] Animations with Framer Motion (Vue port)
- [ ] Dynamic theming via `<ThemeSwitcher />`
- [ ] Screenshot or recording capture tool for GIF export
- [ ] Mini-level editor for designing new dungeons

---

## 💡 Future Ideas

- Procedural recipe system (e.g. spicy + savory = AoE burn)
- God boons as passive skill tree overlays
- Twitch mode (viewers queue up modifiers or ingredients)

---

## 🧼 Code Quality Checklist

- [x] Prettier configured (`.prettierrc`)
- [ ] ESLint added and integrated with CI
- [x] Self-hosted fonts and preloading
- [ ] GitHub Actions for preview deploys

---

## 🧠 Notes to Self

- Keep systems pure – no Three.js calls inside `System.update()`
- Always isolate input ↔️ game state ↔️ UI state
- Prefer config-driven mechanics (e.g. tower JSON, power-up definitions)

---

> This document is maintained as part of the living codebase — edit freely as architecture evolves.
