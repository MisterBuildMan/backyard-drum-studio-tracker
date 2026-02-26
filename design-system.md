# Design System: Backyard Drum Studio Tracker

This document defines the visual design guidelines for generating the project tracking website. Follow these patterns exactly when generating HTML and CSS.

## Brand & Aesthetic

- **Style**: Dark, minimal, editorial — like a well-designed portfolio or architecture journal
- **Tone**: Quiet confidence, clean, professional
- **Feel**: Like reading a beautifully typeset document in a dark room
- **Color Scheme**: Dark background with light text — monochromatic with subtle warm accents

## Key Visual Elements

1. **Clean sans-serif font** — Use "Inter" for body and a serif like "Playfair Display" for headings
2. **No borders or boxes** — Use whitespace and subtle dividers instead
3. **Dark background** — Near-black with warm undertone
4. **NO emojis** — Use simple text characters only (bullets, dashes, arrows)
5. **Generous spacing** — Let content breathe, lots of vertical rhythm

## Colors

```css
:root {
  --color-bg: #111111;
  --color-surface: #1a1a1a;
  --color-surface-alt: #222222;

  --color-text: #e8e8e8;
  --color-text-muted: #888888;
  --color-text-dim: #555555;

  --color-primary: #e8e8e8;
  --color-accent: #c8c8c8;

  --color-complete: #e8e8e8;
  --color-in-progress: #888888;
  --color-not-started: #444444;

  --color-border: #2a2a2a;
  --color-border-light: #333333;
}
```

## Typography

Use Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
```

```css
body {
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 16px;
  font-weight: 300;
  line-height: 1.8;
  color: var(--color-text);
  background: var(--color-bg);
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3 {
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 400;
  margin-top: 0;
  letter-spacing: -0.01em;
  line-height: 1.2;
}

h4 {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin-top: 0;
}

h1 { font-size: 3.5rem; margin-bottom: 1.5rem; }
h2 { font-size: 2rem; margin-bottom: 1.5rem; }
h3 { font-size: 1.5rem; }
```

## Important Rules

### NO EMOJIS
Do not use any emojis in the generated HTML. Use simple text characters instead:
- For completed items: use a filled circle character or dash
- For pending items: use a hollow circle or middle dot
- For in-progress items: use a tilde or dash
- For section headers: just use plain text, no icons

### Monochromatic Status Indicators
All status colors must be within the dark palette:
- Complete: bright white/light gray (#e8e8e8)
- In Progress: medium gray (#888888)
- Not Started: dark gray (#444444)

## Components

### Navigation

```html
<nav class="nav">
  <div class="nav-brand">backyard drum studio</div>
  <ul class="nav-links">
    <li><a href="index.html">home</a></li>
    <li><a href="phases.html">phases</a></li>
    <li><a href="progress.html">progress</a></li>
    <li><a href="glossary.html">glossary</a></li>
  </ul>
</nav>
```

```css
.nav {
  padding: 2rem 0;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  max-width: 960px;
  margin: 0 auto;
  padding-left: 2rem;
  padding-right: 2rem;
}

.nav-brand {
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: lowercase;
  color: var(--color-text);
}

.nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-links a {
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  transition: color 0.2s;
}

.nav-links a:hover,
.nav-links a.active {
  color: var(--color-text);
}
```

### Progress Bar

```html
<div class="progress-bar">
  <div class="progress-fill" style="width: 35%"></div>
</div>
<span class="progress-label">35%</span>
```

```css
.progress-bar {
  background: var(--color-border);
  height: 3px;
  position: relative;
  margin-bottom: 0.5rem;
}

.progress-fill {
  background: var(--color-text);
  height: 100%;
  transition: width 0.3s ease;
}

.progress-bar.large {
  height: 4px;
}

.progress-label {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  font-weight: 400;
}
```

### Phase Card

```html
<div class="phase-card phase-card--in-progress">
  <div class="phase-header">
    <span class="phase-number">01</span>
    <span class="phase-status">in progress</span>
  </div>
  <h3 class="phase-title">Planning & Permits</h3>
  <p class="phase-description">Research zoning, obtain permits, finalize plans.</p>
  <div class="progress-bar">
    <div class="progress-fill" style="width: 60%"></div>
  </div>
  <span class="progress-label">60%</span>
</div>
```

```css
.phase-card {
  padding: 2rem 0;
  border-bottom: 1px solid var(--color-border);
}

.phase-card:last-child {
  border-bottom: none;
}

.phase-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.75rem;
}

.phase-number {
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  color: var(--color-text-dim);
  letter-spacing: 0.05em;
}

.phase-status {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: lowercase;
}

.phase-card--complete .phase-status { color: var(--color-complete); }
.phase-card--in-progress .phase-status { color: var(--color-in-progress); }
.phase-card--not-started .phase-status { color: var(--color-not-started); }

.phase-title {
  margin: 0 0 0.5rem 0;
}

.phase-description {
  color: var(--color-text-muted);
  margin-bottom: 1.5rem;
  max-width: 600px;
}
```

### Changelog Entry

```html
<div class="changelog-entry">
  <div class="changelog-date">January 20, 2026</div>
  <ul class="changelog-items">
    <li class="changelog-item">
      <div class="changelog-content">
        <strong>Submitted permit application</strong>
        <p class="changelog-notes">Optional notes here</p>
      </div>
    </li>
  </ul>
</div>
```

```css
.changelog-entry {
  margin-bottom: 3rem;
}

.changelog-date {
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.changelog-items {
  list-style: none;
  padding: 0;
  margin: 0;
}

.changelog-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border);
}

.changelog-item:last-child {
  border-bottom: none;
}

.changelog-content strong {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 400;
  color: var(--color-text);
}

.changelog-notes {
  color: var(--color-text-muted);
  font-size: 0.9rem;
  margin: 0.25rem 0 0 0;
  line-height: 1.6;
}
```

### Task Lists

```html
<ul class="task-list">
  <li class="task-item task-item--complete">
    <span class="task-marker">-</span>
    <span>Completed task</span>
  </li>
  <li class="task-item task-item--in-progress">
    <span class="task-marker">~</span>
    <span>In progress task</span>
  </li>
  <li class="task-item task-item--pending">
    <span class="task-marker">-</span>
    <span>Pending task</span>
  </li>
</ul>
```

```css
.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-item {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  padding: 0.4rem 0;
  font-size: 0.95rem;
}

.task-marker {
  width: 16px;
  text-align: center;
  flex-shrink: 0;
  font-size: 0.85rem;
}

.task-item--complete { color: var(--color-text); }
.task-item--complete .task-marker { color: var(--color-complete); }
.task-item--in-progress { color: var(--color-text-muted); }
.task-item--in-progress .task-marker { color: var(--color-in-progress); }
.task-item--pending { color: var(--color-text-dim); }
.task-item--pending .task-marker { color: var(--color-not-started); }
```

### Glossary Term

```html
<div class="glossary-term">
  <dt class="glossary-term-name">STC (Sound Transmission Class)</dt>
  <dd class="glossary-term-def">A rating of how well a building partition attenuates airborne sound.</dd>
</div>
```

```css
.glossary-term {
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--color-border);
}

.glossary-term:last-child {
  border-bottom: none;
}

.glossary-term-name {
  font-family: 'Playfair Display', serif;
  font-size: 1.2rem;
  font-weight: 400;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.glossary-term-def {
  color: var(--color-text-muted);
  margin: 0;
  line-height: 1.7;
  max-width: 600px;
}
```

### Stats

```css
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.stat-card {
  text-align: left;
}

.stat-value {
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  font-weight: 400;
  color: var(--color-text);
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  color: var(--color-text-muted);
  font-size: 0.8rem;
  letter-spacing: 0.05em;
}
```

### Footer

```html
<footer class="footer">
  <p>backyard drum studio</p>
  <p class="footer-updated">Last updated: January 24, 2026</p>
</footer>
```

```css
.footer {
  border-top: 1px solid var(--color-border);
  padding: 3rem 0;
  margin-top: 6rem;
  max-width: 960px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 2rem;
  padding-right: 2rem;
}

.footer p {
  font-size: 0.8rem;
  color: var(--color-text-dim);
  margin: 0.25rem 0;
  letter-spacing: 0.05em;
}

.footer-updated {
  color: var(--color-text-dim);
}
```

## Layout

```css
.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem;
}

.section {
  margin-bottom: 4rem;
}

.section-intro {
  font-size: 1.1rem;
  color: var(--color-text-muted);
  margin-bottom: 2.5rem;
  max-width: 600px;
  line-height: 1.8;
}

.divider {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 3rem 0;
}

.info-block {
  padding: 2rem 0;
  border-top: 1px solid var(--color-border);
}

.info-block p {
  margin: 0.25rem 0;
  color: var(--color-text-muted);
}

.info-block strong {
  color: var(--color-text);
  font-weight: 400;
}

.quick-ref-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
}

.quick-ref-card h3 {
  margin-top: 0;
  font-size: 1.1rem;
}

.quick-ref-card ul {
  margin-bottom: 0;
  padding-left: 0;
  list-style: none;
}

.quick-ref-card li {
  padding: 0.3rem 0;
  color: var(--color-text-muted);
  font-size: 0.95rem;
}
```

## Responsive Design

```css
@media (max-width: 768px) {
  .nav {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .nav-links {
    gap: 1.25rem;
  }

  h1 { font-size: 2.5rem; }
  h2 { font-size: 1.5rem; }

  .container {
    padding: 1.5rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  .stat-value {
    font-size: 2.25rem;
  }

  .quick-ref-grid {
    grid-template-columns: 1fr;
  }
}
```

## Output Format

When generating the site, return a JSON object with this exact structure (no markdown code blocks, just raw JSON):

```json
{
  "files": [
    { "path": "index.html", "content": "<!DOCTYPE html>..." },
    { "path": "phases.html", "content": "<!DOCTYPE html>..." },
    { "path": "progress.html", "content": "<!DOCTYPE html>..." },
    { "path": "glossary.html", "content": "<!DOCTYPE html>..." },
    { "path": "styles.css", "content": ":root { ... }" }
  ]
}
```

Each HTML file should:
- Be complete, valid HTML5
- Include the Google Fonts link in the head (Inter + Playfair Display)
- Link to styles.css
- Include the navigation and footer
- Use the dark, minimal aesthetic throughout
- Be responsive and accessible
- Use NO emojis - only simple text characters
- Use the dark color palette - no bright colored accents
- Use lowercase text for nav links, status labels, and brand name
- Favor whitespace and thin dividers over boxes and borders
