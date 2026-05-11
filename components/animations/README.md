# Animation Layer Integration Notes

This folder contains a standalone animation layer that was added without
modifying existing sections, layout, or styles.

## New Files

- `lib/animations.ts`
- `hooks/useGSAP.ts`
- `hooks/useScrollProgress.ts`
- `components/animations/RevealText.tsx`
- `components/animations/MagneticButton.tsx`
- `components/animations/ParallaxImage.tsx`
- `components/animations/CounterNumber.tsx`
- `components/animations/DrawLine.tsx`
- `components/animations/SplitText.tsx`
- `components/animations/index.ts`

## Install Commands (when wiring this layer)

```bash
npm install gsap @gsap/react split-type
```

Framer Motion is already available in this project.

## Suggested Wiring Targets

- Hero:
  - Wrap title text with `SplitText` or `RevealText`.
  - Wrap hero metrics with `CounterNumber`.
  - Use `runHeroCinematicTimeline` from `lib/animations.ts` for class-based
    cinematic sequencing.
- About + Projects:
  - Wrap image nodes with `ParallaxImage`.
  - Wrap CTA buttons with `MagneticButton`.
- Process:
  - Use `DrawLine` for the dashed connector.
  - Keep each step circle class as `.process-circle`.
- Section headings:
  - Use `RevealText` for masked, staggered word reveals.

## Mobile and Accessibility Behavior

- `MagneticButton` uses desktop pointer detection by default.
- All GSAP wrappers are safe if GSAP packages are not installed yet; they
  simply no-op until dependencies are available.
- Keep reduced-motion decisions in existing sections when wiring wrappers.

## Example Wrapping Pattern

```tsx
<ParallaxImage className="relative overflow-hidden" innerClassName="h-full w-full">
  <Image src={...} alt={...} fill />
</ParallaxImage>
```

```tsx
<MagneticButton className="inline-flex">
  <button type="button">Start a Project</button>
</MagneticButton>
```
