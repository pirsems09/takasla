export type ThemeColors = {
  // ── Core surfaces ──────────────────────────────────────────────
  background: string;       // main screen background (cool palette)
  surface: string;          // primary card / sheet background
  surfaceAlt: string;       // secondary surface (pills, chips, inputs)

  // ── Text ───────────────────────────────────────────────────────
  text: string;             // primary text / dark accent
  textSecondary: string;    // muted / secondary text
  textMuted: string;        // even more muted text (timestamps, hints)
  textOnHighlight: string;  // text placed on top of `highlight`
  textOnAccent: string;     // text placed on top of `accent` / `accentSurface`

  // ── Brand / accent ─────────────────────────────────────────────
  accent: string;           // dark accent (#1b1d1f family)
  accentSurface: string;    // lighter dark surface (#2c2f33 family)
  primary: string;          // blue brand color
  highlight: string;        // lime-green highlight (#d8ff57)

  // ── Borders & dividers ─────────────────────────────────────────
  border: string;
  borderLight: string;

  // ── Bottom tab bar ─────────────────────────────────────────────
  tabBackground: string;
  tabPill: string;
  tabActive: string;
  tabInactive: string;

  // ── Chat ───────────────────────────────────────────────────────
  chatBackground: string;
  chatBubbleMe: string;
  chatBubbleOther: string;
  chatInputBar: string;
  chatInputButton: string;

  // ── Status ─────────────────────────────────────────────────────
  online: string;

  // ── Warm palette (Listing / Favorites / Profile) ───────────────
  warmBackground: string;
  warmSurface: string;
  warmSurfaceAlt: string;
  warmText: string;
  warmTextSecondary: string;
  warmAccent: string;
  warmBorder: string;

  // ── Favorite heart ─────────────────────────────────────────────
  favoriteActive: string;
  favoriteInactive: string;

  // ── Listing type tag badges ────────────────────────────────────
  tagSellBg: string;
  tagSwapBg: string;
  tagDonateBg: string;
  tagText: string;
};

export type Theme = "light" | "dark";
