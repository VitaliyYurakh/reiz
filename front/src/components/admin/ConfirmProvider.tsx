'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react';

export interface ConfirmOptions {
    title: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    danger?: boolean;
}

type PromptState = {
    options: ConfirmOptions;
    resolve: (value: boolean) => void;
} | null;

interface Ctx {
    confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<Ctx | null>(null);

export function useConfirm(): Ctx['confirm'] {
    const ctx = useContext(ConfirmContext);
    if (!ctx) {
        throw new Error('useConfirm must be used inside <ConfirmProvider>');
    }
    return ctx.confirm;
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<PromptState>(null);

    const confirm = useCallback(
        (options: ConfirmOptions) =>
            new Promise<boolean>((resolve) => {
                setState({ options, resolve });
            }),
        [],
    );

    const handle = useCallback(
        (value: boolean) => {
            state?.resolve(value);
            setState(null);
        },
        [state],
    );

    useEffect(() => {
        if (!state) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handle(false);
            if (e.key === 'Enter') handle(true);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [state, handle]);

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}
            {state && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="confirm-dialog-title"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 10000,
                        background: 'rgba(27, 37, 89, 0.4)',
                        backdropFilter: 'blur(6px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: "'DM Sans', sans-serif",
                    }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) handle(false);
                    }}
                >
                    <div
                        style={{
                            background: 'var(--color-card, #fff)',
                            color: 'var(--color-foreground, var(--c-text))',
                            borderRadius: 16,
                            padding: 28,
                            width: 'min(420px, calc(100vw - 32px))',
                            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3
                            id="confirm-dialog-title"
                            style={{ fontSize: 18, fontWeight: 700, margin: 0 }}
                        >
                            {state.options.title}
                        </h3>
                        {state.options.message && (
                            <p
                                style={{
                                    fontSize: 14,
                                    opacity: 0.72,
                                    marginTop: 8,
                                    marginBottom: 0,
                                    lineHeight: 1.5,
                                }}
                            >
                                {state.options.message}
                            </p>
                        )}
                        <div
                            style={{
                                display: 'flex',
                                gap: 10,
                                justifyContent: 'flex-end',
                                marginTop: 24,
                            }}
                        >
                            <button
                                type="button"
                                onClick={() => handle(false)}
                                style={{
                                    borderRadius: 49,
                                    padding: '10px 20px',
                                    fontSize: 13,
                                    fontWeight: 700,
                                    border: 'none',
                                    background: 'var(--color-secondary, var(--c-surface-muted))',
                                    color: 'var(--color-foreground, var(--c-text))',
                                    cursor: 'pointer',
                                }}
                            >
                                {state.options.cancelLabel ?? 'Скасувати'}
                            </button>
                            <button
                                type="button"
                                onClick={() => handle(true)}
                                autoFocus
                                style={{
                                    borderRadius: 49,
                                    padding: '10px 20px',
                                    fontSize: 13,
                                    fontWeight: 700,
                                    border: 'none',
                                    background: state.options.danger
                                        ? 'linear-gradient(135deg, #FF6B6B 0%, var(--c-error) 100%)'
                                        : 'linear-gradient(135deg, var(--c-brand-light) 0%, var(--c-brand) 100%)',
                                    color: '#fff',
                                    boxShadow: state.options.danger
                                        ? '0 4px 12px rgba(238, 93, 80, 0.25)'
                                        : '0 4px 12px rgba(106, 123, 255, 0.25)',
                                    cursor: 'pointer',
                                }}
                            >
                                {state.options.confirmLabel ?? 'Підтвердити'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ConfirmContext.Provider>
    );
}
