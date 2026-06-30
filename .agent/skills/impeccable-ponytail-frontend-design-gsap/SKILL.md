---
name: impeccable-ponytail-frontend-design-gsap
description: "Applies Impeccable design guidelines (anti-slop, premium typography/colors), Ponytail code optimization (YAGNI, minimal code, native features), and GSAP animation best practices."
---

# Impeccable Ponytail Frontend Design & GSAP Guidelines

This skill defines the integration of high-craft frontend design (Impeccable), minimal and efficient code architecture (Ponytail), and professional motion choreography (GSAP). Use these instructions whenever designing, reviewing, or writing code for frontend interfaces.

---

## 1. Impeccable Design Mandates (Anti-AI Slop)

Your goal is to build highly memorable, polished, and custom interfaces. Avoid generic templates, repetitive card layouts, and default component aesthetics.

### Typography & Structure
*   **Deliberate Pairings**: Always pair distinct font families for display (headings) and body text. Use serif/sans combinations to establish an editorial rhythm.
*   **Vertical Grid & Rhythm**: Maintain strict vertical spacing. Let elements breathe with generous white space.
*   **Optical Alignment**: Align elements based on visual weight rather than raw math. Check text baseline alignment with icons.

### Color Systems
*   **OKLCH Palettes**: Define colors using the OKLCH space for precise control over lightness, chroma, and hue.
*   **Aesthetic Tone**: Avoid typical "AI-generated" gradients (e.g., neon purple-to-blue). Use curated, sophisticated palettes (such as warm slate, deep navy, and burnished gold).

---

## 2. Ponytail Optimization Laws (The Lazy Senior Dev)

Write the minimum amount of code required to achieve the highest design and functional impact. Prioritize maintainability and simplicity.

### YAGNI (You Ain't Gonna Need It)
*   **Evaluate Needs**: Before creating a new file, component, or utility, verify if it is strictly necessary to solve the user's problem.
*   **Reuse Existing Code**: Check the codebase first. Reuse existing React components, Tailwind tokens, and helper functions instead of rewriting them.

### Native & Lightweight First
*   **Browser Capabilities**: Utilize native HTML5 elements (like `<details>` for accordions, or native dialogs) and vanilla CSS transitions/animations for simple hover and interactive states.
*   **Reduce Dependencies**: Do not install third-party libraries for simple animations or UI components unless absolutely required.

---

## 3. GSAP Motion & Choreography

When complex scroll, scroll-triggered, or timeline-based animations are required, implement them safely and elegantly using GSAP.

### Easing & Timing
*   **Natural Curves**: Avoid linear, bouncy, or elastic animations unless specifically requested. Use slow, natural easing (e.g., `power3.out`, `expo.out`, or `circ.out`).
*   **Timing Constraints**: Keep transition durations between `0.2s` and `0.6s`.

### Performance & Safety
*   **Reflow Avoidance**: Only animate transform properties (`x`, `y`, `scale`, `rotation`) and `opacity`. Never animate layout-triggering properties like `width`, `height`, `top`, or `left` directly.
*   **Will-Change**: Add `will-change: transform, opacity` to animated elements to promote them to their own compositor layers.

### Cleanup & Lifecycle (React / Next.js)
*   **GSAP Context**: Always clean up GSAP timelines and scroll triggers on component unmount to prevent memory leaks and duplicate triggers.
*   ```typescript
    import { useEffect, useRef } from 'react';
    import gsap from 'gsap';

    // Example cleanup pattern
    useEffect(() => {
      const ctx = gsap.context(() => {
        gsap.to('.animate-target', { x: 100 });
      });
      return () => ctx.revert(); // Ensure clean revert on unmount
    }, []);
    ```

### Accessibility
*   **Reduced Motion**: Always respect user accessibility settings. Check for `(prefers-reduced-motion: reduce)` and bypass animations or fall back to simple opacity fades.
