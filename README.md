# Streaks

This repo is two things:

## [1] a working habits tracking app

- FOSS self-hosted local-first

- desktop & mobile → Save to Home screen

- est. cost = $0 to host as static site

## [2] a starter template for React SPA static site with a (free!) distributed backend

- local-first distributed Sqlite [Evolu](https://evolu.dev) database. Should easily handle small- to medium-sized projects, promises to scale really well based on its design

- minimalist yet performant and powerful building blocks

- Vite + React + TailwindCSS v4 + DaisyUI + Wouter + Zustand

### Wish list for v0.2

- [UI] swipe left/right to see more than 6 items
- [UI] drag and drop to reorder items
- [UI] additional tracking options beyond daily/weekly
- [tech] export function, migration pattern, a path to handle data bloat without discarding and starting over
- [code style] replace valibot with Evolu-style runtime validation
- [privacy] even more secure sync: export a salted+encrypted mnemonic, and a way to specify a salted mnemonic (decrypted via secure backend)
