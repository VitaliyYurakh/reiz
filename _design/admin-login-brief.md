# REIZ Admin — Login Page Design Brief

> Brief for **Claude Design** (or any Figma-fluent designer) to redesign the admin
> login page at `/admin/login`. Paste this into Claude Design as-is.

---

## 0. Context

**Product:** REIZ — Lviv-based car rental company (Ukraine). Internal admin panel
used by ~5–10 managers who handle bookings, fleet, finance, and customer ops.

**Where this page lives:** `/admin/login` — first thing the manager sees in the
morning, every day. They use it on a desktop browser (1440×900 most common,
sometimes 1920×1080); occasionally on a tablet. **No mobile flow needed.**

**Login frequency:** ~1× per day per manager (httpOnly session cookie keeps them
logged in for the working day). So this page must feel **fast, calm, premium**.
It's a tool, not a marketing page.

**What the manager unlocks behind it:** the entire CRM — fleet, ~125 monthly
bookings, finance ledger, complaints, leads pipeline, mail. They expect the
login screen to set the tone for that.

---

## 1. Brand & Visual System

The admin panel uses a **single brand color family** (recently unified — see
commit `41c0e07`). The login page must respect it.

### Color tokens (CSS variables)

```
--c-brand:          #6a7bff   ← primary actions, focus rings, logo accent
--c-brand-light:    #9aa5ff   ← gradient ends, hover tints
--c-brand-dark:     #5867e8   ← pressed state, gradient deep end
--c-brand-bg:       #EEF1FF   ← soft accent backgrounds

--c-error:          #EE5D50   ← error message tint
--c-error-bg:       #FFF0EF   ← error message background

--c-text:           #2B3674   ← all primary text (Horizon navy)
--c-text-deep:      #1B2559   ← strongest headings
--c-text-muted:     #A3AED0   ← secondary / placeholder

--c-surface-bg:     #F4F7FE   ← page background
--c-surface-card:   #FFFFFF   ← card background
--c-surface-border: #E0E5F2   ← divider / input border (rest state)
--c-surface-muted:  #F7F9FB   ← input background
```

**Dark theme exists** in the admin shell (manager can toggle), but the login
page itself is **always light** for now — they walk in from a dark hallway,
the bright card pulls focus. (If you want to propose a dark variant too, do it —
just don't prioritize it.)

### Typography

- **Font family:** `'DM Sans', sans-serif` (already loaded in admin shell).
- Use weights: 400, 500, 600, 700.
- Character: clean, geometric, slightly humanist. No Inter, no system fonts.

### Brand mood

- **Premium but not luxurious.** Stripe / Linear / Notion-like.
- **Calm.** No bouncy animations, no gradient explosions, no glassmorphism overload.
- **Trustworthy.** This is finance + customer data behind that button. The page
  should make the manager feel they're entering a serious tool.
- **Distinctly Ukrainian product** — but not via flag colors. Via care for
  Ukrainian typography (Cyrillic must look as good as Latin), the localized
  copy, and the city context (REIZ is Lviv-rooted).

---

## 2. Functional Requirements (do not invent or remove fields)

The page is a **two-step authentication form**:

### Step 1 — Email + Password

Always shown first.

| Field    | Type   | Validation                       | Placeholder                  |
|----------|--------|----------------------------------|------------------------------|
| Email    | email  | required, valid email            | `admin@reiz.co.il`           |
| Password | password | required, min 8 chars (server-validated) | `••••••••`         |
| Submit   | button | "Увійти" / "Submit" / etc.       | —                            |

On submit:
- Loading spinner inside the button (button text becomes "Вхід...").
- API call returns one of three things:
  - **Success** — set httpOnly cookie, redirect to `/admin/dashboard`.
  - **Wrong credentials** — show error message in a tinted red banner above
    the form. Email + password stay filled in.
  - **`{ requires2fa: true }`** — switch to Step 2. Email + password stay in
    state (not visible).

### Step 2 — TOTP code (only when 2FA is enabled for this user)

Replaces the password form. Email/password are NOT shown again.

| Field    | Type   | Validation                          | Placeholder                  |
|----------|--------|-------------------------------------|------------------------------|
| TOTP code| text   | 6 chars min, numeric inputmode      | `123 456`                    |
| Submit   | button | "Підтвердити"                       | —                            |
| Back link| text   | "← Інший акаунт" — returns to Step 1| —                            |

- Auto-focus on the TOTP input when this step appears.
- The input should accept BOTH a 6-digit TOTP code AND an alphanumeric recovery
  code (server tries TOTP first, falls back to recovery). So **don't** force a
  6-digit input mask — be permissive but show "123 456" as a hint.
- Above the input, a small explanatory line:
  *"Введіть 6-значний код із вашого додатку автентифікації, або один із
  резервних кодів."*

### Error states

- Wrong password / network error → error banner ABOVE the form fields.
- Banner uses `--c-error-bg` background + `--c-error` text.
- Error message format from the server: `[401] Invalid credentials` etc.

### Loading

- Disable the submit button during loading.
- Optional: show a small spinner icon inside the button (left of the text).

### Locale switcher (optional but nice)

The admin supports 5 locales: **uk, ru, en, pl, ro** (Ukrainian is default).
Currently the login page does NOT have a locale switcher visible — it inherits
the locale from `localStorage`. **You can propose** a small flag/text switcher
in the corner if it improves UX, but it's not mandatory.

---

## 3. Layout & Composition

### Constraints

- **Viewport:** desktop-first (1440×900). Card centered both axes.
- **Card width:** ~420–480px feels right. Don't go wider than 520.
- **Page background:** soft, with subtle visual interest. Not a stock car
  photo. Not a corporate gradient mess.

### Suggestions (you choose)

Here are a few directions — **pick ONE and execute it cleanly**, don't mix:

#### Direction A — "Card on a calm canvas" (safe, premium)
- Light `--c-surface-bg` background.
- Single white card centered, soft shadow.
- Subtle decorative element: maybe two large blurred `--c-brand` circles
  positioned at top-right and bottom-left (already in current implementation —
  refine the execution).
- The card itself is the hero. No imagery.

#### Direction B — "Split with brand visual" (more design-forward)
- Left half (~50–55%): solid `--c-brand` panel with a meaningful visual —
  e.g., a stylized line illustration of the Lviv tram + a car, OR a simple
  large logomark + tagline ("Прокат авто у Львові з 2020").
- Right half: white panel with the form.
- Risk: feels marketing-y; we want admin tool vibes.

#### Direction C — "Editorial card with tagline"
- Single card, but inside the card, above the form, include a small piece of
  brand voice: e.g., an italicized line "З Львова, для України." in muted text.
- Or: a tiny dynamic stat ("12 авто в роботі сьогодні · 3 видачі заплановані") —
  but this needs an API, so probably out of scope. Mention it as a future option
  if you like the direction.

### Required UI elements (regardless of direction)

1. **Logo / wordmark** — top of the card. Use a `Car` icon (from lucide-react)
   in a rounded gradient square (`--c-brand` → `--c-brand-dark`), 56–64px.
   Below the icon: "**REIZ** Admin" as the wordmark (REIZ bold, Admin lighter).
2. **Subtitle** — one short line: "Увійдіть в панель керування"
   (or in the active locale).
3. **Form** — fields as described in §2.
4. **Footer** — single line at the bottom of the card, very muted:
   "REIZ Car Rental · Admin Panel · v1.0" — or just a copyright. Optional.

### Spacing rhythm

Use a 4 / 8 / 16 / 24 / 32 baseline. Card inner padding ~36–40px.

---

## 4. Components & State Catalog

For each, deliver the design state in Figma:

| Component               | States to design                                    |
|-------------------------|-----------------------------------------------------|
| Email input             | rest, focus, filled, error                          |
| Password input          | rest, focus, filled, error                          |
| TOTP input              | rest, focus, filled (with letter-spacing for code)  |
| Primary submit button   | rest, hover, pressed, loading, disabled             |
| "Back" text link        | rest, hover                                         |
| Error banner            | one state                                           |
| Logo/wordmark           | one state                                           |
| Step transition         | how Step 1 → Step 2 transitions visually (slide?    |
|                         | fade? simple replace?). Keep it under 200ms.        |

### Inputs — interaction notes

- Each input has a left-side **icon** (lucide-react: `Mail`, `Lock`, `ShieldCheck`)
  inside the input chrome. Icon color: `--c-text-muted` at rest,
  `--c-brand` on focus.
- Border 1px `--c-surface-border`, radius 12px.
- On focus: border becomes `--c-brand` and add a 3px glow:
  `box-shadow: 0 0 0 3px rgba(106, 123, 255, 0.18)`.
- Padding inside input: ~14px vertical, 16px horizontal (40px tall in total for
  the chrome).
- Background: `--c-surface-muted` works nicely against the white card. Or pure
  white with the border doing the work — your call.

### Submit button

- Full width of the form area.
- Height 48px.
- Background: linear gradient `--c-brand` → `--c-brand-dark` (left → right).
  Or solid `--c-brand` if the design feels cleaner without the gradient.
- Text white, weight 600, 14–15px.
- Icon inside the button (`LogIn` or `ShieldCheck` for step 2), 18px, on the left.
- Radius 12px to match inputs.
- Hover: subtle lift via shadow (no transform). Pressed: scale 0.98 + brighter shadow.
- Loading: small inline spinner replaces the icon.

---

## 5. Copy / Microcopy (Ukrainian, default)

Use this exactly. (English/Russian/Polish/Romanian in the i18n files for ref.)

| Element            | Copy                                                                |
|--------------------|---------------------------------------------------------------------|
| Wordmark           | `REIZ` (bold) `Admin`                                               |
| Subtitle           | Увійдіть в панель керування                                         |
| Email label        | Email                                                               |
| Password label     | Пароль                                                              |
| Submit button      | Увійти                                                              |
| Submit (loading)   | Вхід...                                                             |
| Generic error      | Невірний email або пароль                                           |
| Network error      | Сервер недоступний. Спробуйте пізніше.                              |
| 2FA hint           | Введіть 6-значний код із вашого додатку автентифікації, або один із резервних кодів. |
| 2FA label          | Код 2FA                                                             |
| 2FA submit         | Підтвердити                                                         |
| 2FA back link      | ← Інший акаунт                                                      |
| Footer (optional)  | REIZ Car Rental · Admin Panel                                       |

**Cyrillic typography:** test with both wordmark "REIZ Admin" and the long
Ukrainian sentences. DM Sans handles Cyrillic well — verify in Figma.

---

## 6. What NOT to do

- ❌ No "Forgot password?" link. There's no password-reset flow yet (admins
  reset each other via the Settings page). Adding the link without the flow
  would be a dead end.
- ❌ No "Sign up" / "Register" link. Admins are created internally.
- ❌ No social login (Google / GitHub). Not in scope.
- ❌ No animated mascots, illustrations of car keys, generic stock photography
  of smiling people.
- ❌ No dark glassmorphism panels with neon glow. This is a CRM, not a
  crypto landing.
- ❌ No mobile flow yet — desktop only.
- ❌ Don't change the field count, the 2-step flow, or the API contract.

---

## 7. Deliverables

Please provide in Figma (or an exportable artifact):

1. **Desktop frame 1440×900** showing the login card on the page background,
   default state (Step 1, no errors).
2. **Desktop frame** Step 2 (TOTP) state.
3. **Desktop frame** Error state (Step 1 with the error banner).
4. **Components panel** with the input/button/banner variants from §4.
5. **Spec sheet** (or in-frame annotations) noting:
   - Exact CSS-var token used for every color.
   - Spacing values.
   - Font sizes / weights.
   - Border radii.
   - Shadow values.
6. **Optional:** dark-theme variant of the login page (use the dark CSS-var
   set from `globals.css`).

When ready, paste back as Claude Design output (artifact + code if comfortable
with React + Tailwind, otherwise just the Figma frames + token list).

---

## 8. Reference — current implementation

For grounding (don't copy — this is what we're improving):
- `front/src/app/admin/(auth)/login/page.tsx` — current page (functional but
  visually flat).
- `front/src/app/admin/(auth)/login/styles.scss` — current styles.
- `front/src/app/admin/globals.css` — `:root` block contains all CSS variables.
- `front/src/lib/admin/colors.ts` — TS constants for the same palette.
