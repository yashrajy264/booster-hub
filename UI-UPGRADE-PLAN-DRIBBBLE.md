# UI Upgrade Plan: PrepareUp (Dribbble Inspiration)

## Design Language Analysis (from Dribbble screenshot)
- **Layout**: Floating, pill-shaped elements. Heavy use of rounded corners (large radii, e.g., `rounded-3xl` or `rounded-full`). "Bento box" style floating cards.
- **Navbar**: Floating pill shape, detached from the top edge, centered or spanning with margins. Contains logo, links, and primary CTA.
- **Typography**: Large, high-contrast serif/display fonts for primary headings (like the "Grow+" in the reference). Clean sans-serif for body and UI elements.
- **Colors**: Soft gradients, blurred backgrounds (glassmorphism), high contrast text (black on light gray/white). Subtle use of vibrant accents (like the orange/peach in the reference, which we will adapt to our mint/green theme).
- **Components**: Floating badges, overlapping elements, soft drop shadows, blurred glass overlays.

## Phase 1: Logo & Navbar (The "Pill")

### 1. Logo Integration & Animation
- **Asset**: Move `/Users/yashrajsinghyadav/Documents/booster hub/PrepareUp.png` to `public/logo.png`.
- **Component**: Create a `Logo` component in `src/components/logo.tsx`.
- **Animation**: Implement a subtle entrance or hover animation using CSS keyframes or Framer Motion (if added, otherwise stick to Tailwind `animate-in` or custom CSS). A simple reveal or scale effect.

### 2. Pill-Shape Navbar
- **File**: Update `src/components/site-header.tsx`.
- **Styling**: Change from a full-width sticky border to a floating pill.
  - Remove `border-b`, `w-full`.
  - Add `mx-auto`, `mt-4`, `max-w-5xl`, `rounded-full`, `border`, `bg-background/90`, `backdrop-blur-md`, `shadow-sm`, `px-6`, `py-3`.
- **Layout**: Logo on left, navigation centered, primary CTA (e.g., "Get Started" or "Log in") on right.

## Phase 2: Full Landing Page Redesign (`src/app/page.tsx`)

### 1. Hero Section (Bento/Floating Style)
- **Background**: Soft gray/mint gradient background with rounded corners (like a giant card containing the hero content).
- **Typography**: Update main headline to use the serif font (`font-heading`) at a massive scale (e.g., `text-6xl` to `text-8xl`).
- **Layout**: Split layout.
  - **Left**: Badges (e.g., "20M+ Users"), massive headline, subheadline, CTA buttons, social proof (avatars/stars).
  - **Right**: A large, rounded image or composition of floating elements (like the shoe/stats cards in the reference). We will use category images or abstract shapes tinted with our mint theme.

### 2. Floating Elements & Glassmorphism
- Introduce floating "glass" cards over the hero area to mimic the reference (e.g., a floating "Stats" card, a floating "Question" pill).
- Use Tailwind's `backdrop-blur` and `bg-white/50` (or dark mode equivalent) for these elements.

### 3. Logo Cloud / Trust Bar
- Add a row of logos (or text placeholders for now) below the hero section, similar to the reference (Rakuten, NCR, Monday.com, etc.).

## Phase 3: Global CSS & Token Adjustments

- **File**: `src/app/globals.css`.
- **Adjustments**:
  - Ensure `--radius` is large enough for the pill aesthetic (might need specific overrides for the navbar and hero container).
  - Tweak the background color to be slightly off-white (like a very soft gray or mint-tinted gray) to allow white cards to pop.

## Implementation Steps

1. **Setup Assets**: Copy `PrepareUp.png` to `public/`.
2. **Update Header**: Rewrite `SiteHeader` to be a floating pill.
3. **Build Logo Component**: Create the animated logo.
4. **Rewrite Home Page (`page.tsx`)**: Implement the new hero section matching the Dribbble layout structure, adapting it to our PDF storefront content.
5. **Refine Styles**: Adjust global CSS and Tailwind classes for the glassmorphism and bento box feel.