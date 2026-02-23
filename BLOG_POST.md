# I Built a GPT From Scratch in 400 Lines of Python to Generate Hindi Names

**TL;DR:** I trained a ~5,400 parameter Transformer on 2,170 Sanskrit & Hindi names — no PyTorch, no TensorFlow, just pure Python math. It runs entirely in your browser and generates new हिंदी names that sound real but never existed.

**[Try it live →](https://in-naamgpt.vercel.app)** | **[Source code →](https://github.com/RaikaSurendra/in-naamgpt)**

---

## Why Build a GPT From Scratch?

Every tutorial about Transformers starts with `import torch`. But what actually happens inside `nn.Linear`? What does `loss.backward()` really compute?

I wanted to strip away every abstraction and build a working GPT with nothing but Python's `math` and `random` modules. No NumPy. No frameworks. Just loops, floats, and gradients computed by hand.

The result: a character-level language model that learns to generate Hindi names in Devanagari script.

## The Dataset: 2,170 Sanskrit & Hindi Names

The training data is a curated list of names in Devanagari — names like **आरव**, **प्रिया**, **कृष्ण**, **अग्निवेश**, **यूथिका**. Each name is a sequence of Unicode characters that the model learns to predict one character at a time.

Working with Devanagari introduced an interesting challenge: **Unicode NFD decomposition**.

A single visible character like **की** is actually two Unicode code points:
- `क` (consonant Ka)
- `ी` (vowel sign II)

The model tokenizes names into their NFD (Normalized Form Decomposed) characters — splitting every name into its atomic consonants, vowels, matras, and virama marks. This gives us a clean **57-token vocabulary**.

## The Architecture

The entire model is a 1-layer decoder-only Transformer:

```
Input Token (character ID 0-56)
    ↓
Token Embedding + Position Embedding → 16-dim vector
    ↓
RMSNorm
    ↓
Multi-Head Self-Attention (4 heads × 4 dims each)
    ↓
+ Residual Connection
    ↓
RMSNorm → MLP (16 → 64 → ReLU → 64 → 16)
    ↓
+ Residual Connection
    ↓
Output Head → 57 logits → softmax → next character
```

**Total: ~5,400 parameters.** For comparison, GPT-4 has ~1.8 trillion.

## Building Autograd From Scratch

The trickiest part wasn't the forward pass — it was backpropagation.

I built a tiny autograd engine with a `Value` class that tracks computation graphs. Every operation — addition, multiplication, matrix-vector products, softmax, log — records its inputs and local gradients so we can run `.backward()` through the entire graph.

```python
class Value:
    def __init__(self, data, children=(), local_grads=()):
        self.data = data
        self.grad = 0
        self._children = children
        self._local_grads = local_grads

    def __add__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        return Value(self.data + other.data, (self, other), (1, 1))

    def __mul__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        return Value(self.data * other.data, (self, other), (other.data, self.data))
```

Adam optimizer, cross-entropy loss, RMSNorm, softmax — all implemented from first principles. The training loop runs 10,000 steps with cosine learning rate decay and epoch-level data shuffling for better convergence.

## Running in the Browser

After training, I export the model weights as JSON and load them into a JavaScript inference engine. The browser-side code mirrors the Python forward pass exactly — same matrix-vector multiplications, same RMSNorm, same attention mechanism.

This means:
- **No server needed** — the model runs on your device
- **No API calls** — instant generation
- **Privacy** — nothing leaves your browser

## Interactive Visualizations

The frontend isn't just a name generator. It's a full interactive walkthrough of how Transformers work:

1. **Name Cloud** — Browse all 2,170 training names floating in space
2. **Tokenization** — Watch how Devanagari text decomposes into NFD characters
3. **Embedding Space** — Explore the 16-dimensional token and position embeddings as color-coded vectors
4. **Attention Pipeline** — See the full Q/K/V computation: query and key vectors, attention weights across all 4 heads, value aggregation, and the final output projection
5. **Loss & Gradients** — Per-position predictions with cross-entropy loss and gradient flow visualization
6. **Training Replay** — Animated loss curve you can replay step-by-step over 10,000 training iterations
7. **Name Generator** — Generate names with a temperature slider and inspect the step-by-step token selection

Every visualization is built with React, canvas, and CSS — no chart libraries.

## Learn: 11 Chapters on Transformers From First Principles

The latest addition is a full **Learn** section — 11 interactive chapters that teach every concept used in the project, from scratch:

1. **What is a Language Model?** — Predicting the next character
2. **Tokenization & Unicode NFD** — Breaking Devanagari into atomic building blocks
3. **Embeddings** — Turning token IDs into numerical vectors
4. **RMSNorm** — Keeping numbers in a healthy range
5. **Self-Attention** — How each character "looks at" previous characters
6. **Residual Connections** — Skip connections that preserve gradient flow
7. **Feed-Forward Network (MLP)** — The "thinking" layer after attention
8. **Softmax & Cross-Entropy Loss** — Probabilities and measuring error
9. **Backpropagation & Autograd** — The chain rule, implemented by hand
10. **Adam Optimizer** — Momentum + adaptive learning rates
11. **Temperature & Sampling** — Controlling creativity during generation

Each chapter includes plain-English explanations, ASCII diagrams, real code snippets from the project, key takeaways, and further reading links. No prerequisites beyond basic programming.

## The Design: Bauhaus

The UI follows the [Bauhaus design system](https://www.designprompts.dev/bauhaus):
- **Primary colors** — Red (#D02020), Blue (#1040C0), Yellow (#F0C020)
- **Hard offset shadows** — No gradients, no blur
- **Thick black borders** — Geometric purity
- **Outfit font** — Clean, functional typography

The aesthetic choice mirrors the project's philosophy: strip away the unnecessary, reveal the structure.

## Tech Stack

| Layer | Technology |
|---|---|
| Training | Pure Python (custom autograd, ~400 LOC) |
| Frontend | React 19 + Vite 6 + Tailwind CSS 4 |
| Design | Bauhaus system |
| Inference | Vanilla JavaScript (in-browser) |
| Deploy | Vercel (auto-deploy from GitHub) |
| CI | GitHub Actions (build verification) |

**Zero ML dependencies. Zero backend. Zero API keys.**

## What I Learned

1. **Backpropagation is just the chain rule** — once you implement it manually, the magic disappears and understanding replaces it.
2. **Unicode is deep** — Devanagari NFD decomposition taught me more about text encoding than any tutorial.
3. **Small models can be expressive** — 5,400 parameters is enough to learn phonotactic patterns of an entire language's naming conventions.
4. **The browser is powerful** — Running a full Transformer forward pass in JavaScript with no WASM or WebGL is fast enough for interactive use.
5. **Cosine decay beats linear decay** — Switching from linear to cosine learning rate scheduling with 10× more steps noticeably improved generation quality.
6. **Data shuffling matters** — Even for a tiny model, randomly shuffling the dataset each epoch produces better generalization than cycling sequentially.

## Try It Yourself

**[Live Demo →](https://in-naamgpt.vercel.app)**

**[Source Code →](https://github.com/RaikaSurendra/in-naamgpt)**

Generate a name. Explore the attention weights. Replay the training. See how 5,400 numbers can learn to dream in Devanagari.

---

## Credits & Attribution

This project stands on the shoulders of:

- **[Andrej Karpathy](https://github.com/karpathy)** — [microGPT](https://github.com/karpathy/microGPT) ([blog post](https://karpathy.github.io/2026/02/12/microgpt/)) — the original character-level GPT implementation that started it all
- **[woduq1414](https://github.com/woduq1414)** — [ko-microgpt](https://github.com/woduq1414/ko-microgpt) — Korean name generation adaptation with the interactive chapter-based visualization concept that directly inspired this project's frontend

in-naamGPT is a Hindi/Sanskrit adaptation that builds on their work with Devanagari Unicode handling, NFD tokenization, and Bauhaus-styled interactive visualizations.

---

**Tags:** #MachineLearning #GPT #Transformer #Python #FromScratch #Hindi #Sanskrit #React #WebDev #AI
