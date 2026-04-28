// Shared design tokens + base CSS for the redesigned B2B Outreach pages.
// Scope all rules under `.reiz-leads` so they don't leak elsewhere.

export const REIZ_LEADS_CSS = `
.reiz-leads {
  --reiz-indigo: var(--c-brand);
  --reiz-indigo-600: var(--c-brand);
  --reiz-cyan: var(--c-brand);
  --reiz-green: var(--c-success);
  --reiz-amber: var(--c-warning);
  --reiz-rose: #F43F5E;
  --reiz-blue: var(--c-brand);

  --st-new:           #94A3B8;
  --st-enriched:      var(--c-brand);
  --st-ready:         var(--c-brand);
  --st-contacted:     var(--c-brand);
  --st-fu1:           var(--c-brand);
  --st-fu2:           var(--c-brand);
  --st-breakup:       #C026D3;
  --st-replied:       var(--c-success);
  --st-interested:    var(--c-success);
  --st-client:        var(--c-success);
  --st-disqualified:  #64748B;
  --st-bounced:       var(--c-error);
  --st-unsubscribed:  #71717A;
  --st-paused:        var(--c-warning);

  --radius-card: 20px;

  font-family: 'Inter', 'DM Sans', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  font-feature-settings: 'cv11', 'ss01';
  -webkit-font-smoothing: antialiased;
  color: var(--text-1);
  background: var(--bg-app);
  min-height: calc(100vh - 48px);
  margin: -24px -32px;
  padding: 24px 28px 32px;
}
.reiz-leads.theme-light {
  --bg-app: #EDEEF2;
  --bg-surface: var(--c-surface-card);
  --bg-surface-2: var(--c-surface-muted);
  --bg-sunken: #E5E7EC;
  --bg-row-hover: #F4F5F7;
  --border: #E5E7EC;
  --border-strong: #D1D5DB;
  --text-1: #1A1D23;
  --text-2: #6B7280;
  --text-3: #9CA3AF;
  --shadow-card: 0 1px 2px rgba(20, 22, 30, 0.04), 0 8px 24px rgba(20, 22, 30, 0.04);
}
.reiz-leads.theme-dark {
  --bg-app: #14161C;
  --bg-surface: #21242C;
  --bg-surface-2: #1B1E25;
  --bg-sunken: #1B1E25;
  --bg-row-hover: #2A2D36;
  --border: #2A2D36;
  --border-strong: #383C46;
  --text-1: #F4F5F7;
  --text-2: #9CA3AF;
  --text-3: #6B7280;
  --shadow-card: 0 1px 2px rgba(0, 0, 0, 0.3), 0 8px 24px rgba(0, 0, 0, 0.25);
}
.reiz-leads .r-card {
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border);
}
.reiz-leads .r-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.01em;
  white-space: nowrap;
  line-height: 1.4;
}
.reiz-leads .r-badge .dot { width: 6px; height: 6px; border-radius: 50%; }
@keyframes reiz-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.4); opacity: 0.55; }
}
.reiz-leads .r-pulse-dot {
  position: relative;
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--reiz-amber);
  display: inline-block;
}
.reiz-leads .r-pulse-dot::before {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  background: var(--reiz-amber);
  opacity: 0.35;
  animation: reiz-pulse 1.6s ease-in-out infinite;
}
@keyframes reiz-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.reiz-leads .r-input {
  background: transparent;
  border: none;
  padding: 10px 12px 10px 38px;
  font: inherit;
  color: var(--text-1);
  width: 100%;
  outline: none;
}
.reiz-leads .r-input::placeholder { color: var(--text-3); }
.reiz-leads .r-row:hover { background: var(--bg-row-hover); }
.reiz-leads .r-row:hover .row-actions { opacity: 1 !important; }

/* Form controls (used by /leads/new) */
.reiz-leads .r-field-input,
.reiz-leads .r-field-select,
.reiz-leads .r-field-textarea {
  width: 100%;
  height: 42px;
  padding: 0 14px;
  border-radius: 12px;
  background: var(--bg-surface-2);
  border: 1px solid var(--border);
  color: var(--text-1);
  font: inherit;
  font-size: 13.5px;
  outline: none;
  transition: border-color 0.12s, background 0.12s, box-shadow 0.12s;
}
.reiz-leads .r-field-textarea {
  height: auto;
  min-height: 96px;
  padding: 12px 14px;
  resize: vertical;
  font-family: inherit;
  line-height: 1.5;
}
.reiz-leads .r-field-input:focus,
.reiz-leads .r-field-select:focus,
.reiz-leads .r-field-textarea:focus {
  border-color: var(--reiz-indigo);
  background: var(--bg-surface);
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--reiz-indigo) 18%, transparent);
}
.reiz-leads .r-field-input::placeholder,
.reiz-leads .r-field-textarea::placeholder { color: var(--text-3); }
.reiz-leads .r-field-select {
  appearance: none;
  -webkit-appearance: none;
  padding-right: 36px;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='%239CA3AF' d='M0 0h10L5 6z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 14px center;
}
`;
