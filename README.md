# Akker

Flashcards-like pet project for learning words in new languages.

### Tech stack

- Angular
  - Signals
  - Vite
- TailwindCSS
- RxDB

### Dev

#### TailwindCSS

For proper `clsx` IntelliSense in VSCode, add the following to your `settings.json`:

```json
"tailwindCSS.experimental.classRegex": [["clsx\\(((?:[^()]*|\\([^()]*\\))*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]]
```
