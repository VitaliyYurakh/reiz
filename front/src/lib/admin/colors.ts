/**
 * Single source of truth for admin colors.
 *
 * Every admin file should pull a color from here (or use the matching CSS
 * variable `var(--c-…)` defined in `app/admin/globals.css`) instead of
 * hardcoding hex literals.
 *
 * Why both shapes:
 *   - The CSS-variable form (`var(--c-brand)`) automatically picks the
 *     light/dark value from the theme — that's what most inline styles
 *     and CSS files use.
 *   - The raw-hex constants (`ADMIN_COLORS.brand.primary`) exist so the
 *     few places that need a literal value at JS time (chart libraries
 *     that don't understand CSS vars, dynamic gradient builders, etc.)
 *     can still reach the canonical palette.
 *
 * The light/dark pairs in TS mirror the CSS-var declarations under
 * `[data-theme="dark"]` in globals.css. Keep them in sync.
 */

export const ADMIN_COLORS = {
    brand: {
        primary:   '#6a7bff',  // — buttons, focus rings, primary KPI accents
        light:     '#9aa5ff',  // — gradient ends, hover tints
        dark:      '#5867e8',  // — pressed/hover deep state
        bgLight:   '#EEF1FF',  // — soft background tint (light theme)
        bgDark:    '#1F2347',  // — soft background tint (dark theme)
    },
    success: {
        base:      '#01B574',  // Horizon green
        dark:      '#48BB78',  // dark-theme variant
        bgLight:   '#E6FFF3',
        bgDark:    '#1A3A2A',
    },
    warning: {
        base:      '#FFB547',  // Horizon orange
        dark:      '#F6AD55',
        bgLight:   '#FFF6E6',
        bgDark:    '#3D2B13',
    },
    error: {
        base:      '#EE5D50',  // Horizon red
        dark:      '#FC8181',
        bgLight:   '#FFF0EF',
        bgDark:    '#3B1F1F',
    },
    info: {
        base:      '#00838F',  // teal — distinct semantic (e.g. "awaiting client")
        bgLight:   '#E0F7FA',
        bgDark:    '#063545',
    },
    text: {
        primaryLight:    '#2B3674',  // Horizon navy
        primaryDark:     '#E2E8F0',
        secondaryLight:  '#A3AED0',
        secondaryDark:   '#718096',
        deepNavy:        '#1B2559',  // strongest text accent (light theme)
    },
    surface: {
        bgLight:     '#F4F7FE',
        bgDark:      '#111827',
        cardLight:   '#FFFFFF',
        cardDark:    '#1A2332',
        borderLight: '#E0E5F2',
        borderDark:  '#2D3748',
        mutedLight:  '#F7F9FB',
        mutedDark:   '#1E293B',
    },
} as const;

/**
 * CSS variable names. Mirror what's declared in `globals.css`.
 * Use as: `style={{ color: cssVar.brand }}` for theme-aware colors.
 */
export const cssVar = {
    brand:           'var(--c-brand)',
    brandLight:      'var(--c-brand-light)',
    brandDark:       'var(--c-brand-dark)',
    brandBg:         'var(--c-brand-bg)',
    success:         'var(--c-success)',
    successLight:    'var(--c-success-light)',
    successBg:       'var(--c-success-bg)',
    warning:         'var(--c-warning)',
    warningLight:    'var(--c-warning-light)',
    warningBg:       'var(--c-warning-bg)',
    error:           'var(--c-error)',
    errorLight:      'var(--c-error-light)',
    errorBg:         'var(--c-error-bg)',
    info:            'var(--c-info)',
    infoBg:          'var(--c-info-bg)',
    text:            'var(--c-text)',
    textMuted:       'var(--c-text-muted)',
    textDeep:        'var(--c-text-deep)',
    surfaceBg:       'var(--c-surface-bg)',
    surfaceCard:     'var(--c-surface-card)',
    surfaceBorder:   'var(--c-surface-border)',
    surfaceMuted:    'var(--c-surface-muted)',
} as const;

export type AdminColorKey = keyof typeof cssVar;
