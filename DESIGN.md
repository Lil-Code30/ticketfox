
# 🧠 TicketFox — Design System

A calm, structured, developer-first design system for **TicketFox**, an IT Knowledge Operating System built around a Notion-style block editor, incident documentation, and future AI agent capabilities (RAG, MCP, LangGraph).

This system prioritizes clarity, trust, and productivity over visual noise.

---

# 1. Design Goals

TicketFox is not a SaaS dashboard.

It is a:

> **Knowledge OS for IT Support Engineers**

### Core goals

* Make knowledge fast to capture
* Make knowledge easy to retrieve
* Make incidents structured, not messy
* Prepare UI for future AI + MCP integration
* Support block-based editing (Notion-like)

---

# 2. Brand Identity

## Name

**TicketFox**

---

## Mascot

A minimal intelligent fox.

### Meaning

* 🦊 Fox = problem solving, intelligence, speed
* 🧠 IT support = debugging + reasoning
* ⚡ Fast incident resolution

---

## Mascot Style

### Design rules

* Flat / geometric (NOT cartoonish)
* Slightly sharp edges (intelligence, precision)
* No childish expressions
* Optional headset variant for “support mode”

---

## Mascot Colors

```css
--fox-primary: #F97316;   /* orange */
--fox-dark: #111827;      /* charcoal */
--fox-light: #F9FAFB;     /* background */
--fox-muted: #6B7280;
```

---

## Personality

* Helpful, not chatty
* Fast responder
* Calm under pressure
* Technical but friendly

---

# 3. Visual Design Principles

### Core direction

* Calm enterprise UI
* Developer-first clarity
* Notion + Linear hybrid
* No flashy AI aesthetics

---

### Keywords

* Structured clarity
* Operational UI
* Calm precision
* Engineering-grade interface

---

### Avoid

* Neon gradients
* Glassmorphism
* Over-animated cards
* Cute mascots everywhere
* Overdecorated dashboards

---

# 4. Color System

## Light Mode (default)

```css
:root {
  --color-bg: #f7f6f2;
  --color-surface: #fbfaf7;
  --color-surface-2: #f2efe9;
  --color-border: #d8d2c8;

  --color-text: #201d18;
  --color-text-muted: #6f6a61;
  --color-text-faint: #9f988d;

  --color-primary: #F97316;
  --color-primary-hover: #ea580c;
  --color-primary-soft: #ffedd5;

  --color-inverse: #ffffff;
}
```

---

## Dark Mode

```css
[data-theme="dark"] {
  --color-bg: #0f1115;
  --color-surface: #161a22;
  --color-surface-2: #1c2230;
  --color-border: #2a3441;

  --color-text: #e6e6e6;
  --color-text-muted: #9aa4b2;
  --color-text-faint: #6b7280;

  --color-primary: #fb923c;
  --color-primary-hover: #f97316;
  --color-primary-soft: #2a1f16;

  --color-inverse: #0b0d10;
}
```

---

# 5. Typography

## Fonts

* UI: Inter
* Headings: Inter SemiBold
* Code: JetBrains Mono

---

## Scale

```css
:root {
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-md: 1.125rem;
  --text-lg: 1.5rem;
  --text-xl: 2.25rem;
  --text-2xl: 3rem;
}
```

---

## Rules

* 16px minimum body text
* Strong hierarchy > decorative text
* Headings short and technical
* Paragraphs max 2–3 lines in UI sections

---

# 6. Layout System

## Container widths

```css
--content-narrow: 720px;
--content-default: 1040px;
--content-wide: 1200px;
```

---

## App layout structure

```txt
┌──────────────────────────────┐
│ Sidebar  │ Main Content     │
│          │                  │
│ Nav      │ Dashboard       │
│ Knowledge│ Block Editor     │
│ Tags     │ Knowledge View   │
│ Files    │ Settings         │
└──────────────────────────────┘
```

---

## Layout principles

* Left-aligned UI
* Single-column editing experience (Notion style)
* Wide reading mode for knowledge view
* Minimal visual density

---

# 7. Spacing System

```css
:root {
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-24: 6rem;
}
```

---

# 8. Core UI Components

---

## 8.1 Sidebar

* Sticky left navigation
* Icons + labels
* Collapsible mode

Sections:

* Dashboard
* Knowledge
* Incidents
* Documentation
* Tags
* Categories
* Files

---

## 8.2 Dashboard

Purpose:

> Operational overview of knowledge system

Cards:

* Total Knowledge
* Incidents
* Documentation
* Recent updates

---

## 8.3 Knowledge Table

```txt
Title | Type | Category | Tags | Updated
```

Filters:

* Type
* Category
* Tags
* Search

---

## 8.4 Block Editor (Core System)

Notion-style editor:

* Drag & drop blocks
* Inline editing
* Slash commands (future)
* Auto-save (future)

---

## 8.5 Block Types

* Paragraph
* Heading
* Step
* Image
* Code (future)
* Warning (future)

---

# 9. Block Design System

## Block behavior

Each block is:

* Editable
* Reorderable
* Independent
* Auto-saved

---

## Block visual style

```css
.block {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 14px 16px;
}
```

---

## Block interaction rules

* Hover → subtle border highlight
* Drag handle appears on hover
* Enter → new block
* Backspace empty → delete block

---

# 10. Buttons

## Primary

* Fox orange
* Used for actions

## Secondary

* Neutral border
* Soft background

## Link

* Text-based
* Used for navigation

---

# 11. Icons

* Lucide icons only
* Thin stroke
* Neutral color
* No filled icons except active states

---

# 12. Motion System

* Subtle transitions only
* No heavy animations

```css
--duration-fast: 160ms;
--duration-base: 220ms;
--ease-standard: cubic-bezier(0.16, 1, 0.3, 1);
```

---

## Allowed motion

* Fade in
* Soft slide up (2–4px)
* Border color transitions
* Hover elevation (very subtle)

---

## Forbidden motion

* Floating elements
* Gradient animation
* Parallax backgrounds
* AI “glow effects”

---

# 13. Content Style

TicketFox UI copy should be:

* Technical
* Direct
* Minimal
* Action-oriented

---

## Good examples

* “Create incident”
* “Add troubleshooting step”
* “View related documentation”

---

## Bad examples

* “Unlock the power of AI”
* “Revolutionize your workflow”
* “Smart assistant powered by intelligence”

---

# 14. Knowledge Structure UI

Each knowledge entry:

```txt
Title
Type
Category
Tags
Blocks
Files
```

---

# 15. Empty States

Must include:

* Fox mascot icon (minimal)
* Short message

Example:

> “No incidents found. Create your first troubleshooting entry.”

---

# 16. Accessibility

* WCAG AA minimum
* Keyboard navigation
* Focus ring visible
* 44px minimum touch targets
* Semantic HTML only

---

# 17. Future AI Compatibility (IMPORTANT)

Design must support:

* RAG search
* MCP tools
* LangGraph agent
* Block-level retrieval

Each block must remain:

```txt
independent + structured + queryable
```

---

# 18. Product Personality Summary

TicketFox is:

> A calm, structured, fox-powered knowledge OS for IT support teams.

It feels like:

* Notion (structure)
* Linear (clarity)
* Stripe (discipline)
* Obsidian (knowledge depth)

---

# 19. Final Design Philosophy

> “Every incident is knowledge. Every knowledge is structured. Every structure is reusable.”

---