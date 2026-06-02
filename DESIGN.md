---
name: Eric Furspan — Portfolio
description: Personal portfolio for a full stack engineer. Dark terminal aesthetic with a single cold-blue accent.
colors:
  bg: "#0a0a0a"
  card-surface: "#0d0d0f"
  accent: "#38bdf8"
  text-primary: "#e0e0e0"
  text-mid: "#aaaaaa"
  text-low: "#888888"
  border-subtle: "rgba(255,255,255,0.07)"
  border-accent: "rgba(56,189,248,0.12)"
typography:
  display:
    fontFamily: "'Bebas Neue', sans-serif"
    fontSize: "50px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.02em"
  title:
    fontFamily: "'JetBrains Mono', monospace"
    fontSize: "30px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "normal"
  body:
    fontFamily: "'Inter', sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.8
    letterSpacing: "normal"
  label:
    fontFamily: "'JetBrains Mono', monospace"
    fontSize: "10px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.16em"
  mono:
    fontFamily: "'JetBrains Mono', monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.9
    letterSpacing: "normal"
rounded:
  none: "0px"
spacing:
  xs: "5px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  ext-link:
    backgroundColor: "transparent"
    textColor: "{colors.text-mid}"
    rounded: "{rounded.none}"
    padding: "7px 13px"
  ext-link-hover:
    textColor: "{colors.accent}"
  skill-pill:
    backgroundColor: "rgba(255,255,255,0.03)"
    textColor: "{colors.text-low}"
    rounded: "{rounded.none}"
    padding: "3px 9px"
  skill-pill-hover:
    textColor: "{colors.accent}"
  cert-pill:
    backgroundColor: "rgba(56,189,248,0.04)"
    textColor: "{colors.accent}"
    rounded: "{rounded.none}"
    padding: "4px 11px"
  cert-pill-hover:
    backgroundColor: "rgba(56,189,248,0.09)"
  card:
    backgroundColor: "{colors.card-surface}"
    rounded: "{rounded.none}"
    padding: "32px 36px 28px"
---

# Design System: Eric Furspan — Portfolio

## 1. Overview

**Creative North Star: "Functional Residue"**

This system was not designed around a concept. It emerged from a series of functional decisions — use a dark background because it reduces glare, use a monospaced font because it's native to the work, use one accent because one is enough — and the aesthetic is what's left after those decisions compound. That's its character: not minimalism as a stance, but minimalism as a consequence.

The result reads like a terminal you'd actually use. Not terminal-as-costume: no scanline overlays, no fake typing effects, no green-on-black nostalgia. The grid is there because a grid is structurally useful. The mono is primary because the person who built this lives in mono. The accent fires only where information is being communicated — a live link, a category, a hover state. Everywhere else, it holds.

What this system explicitly rejects: SaaS landing-page conventions (hero metrics, gradient cards, buzzword copy), over-animated portfolios (parallax, cursor effects, particle fields), warm-neutral palettes applied for "warmth," and decorative elements that earn their place only by looking designed.

**Key Characteristics:**
- Square everywhere — no border radius at any scale
- JetBrains Mono as the primary voice; Inter only for prose; Bebas Neue only for the name
- Accent (#38bdf8) used structurally, never decoratively
- Text hierarchy built from opacity and weight, not hue
- Motion is state-driven — it communicates change, it doesn't perform
- Density is high; white space is earned, not defaulted

## 2. Colors: The Cold Signal Palette

One background, one surface, one accent, one text ramp. The palette is minimal by emergence, not by doctrine — every color present because something needed it.

### Primary
- **Cold Signal** (#38bdf8): The single active-state color. Used for accent borders, category labels, hover states, cert pills, and the caret in the tagline. Its rarity is the point: when this blue appears, it means something is live, interactive, or classified. Never used as background fill. Never used decoratively.

### Neutral
- **Terminal Black** (#0a0a0a): Page background. Absorbs all ambient light. The card floats against it.
- **Card Surface** (#0d0d0f): The main card background — effectively indistinguishable from the bg at a glance, but distinct enough for the card's edges and glow to read. Applied at 94% opacity.
- **Screen Gray** (#e0e0e0): Primary text. Body-weight information: bio copy, chrome labels. Warm side of neutral.
- **Dim Prompt** (#aaaaaa): Mid-level text. Social links, bold-in-bio phrases, secondary labels. One step back from primary, still clearly readable.
- **Ghost Text** (#888888): Low-prominence text. Skill pills, project names, project descriptions. Recedes without disappearing.
- **Hairline** (rgba(255,255,255,0.07)): Internal dividers and borders. White at 7% opacity — present as structure, invisible as decoration.

### Named Rules
**The One Voice Rule.** Cold Signal (#38bdf8) is the only chromatic color in the system. It may not be introduced as a fill, a gradient component, or a background tint. Its function is signal: label, border, state indicator.

**The Ramp Rule.** Text hierarchy is expressed through Ghost Text → Dim Prompt → Screen Gray alone — no additional text colors, no blues or greens for emphasis. Bold in Inter (--font-prose) is the only in-body emphasis mechanism.

## 3. Typography

**Display Font:** Bebas Neue (sans-serif fallback)
**Body Font:** Inter (sans-serif fallback)
**Mono Font:** JetBrains Mono (monospace fallback)

**Character:** JetBrains Mono carries almost everything — it's the voice of the UI, the labels, the terminal, the links. Bebas Neue appears exactly once, for the name at the top: wide, compressed, display-weight contrast against the mono texture. Inter enters only for the bio paragraph, where prose legibility at 15px matters more than voice consistency.

### Hierarchy
- **Display** (Bebas Neue, 400, 50px, line-height 1, tracking 0.02em): The name. One use only. Uppercase by the typeface's nature, not by CSS transform.
- **Title** (JetBrains Mono, 500, 30px): Expanded project heading. The one other scale step that reads as "headline."
- **Body** (Inter, 400, 15px, line-height 1.8): Bio paragraph only. Max-width 72ch. The only place Inter appears.
- **UI** (JetBrains Mono, 400–500, 12–13px): Project names, social links, chrome labels, terminal lines, tagline. The workhorse size.
- **Label** (JetBrains Mono, 400, 10px, tracking 0.16em, uppercase): Skill category names, cert pills, small badges. Uppercase is intentional here — these are identifiers, not sentences.

### Named Rules
**The Three-Font Cap Rule.** The system uses exactly three typefaces: Bebas Neue (display), JetBrains Mono (mono/UI), Inter (prose). No additions. If something feels like it needs a fourth, it needs to be rethought — the problem is usually hierarchy, not typeface.

**The Mono Default Rule.** JetBrains Mono is the default choice for any new UI element. Inter is for prose blocks of three or more sentences. Bebas Neue is for the name only.

## 4. Elevation

The system uses a hybrid: strong atmospheric elevation at the card level, flat tonal layering within. There are no inline shadows on components; depth inside the card is expressed through background tint and border opacity alone.

### Shadow Vocabulary
- **Card Ambient Glow** (`0 0 0 1px rgba(56,189,248,0.07), 0 0 80px rgba(56,189,248,0.05), 0 24px 64px rgba(0,0,0,0.55)`): The card's outer shadow. Two layers: a diffuse cold-signal ambient that makes the card feel like a lit screen, and a deep black drop shadow that grounds it. This is the only shadow in the system.
- **Expanded Panel** (`border: 1px solid rgba(56,189,248,0.18)`, `background: rgba(8,18,30,0.92)`): The project detail panel uses a cooler, deeper background tint and a stronger accent border to signal elevation over the card body — no shadow, tonal shift only.

### Named Rules
**The Flat Interior Rule.** No shadows inside the card. Elevation within the card is expressed through background tint (card-surface vs. expanded panel at rgba(8,18,30)) and border opacity (Hairline for dividers, border-accent at 0.12–0.18 for containers). If an inner element looks flat, that's correct.

## 5. Components

### Social / Navigation Links (.ext-link)
Sharp, bordered, mono uppercase. Reads as a button but behaves as a link.
- **Shape:** No radius. Square corners throughout.
- **Default:** Background transparent; text Dim Prompt (#aaa); border rgba(255,255,255,0.12); padding 7px 13px.
- **Hover:** Text shifts to Cold Signal (#38bdf8); border shifts to rgba(56,189,248,0.3). Transition 0.18s.
- **Typography:** JetBrains Mono, 13px, letter-spacing 0.08em, uppercase, inline-flex with a 5px icon gap.

### Skill Pills (.sg-pill)
Quiet by default, responsive on hover. Low visual weight; the category label beside them carries the identity.
- **Default:** Background rgba(255,255,255,0.03); text Ghost Text (#888); border rgba(255,255,255,0.06); padding 3px 9px. No radius.
- **Hover:** Text shifts to Cold Signal; border shifts to rgba(56,189,248,0.2). Transition 0.15s.
- **Typography:** JetBrains Mono, 12px.
- **Category label** (.sg-label): 10px, tracking 0.16em, uppercase, Cold Signal. Min-width 68px to align pill groups.

### Certification Pills (.cert-pill)
The only component that starts in the accent color — used for earned credentials, not UI state.
- **Default:** Text Cold Signal; background rgba(56,189,248,0.04); border rgba(56,189,248,0.3); padding 4px 11px. No radius.
- **Hover:** Background rgba(56,189,248,0.09); border rgba(56,189,248,0.5). Transition 0.15s.
- **Typography:** JetBrains Mono, 10px, tracking 0.04em.

### Project Rows (.proj-row)
Flat list items. The arrow indicator (↗) and dot signal interactivity.
- **Default:** Flex row, border-bottom rgba(255,255,255,0.04); padding 10px 0; cursor pointer.
- **Hover:** Project name and arrow shift to Cold Signal; dot background shifts from rgba(56,189,248,0.25) to full accent. Transition 0.15s.
- **Anatomy:** 4px dot → project name (13px, Ghost Text) → stack tags pushed right (10px, Ghost Text, nowrap) → ↗ arrow (10px, dim accent).

### Expanded Project Panel (.proj-exp-inner)
Elevated surface within the card. Tonal shift replaces shadow.
- **Background:** rgba(8,18,30,0.92) — cooler and deeper than card-surface, implying depth.
- **Border:** 1px solid rgba(56,189,248,0.18) — accent border at higher opacity than card border.
- **Padding:** 16px.
- **Title:** Bebas Neue, 30px — the only second appearance of the display typeface.
- **Description:** 12px, Ghost Text (#888), line-height 1.8.
- **Tags:** 10px, Cold Signal, background rgba(56,189,248,0.05), border rgba(56,189,248,0.13), padding 2px 7px.
- **Close button (✕):** Positioned absolute top-right. Cold Signal at 50% opacity, full on hover.

### Main Card (.card)
The primary container. Single surface, no radius, glow-lit.
- **Background:** Card Surface (#0d0d0f at 94% opacity).
- **Border:** 1px solid rgba(56,189,248,0.12).
- **Shadow:** Card Ambient Glow (see Elevation).
- **Entrance:** fadeUp — translateY(16px) → 0, opacity 0 → 1, over 0.45s cubic-bezier(.22,1,.36,1).
- **Max-width:** 1040px, full-width on mobile.

### Chrome Bar (.card-chrome)
Terminal window dressing. Present only when the CLI easter egg is enabled.
- **Background:** #0d0d0d (slightly darker than card surface).
- **Border-bottom:** 1px solid rgba(255,255,255,0.07).
- **Height:** 36px.
- **Traffic lights:** 10px circles at #ff5f57 / #febc2e / #28c840, spaced 6px. Opacity 0.7 on hover.
- **Label:** 11px, #5a8a5a, tracking 0.1em. Muted green — terminal-authentic.

## 6. Do's and Don'ts

### Do:
- **Do** use Cold Signal (#38bdf8) only where something is interactive, live, or being labeled. Its scarcity is load-bearing.
- **Do** keep all corners square. No border-radius at any value, on any element.
- **Do** default new UI text to JetBrains Mono. Use Inter only for prose blocks of three or more sentences.
- **Do** express text hierarchy through Ghost Text → Dim Prompt → Screen Gray. No additional text colors.
- **Do** keep transitions at 0.15–0.18s for hover states. Motion communicates state change, not personality.
- **Do** ensure body text (Inter, 15px, #888 on #0d0d0f) meets 4.5:1 contrast — Ghost Text on dark card is the tightest pair in the system and the one most likely to fail.
- **Do** use `@media (prefers-reduced-motion: reduce)` to instant-switch any transform or opacity animation.

### Don't:
- **Don't** introduce Cold Signal as a background fill, gradient component, or decorative tint. The moment it covers surface area, it loses its signal value.
- **Don't** add a fourth typeface. The three-font cap is a constraint, not a starting point.
- **Don't** use warm neutrals or tinted backgrounds. The color strategy is achromatic except for the single accent.
- **Don't** add border-radius to any element. Square is systemic, not a per-element choice.
- **Don't** add shadows inside the card. Interior elevation is expressed through background tint and border opacity only.
- **Don't** use SaaS landing-page conventions: no hero metrics, no gradient cards, no eyebrow labels above every section, no numbered section markers (01/02/03), no buzzword copy.
- **Don't** animate layout properties. The card entrance uses transform + opacity only. All transitions are on color, border-color, and opacity.
- **Don't** use all-caps for anything longer than a short label. The label role (skill categories, cert pills) is the correct scope for uppercase. Sentences in mono uppercase are unreadable at these sizes.
- **Don't** make Ghost Text (#888) any lighter on a dark background. It sits at approximately 3.9:1 against card-surface — acceptable for non-body text, but there's no margin left. Anything lighter fails.
