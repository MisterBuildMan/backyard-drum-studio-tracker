# Design System: Backyard Drum Studio Tracker

This document defines the visual design guidelines for generating the project tracking website. Follow these patterns exactly when generating HTML and CSS.

## Brand & Aesthetic

- **Style**: Hand-drawn, sketchy, architectural blueprint aesthetic
- **Tone**: Clean, technical, DIY maker vibe
- **Feel**: Like notes on graph paper or an architect's sketch
- **Color Scheme**: Black and white / grayscale only - NO colors

## Key Visual Elements

1. **Single hand-drawn font** - Use "Architects Daughter" for everything (headers and body)
2. **Rough borders** - Slightly wobbly, imperfect edges
3. **Clean white background** - Simple off-white, minimal texture
4. **NO emojis** - Use simple text characters only (bullets, dashes, arrows)
5. **Soft shadows** - Like paper lifted off a surface

## Colors (Black & White Only)

```css
:root {
  /* Background - clean white/off-white */
  --color-bg: #fafafa;
  --color-surface: #ffffff;
  --color-surface-alt: #f0f0f0;
  
  /* Text - black and grays */
  --color-text: #1a1a1a;
  --color-text-muted: #666666;
  
  /* Accent colors - all black/gray */
  --color-primary: #1a1a1a;
  --color-secondary: #333333;
  --color-accent: #444444;
  
  /* Status - grayscale */
  --color-complete: #1a1a1a;
  --color-in-progress: #666666;
  --color-not-started: #aaaaaa;
  
  /* Borders - pencil gray */
  --color-border: #d0d0d0;
  --color-border-dark: #555555;
}
```

## Typography

Use Google Fonts to load the hand-drawn style font (single font for consistency):

```html
<link href="https://fonts.googleapis.com/css2?family=Architects+Daughter&display=swap" rel="stylesheet">
```

```css
body {
  font-family: 'Architects Daughter', cursive, sans-serif;
  font-size: 18px;
  line-height: 1.6;
  color: var(--color-text);
  background: var(--color-bg);
}

h1, h2, h3, h4 {
  font-family: 'Architects Daughter', cursive;
  font-weight: 400;
  margin-top: 0;
}

h1 { font-size: 3rem; }
h2 { font-size: 2.25rem; margin-bottom: 1rem; }
h3 { font-size: 1.75rem; }
h4 { font-size: 1.4rem; }
```

## Important Rules

### NO EMOJIS
Do not use any emojis in the generated HTML. Use simple text characters instead:
- For completed items: use `•` (bullet)
- For pending items: use `·` (middle dot)
- For in-progress items: use `~` (tilde)
- For arrows/next: use `>` (greater than)
- For section headers: just use plain text, no icons

### Grayscale Status Indicators
All status colors must be grayscale:
- Complete: dark black (#1a1a1a)
- In Progress: medium gray (#666666)
- Not Started: light gray (#aaaaaa)

## Sketch-Style Effects

### Hand-drawn borders

```css
.sketch-border {
  border: 2px solid var(--color-border-dark);
  border-radius: 8px 4px 12px 6px; /* Irregular corners */
  box-shadow: 
    2px 2px 0 var(--color-border),
    4px 4px 0 rgba(0,0,0,0.05);
  background: var(--color-surface);
  padding: 1.5rem;
}
```

### Paper texture background (subtle)

```css
body {
  background-color: var(--color-bg);
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(0,0,0,0.02) 1px, transparent 1px),
    radial-gradient(circle at 75% 75%, rgba(0,0,0,0.02) 1px, transparent 1px);
  background-size: 20px 20px;
}
```

## Components

### Navigation

```html
<nav class="nav">
  <div class="nav-brand">Backyard Drum Studio</div>
  <ul class="nav-links">
    <li><a href="index.html">Home</a></li>
    <li><a href="phases.html">Phases</a></li>
    <li><a href="progress.html">Progress</a></li>
    <li><a href="glossary.html">Glossary</a></li>
  </ul>
</nav>
```

```css
.nav {
  background: var(--color-surface);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3px solid var(--color-border-dark);
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-brand {
  font-family: 'Architects Daughter', cursive;
  font-size: 1.75rem;
  font-weight: 400;
  color: var(--color-primary);
}

.nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-links a {
  color: var(--color-text);
  text-decoration: none;
  font-size: 1.1rem;
  padding: 0.25rem 0;
  border-bottom: 2px dashed transparent;
}

.nav-links a:hover,
.nav-links a.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}
```

### Progress Bar (grayscale)

```html
<div class="progress-bar">
  <div class="progress-fill" style="width: 35%"></div>
  <span class="progress-label">35%</span>
</div>
```

```css
.progress-bar {
  background: var(--color-surface);
  border: 2px solid var(--color-border-dark);
  border-radius: 20px 15px 25px 18px;
  height: 28px;
  position: relative;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.progress-bar.large {
  height: 36px;
}

.progress-fill {
  background: linear-gradient(90deg, #333333, #555555);
  height: 100%;
  border-radius: 18px 12px 20px 15px;
  transition: width 0.3s ease;
}

.progress-label {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-weight: 600;
  font-size: 0.9rem;
}
```

### Phase Card (grayscale status)

```html
<div class="phase-card phase-card--in-progress">
  <div class="phase-header">
    <span class="phase-number">Phase 1</span>
    <span class="phase-status">In Progress</span>
  </div>
  <h3 class="phase-title">Planning & Permits</h3>
  <p class="phase-description">Research zoning, obtain permits, finalize plans.</p>
  <div class="progress-bar">
    <div class="progress-fill" style="width: 60%"></div>
  </div>
</div>
```

```css
.phase-card {
  background: var(--color-surface);
  border: 2px solid var(--color-border-dark);
  border-radius: 8px 4px 12px 6px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 3px 3px 0 var(--color-border);
  transform: rotate(-0.2deg);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.phase-card:nth-child(even) {
  transform: rotate(0.3deg);
}

.phase-card:hover {
  transform: rotate(0deg) translateY(-2px);
  box-shadow: 5px 5px 0 var(--color-border);
}

.phase-card--complete {
  border-left: 5px solid var(--color-complete);
}

.phase-card--in-progress {
  border-left: 5px solid var(--color-in-progress);
}

.phase-card--not-started {
  border-left: 5px solid var(--color-not-started);
}

.phase-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.phase-number {
  font-family: 'Architects Daughter', cursive;
  font-size: 1.1rem;
  color: var(--color-text-muted);
}

.phase-status {
  font-size: 0.8rem;
  padding: 0.2rem 0.6rem;
  border-radius: 12px 8px 14px 10px;
  font-weight: 600;
  border: 1px dashed;
}

.phase-card--complete .phase-status {
  background: #e8e8e8;
  color: var(--color-complete);
  border-color: var(--color-complete);
}

.phase-card--in-progress .phase-status {
  background: #f0f0f0;
  color: var(--color-in-progress);
  border-color: var(--color-in-progress);
}

.phase-card--not-started .phase-status {
  background: #f5f5f5;
  color: var(--color-not-started);
  border-color: var(--color-not-started);
}

.phase-title {
  margin: 0.5rem 0;
}

.phase-description {
  color: var(--color-text-muted);
  margin-bottom: 1rem;
}
```

### Changelog Entry (no emojis)

```html
<div class="changelog-entry">
  <div class="changelog-date">January 20, 2026</div>
  <ul class="changelog-items">
    <li class="changelog-item changelog-item--completed">
      <span class="changelog-marker">•</span>
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
  margin-bottom: 2rem;
  padding-left: 1rem;
  border-left: 3px dashed var(--color-border-dark);
}

.changelog-date {
  font-family: 'Architects Daughter', cursive;
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--color-primary);
  margin-bottom: 0.75rem;
}

.changelog-items {
  list-style: none;
  padding: 0;
  margin: 0;
}

.changelog-item {
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 6px 3px 8px 4px;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.changelog-marker {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
}

.changelog-item--completed .changelog-marker {
  color: var(--color-complete);
}

.changelog-item--started .changelog-marker {
  color: var(--color-in-progress);
}

.changelog-content {
  flex: 1;
}

.changelog-content strong {
  display: block;
  margin-bottom: 0.25rem;
}

.changelog-notes {
  color: var(--color-text-muted);
  font-size: 0.9rem;
  margin: 0.25rem 0 0 0;
}
```

### Task Lists

```html
<ul class="task-list">
  <li class="task-item task-item--complete">
    <span class="task-marker">•</span>
    <span>Completed task</span>
  </li>
  <li class="task-item task-item--in-progress">
    <span class="task-marker">~</span>
    <span>In progress task</span>
  </li>
  <li class="task-item task-item--pending">
    <span class="task-marker">·</span>
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
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px dashed var(--color-border);
}

.task-item:last-child {
  border-bottom: none;
}

.task-marker {
  font-size: 1.1rem;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
}

.task-item--complete .task-marker {
  color: var(--color-complete);
}

.task-item--in-progress .task-marker {
  color: var(--color-in-progress);
}

.task-item--pending .task-marker {
  color: var(--color-not-started);
}

.sub-task {
  padding-left: 1rem;
  color: var(--color-text-muted);
}
```

### Glossary Term (no emojis)

```html
<div class="glossary-term">
  <dt class="glossary-term-name">STC (Sound Transmission Class)</dt>
  <dd class="glossary-term-def">A rating of how well a building partition attenuates airborne sound.</dd>
</div>
```

```css
.glossary-term {
  padding: 1rem 1.25rem;
  margin-bottom: 0.75rem;
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: 6px 10px 4px 8px;
  transform: rotate(-0.15deg);
}

.glossary-term:nth-child(even) {
  transform: rotate(0.15deg);
}

.glossary-term-name {
  font-family: 'Architects Daughter', cursive;
  font-size: 1.4rem;
  font-weight: 400;
  color: var(--color-primary);
  margin-bottom: 0.25rem;
}

.glossary-term-def {
  color: var(--color-text-muted);
  margin: 0;
  padding-left: 1.5rem;
}
```

### Footer (no emojis)

```html
<footer class="footer">
  <p>Backyard Drum Studio Project Tracker</p>
  <p class="footer-updated">Last updated: January 24, 2026</p>
</footer>
```

```css
.footer {
  background: var(--color-surface);
  border-top: 3px dashed var(--color-border-dark);
  text-align: center;
  padding: 2rem;
  margin-top: 4rem;
}

.footer p {
  font-family: 'Architects Daughter', cursive;
  font-size: 1.25rem;
  margin: 0.25rem 0;
}

.footer-updated {
  color: var(--color-text-muted);
  font-size: 1rem !important;
}
```

## Layout

```css
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.section {
  margin-bottom: 3rem;
}

.section-intro {
  font-size: 1.2rem;
  color: var(--color-text-muted);
  margin-bottom: 2rem;
}

.phase-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.stat-card {
  background: var(--color-surface);
  border: 2px solid var(--color-border-dark);
  border-radius: 10px 6px 14px 8px;
  padding: 1.25rem;
  text-align: center;
  box-shadow: 2px 2px 0 var(--color-border);
}

.stat-value {
  font-family: 'Architects Daughter', cursive;
  font-size: 2.5rem;
  font-weight: 400;
  color: var(--color-primary);
}

.stat-label {
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.quick-ref-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.quick-ref-card h3 {
  margin-top: 0;
  color: var(--color-primary);
}

.quick-ref-card ul {
  margin-bottom: 0;
  padding-left: 0;
  list-style: none;
}

.quick-ref-card li {
  padding: 0.25rem 0;
  border-bottom: 1px dashed var(--color-border);
}

.quick-ref-card li:last-child {
  border-bottom: none;
}
```

## Responsive Design

```css
@media (max-width: 768px) {
  .nav {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }
  
  h1 { font-size: 2.25rem; }
  h2 { font-size: 1.75rem; }
  
  .phase-cards {
    grid-template-columns: 1fr;
  }
  
  .container {
    padding: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .quick-ref-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-value {
    font-size: 2rem;
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
- Include the Google Fonts link in the head (Architects Daughter only)
- Link to styles.css
- Include the navigation and footer
- Use the hand-drawn aesthetic throughout
- Be responsive and accessible
- Use NO emojis - only simple text characters
- Use grayscale colors only - no colored accents
