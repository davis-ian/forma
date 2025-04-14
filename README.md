# 🍳 Kitchen Nightmares: Eternal Edition

> A roguelite dungeon crawler where you are a cursed chef battling food-themed enemies in the underworld's most chaotic kitchen. Built with Vue 3, TypeScript, Tailwind CSS, and Three.js — engineered with production-level architecture and clarity to showcase advanced frontend and game dev skills.

---

## 🚀 Live Demo

👉 [Coming Soon] – Will be hosted on Netlify

---

## 🧠 Tech Stack

- **Vue 3 + Vite** – reactive UI and component architecture
- **TypeScript** – strict typing for maintainability and clarity
- **Three.js** – rendering stylized 3D environments
- **Tailwind CSS v4** – utility-first styling with CSS-first theming
- **Custom ECS (Entity Component System)** – modular and scalable gameplay logic

---

## 📁 Project Structure

```
├── public/
│   └── fonts/                   # Static assets, self-hosted fonts
├── src/
│   ├── engine/                  # ECS core lives here, reusable everywhere
│   │   ├── Entity.ts
│   │   ├── Component.ts
│   │   ├── System.ts
│   │   ├── World.ts
│   │   └── index.ts
│   ├── shared/                  # Cross-game reusable logic
│   │   ├── components/          # Data-only, universal: Position, Velocity, Health
│   │   └── systems/             # General Purpose Logic: MovementSystem, RenderSystem
│   ├── components/              # Game-specific (cooking, boss flags)
│   ├── systems/                 # Game-specific systems (attack AI, fire breath)
│   ├── core/                    # Runtime-specific setup (game loop, scene)
│   ├── gameplay/                # Specific to this game (rooms, AI, combat rules)│
│   ├── ui/                      # Vue-specific HUD/menus — separate from game logic
│   ├── assets/                  # Shaders, models, sounds — usually static content
│   ├── style.css                # Global Tailwind/CSS-first styles
│   └── main.ts                  # Entry point (mount Vue, start Game.ts)
```

---

## 🎮 Gameplay Loop

1. Spawn into a procedurally generated dungeon kitchen
2. Fight off food-based enemies (e.g. Baguette Knights, Meat Golems)
3. Cook meals while under fire to complete cursed shift orders
4. Choose upgrades between rooms (recipes, utensils, power-ups)
5. Survive the kitchen — or be consumed by it

---

## 🎨 Design & Theming

- Color system uses **OKLCH via CSS variables** for modern contrast and accessibility
- Fonts are **self-hosted** and preloaded to prevent FOUT
- Tailwind utilities respect theme tokens: `bg-[oklch(var(--color-bg))]`, etc.

---

## 🧱 Architectural Principles

- **ECS Pattern**: decouples behavior, data, and rendering logic
- **CSS-First Theming**: all branding via variables, easily swappable
- **Modular Game Systems**: player, cooking, enemy AI, and upgrades are separate systems
- **Vue 3 + Composition API**: clean separation of UI and logic
- **No runtime magic**: everything statically typed and traceable

---

## ✅ Recruiter-Targeted Highlights

- **Custom-built ECS engine** from scratch in TypeScript
- Uses **Three.js directly** (no engine abstraction), for full control
- UI built with Vue and Tailwind using **component-driven structure**
- Fonts, colors, and layout follow **accessibility and UX best practices**
- Thoughtful use of animation, transitions, and screen flow

---

# Shared Folder Guidelines

This folder contains components and systems that are reusable across games.

✅ Should be data-driven
✅ Must not rely on game-specific themes (no "Cooking", "FireSword", "FearComponent")
✅ Must have clean interfaces and clear dependencies
✅ Prefer composable patterns (e.g. "Health" + "Poisoned" instead of "BurningStatusEffect")

## 📖 Additional Docs

- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md): ECS layout, game loop, and Three.js scene structure
- [`docs/THEMING.md`](./docs/THEMING.md): full breakdown of OKLCH theme system and how to add new palettes
- [`docs/DEV-NOTES.md`](./docs/DEV-NOTES.md): changelog, technical decisions, TODOs

---

## 📌 Roadmap

- [x] Home screen + theming
- [x] Custom ECS setup
- [ ] Player controller & dash combat
- [ ] Cooking mechanics
- [ ] Procedural dungeon generator
- [ ] Meta progression system
- [ ] Boss fights

---

## 🤝 Contributing

This project is meant to show off individual full-stack frontend mastery and game architecture design. If you’re interested in extending it or want to collab on game dev tooling, feel free to fork.

---

## 📜 License

MIT — but please credit if you’re using the ECS or theming system structure.
