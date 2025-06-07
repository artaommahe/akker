# Akker

Flashcards-like pet project for learning words in new languages.

Demo mode (preloads some data) - https://artaommahe.github.io/akker/?demo=true

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
