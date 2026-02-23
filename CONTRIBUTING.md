# Contributing to in-naamGPT

Thanks for your interest in contributing! This project is an educational tool — every contribution should make it easier for someone to **learn how Transformers work**.

## Getting Started

### Prerequisites

- **Python 3.8+** (for model training — no pip packages needed)
- **Node.js 18+** (for the React frontend)

### Local Setup

```bash
# Clone the repo
git clone https://github.com/RaikaSurendra/in-naamgpt.git
cd in-naamgpt

# Frontend
cd app
npm install
npx vite --port 5180
# Open http://localhost:5180

# Model training (optional — weights are already exported)
cd ../model
python3 in_main.py
```

## How to Contribute

### Types of Contributions Welcome

- **New Learn chapters** — Extend the 11-chapter Learn section with new ML/CS concepts
- **Visualization improvements** — Better interactivity, mobile responsiveness, accessibility
- **Dataset expansion** — Add more curated Hindi/Sanskrit names (must be valid Devanagari, Unicode block U+0900–097F)
- **Training experiments** — Try different hyperparameters, architectures, or training strategies
- **Bug fixes** — UI bugs, inference edge cases, Unicode handling issues
- **Documentation** — Clearer explanations, translations, typo fixes
- **Performance** — Bundle size reduction, rendering performance, lazy loading

### Not in Scope

- Adding ML library dependencies (PyTorch, TensorFlow, NumPy) — the zero-dependency philosophy is core to the project
- Replacing the Bauhaus design system
- Server-side inference — the project must remain fully client-side

## Contribution Workflow

1. **Check existing issues** — Look for open issues or discussions before starting work
2. **Open an issue first** — For non-trivial changes, open an issue describing what you want to do
3. **Fork the repo** and create a feature branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
4. **Make your changes** — Follow the code standards below
5. **Test locally** — Ensure `npx vite build` passes and the app works at localhost:5180
6. **Open a PR** — One PR per feature/fix. Reference the related issue

## Code Standards

### Python (model/)

- **No external dependencies** — Only Python standard library (`math`, `random`, `json`, `pickle`, `unicodedata`, `re`, `pathlib`, `copy`)
- Keep the training script under ~500 LOC
- Use descriptive variable names — this is educational code, clarity over brevity
- All names in the dataset must be valid Devanagari (Unicode block U+0900–097F)
- Test that `python3 in_main.py` completes without errors and generates valid names

### JavaScript / React (app/)

- **No chart or visualization libraries** — All visualizations are custom (canvas + CSS)
- **No additional npm dependencies** without discussion — the project uses only: react, react-dom, vite, tailwindcss, @vitejs/plugin-react, @tailwindcss/vite
- Components go in `app/src/components/`
- Learn chapters go in `app/src/components/learn/chapters.js`
- Follow existing Bauhaus design tokens (see `app/src/index.css`)
- Use functional components with hooks
- Ensure the build passes: `cd app && npx vite build`

### Commit Messages

Follow conventional commits:

```
feat: add new Learn chapter on weight initialization
fix: correct NFD normalization for anusvara
docs: improve README setup instructions
style: align attention visualization grid on mobile
perf: lazy-load embedding section
```

### Branch Naming

```
feat/description    — New features
fix/description     — Bug fixes
docs/description    — Documentation only
perf/description    — Performance improvements
```

## Adding a New Learn Chapter

The Learn section lives in `app/src/components/learn/chapters.js`. Each chapter is an object with:

```javascript
{
  id: 'kebab-case-id',
  num: '12',                    // Next sequential number
  title: 'Chapter Title',
  color: COLORS[0],            // Rotate: COLORS[0]=red, [1]=blue, [2]=yellow
  subtitle: 'One-line summary.',
  paragraphs: [                 // 3-4 paragraphs explaining the concept
    'First paragraph...',
    'Second paragraph...',
  ],
  diagram: `ASCII diagram`,    // Visual explanation
  code: {                      // Real code from the project
    file: 'path/to/file.js',
    label: 'Description',
    snippet: `actual code`,
  },
  takeaways: [                 // 3-6 bullet points
    'Key point 1',
    'Key point 2',
  ],
  further: [                   // 2-4 external links
    { title: 'Resource Name', url: 'https://...' },
  ],
}
```

## Adding Names to the Dataset

The dataset is at `model/data/in_name.txt` (one name per line, Devanagari script).

Requirements:
- Must be valid Hindi/Sanskrit names in Devanagari
- Only characters from Unicode Devanagari block (U+0900–097F)
- No duplicate names
- No transliterated (Latin) names — Devanagari only
- After adding names, re-run training and re-export:
  ```bash
  cd model
  python3 in_main.py
  python3 scripts/export_training_trace.py
  ```

## PR Review

All PRs are reviewed by:
- **CodeRabbit** (automated) — Code quality and style
- **Maintainer** — Correctness, educational value, and alignment with project goals

CI must pass (build verification via GitHub Actions).

## Questions?

Open a [Discussion](https://github.com/RaikaSurendra/in-naamgpt/discussions) or an issue. No question is too basic — this is a learning project.
