'use client';

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Inbox, Send, FileText, Trash2, AlertCircle, Star, Folder, Pencil,
    ChevronDown, ChevronLeft, ChevronRight, RefreshCw, Search,
    Paperclip, Reply, ReplyAll, Forward, MoreVertical, Archive,
    Image as ImageIcon, Download, X, Minus, Maximize2, Bold, Italic,
    Underline, List, ListOrdered, Link as LinkIcon, Quote, AlignLeft,
    Smile, Clock, Loader2, Check, Square, CheckSquare, Filter, Trash, Plus,
} from 'lucide-react';
import { toast } from 'sonner';
import { mailApi } from '@/lib/api/mail';
import type {
    MailFolder, MailMessageListItem, MailMessageDetail, MailAddr, MailAccount, MailContact,
} from '@/lib/api/mail';
import { useAdminTheme } from '@/context/AdminThemeContext';
import './mail.css';

export const dynamic = 'force-dynamic';

// ── Helpers ──────────────────────────────────────────────────────────────

const SPECIAL_ICON: Record<string, typeof Inbox> = {
    '\\Inbox': Inbox,
    '\\Sent': Send,
    '\\Drafts': FileText,
    '\\Trash': Trash2,
    '\\Junk': AlertCircle,
    '\\Archive': Archive,
    '\\Flagged': Star,
};

const SPECIAL_LABEL_UK: Record<string, string> = {
    '\\Inbox': 'Вхідні',
    '\\Sent': 'Надіслані',
    '\\Drafts': 'Чернетки',
    '\\Trash': 'Кошик',
    '\\Junk': 'Спам',
    '\\Archive': 'Архів',
    '\\Flagged': 'Помічені',
};

const SPECIAL_ORDER = ['\\Inbox', '\\Flagged', '\\Sent', '\\Drafts', '\\Trash', '\\Junk', '\\Archive'];

const AVATAR_PALETTE = ['#7C5CFF', '#22C55E', '#EC4899', '#F97316', '#06B6D4', '#A855F7', '#F59E0B', '#10B981', '#0EA5E9', '#EF4444'];

function colorFor(s: string): string {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return AVATAR_PALETTE[Math.abs(h) % AVATAR_PALETTE.length];
}

function initialsOf(name: string | null, addr: string): string {
    const src = (name || addr).trim();
    const parts = src.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return src.slice(0, 2).toUpperCase();
}

function formatTime(iso: string): string {
    const d = new Date(iso);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) return d.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
    const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return 'вчора';
    if (d.getFullYear() === now.getFullYear()) {
        return d.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' });
    }
    return d.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function formatDateLong(iso: string): string {
    return new Date(iso).toLocaleString('uk-UA', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
}

function relativeTime(iso: string | null): string {
    if (!iso) return '—';
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60_000);
    if (m < 1) return 'щойно';
    if (m < 60) return `${m} хв тому`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} год тому`;
    const d = Math.floor(h / 24);
    return `${d} д тому`;
}

function formatBytes(n: number | null | undefined): string {
    if (!n) return '';
    if (n < 1024) return `${n} Б`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} КБ`;
    return `${(n / 1024 / 1024).toFixed(1)} МБ`;
}

function autoLabel(fromAddr: string, subject: string | null): { text: string; color: string } | null {
    const addr = fromAddr.toLowerCase();
    const subj = (subject || '').toLowerCase();
    // Banks → Рахунок (blue)
    if (/privatbank|monobank|raiffeisen|oschadbank|pumb|sense|wise|stripe|paypal/.test(addr)) {
        return { text: 'Рахунок', color: '#0EA5E9' };
    }
    // Known partners → Партнер (green)
    if (/@bolt\.|@uklon\.|@uber\.|@booking\.|@expedia\.|@kayak\./.test(addr)) {
        return { text: 'Партнер', color: '#22C55E' };
    }
    // Complaints
    if (/скарг|complaint|жалоб|претенз/i.test(subj)) {
        return { text: 'Скарга', color: '#EF4444' };
    }
    // Internal
    if (/@reiz\.com\.ua$/i.test(addr)) {
        return { text: 'Команда', color: '#A855F7' };
    }
    // Big-company SaaS / no-reply → no label
    if (/noreply|no-reply|notifications?@|newsletter|marketing|@google\.com|@workspace\.|@notion\.|@github\.|@figma\.|@slack\.|@stripe\.com/.test(addr)) {
        return null;
    }
    // Default for personal emails → Клієнт
    if (/@(gmail|yahoo|hotmail|outlook|ukr\.net|i\.ua|meta\.ua|icloud|proton)\./i.test(addr)) {
        return { text: 'Клієнт', color: '#7C5CFF' };
    }
    return null;
}

function fileTypeFromMime(mime: string | null): { color: string; label: string } {
    if (!mime) return { color: '#94A3B8', label: 'FILE' };
    if (mime.includes('pdf')) return { color: '#EF4444', label: 'PDF' };
    if (mime.startsWith('image/')) return { color: '#22C55E', label: 'IMG' };
    if (mime.includes('word') || mime.includes('document')) return { color: '#3B82F6', label: 'DOC' };
    if (mime.includes('sheet') || mime.includes('excel')) return { color: '#16A34A', label: 'XLS' };
    if (mime.includes('zip') || mime.includes('archive')) return { color: '#A855F7', label: 'ZIP' };
    return { color: '#94A3B8', label: (mime.split('/')[1] || 'FILE').slice(0, 4).toUpperCase() };
}

// ── Avatar ───────────────────────────────────────────────────────────────

function Avatar({ name, addr, size = 36 }: { name: string | null; addr: string; size?: number }) {
    const color = colorFor(addr);
    const text = initialsOf(name, addr);
    return (
        <div
            className="avatar"
            style={{ background: color, width: size, height: size, fontSize: size * 0.36 }}
        >
            {text}
        </div>
    );
}

// ── Page ─────────────────────────────────────────────────────────────────

export default function MailPage() {
    const { theme } = useAdminTheme();
    const isDark = theme === 'dark';

    const [account, setAccount] = useState<MailAccount | null>(null);
    const [configured, setConfigured] = useState(true);
    const [folders, setFolders] = useState<MailFolder[]>([]);
    const [activeFolderId, setActiveFolderId] = useState<number | null>(null);

    const [messages, setMessages] = useState<MailMessageListItem[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const limit = 30;
    const [loadingList, setLoadingList] = useState(false);

    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'unread' | 'attachments' | 'flagged'>('all');

    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [selectedMsg, setSelectedMsg] = useState<MailMessageDetail | null>(null);
    const [loadingMsg, setLoadingMsg] = useState(false);

    const [composer, setComposer] = useState<null | { mode: 'new' | 'reply' | 'forward'; parent?: MailMessageDetail }>(null);
    const [checked, setChecked] = useState<Set<number>>(new Set());

    const [syncing, setSyncing] = useState(false);

    // ── Bootstrap ────────────────────────────────────────────────────────

    useEffect(() => {
        mailApi.accounts()
            .then((res) => {
                setConfigured(res.configured);
                setAccount(res.accounts[0] ?? null);
            })
            .catch((e: any) => toast.error(e?.response?.data?.msg ?? e.message));
    }, []);

    const loadFolders = useCallback(async (accountId: number) => {
        try {
            const list = await mailApi.folders(accountId);
            setFolders(list);
            if (list.length > 0 && activeFolderId == null) {
                const inbox = list.find((f) => f.specialUse === '\\Inbox') ?? list[0];
                setActiveFolderId(inbox.id);
            }
        } catch (e: any) {
            toast.error(e?.response?.data?.msg ?? e.message);
        }
    }, [activeFolderId]);

    useEffect(() => {
        if (account) loadFolders(account.id);
    }, [account, loadFolders]);

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
        return () => clearTimeout(t);
    }, [search]);

    const loadMessages = useCallback(async () => {
        if (!account || !activeFolderId) return;
        setLoadingList(true);
        try {
            const res = await mailApi.messages({
                accountId: account.id,
                folderId: activeFolderId,
                page,
                limit,
                search: debouncedSearch || undefined,
                filter,
            });
            setMessages(res.items);
            setTotal(res.total);
        } catch (e: any) {
            toast.error(e?.response?.data?.msg ?? e.message);
        } finally {
            setLoadingList(false);
        }
    }, [account, activeFolderId, page, debouncedSearch, filter]);

    useEffect(() => { loadMessages(); }, [loadMessages]);

    const handleSync = useCallback(async () => {
        if (syncing || !account) return;
        setSyncing(true);
        try {
            const res = await mailApi.sync(account.id);
            if (res.newMessages > 0) toast.success(`${res.newMessages} нових`);
            await loadFolders(account.id);
            await loadMessages();
        } catch (e: any) {
            toast.error(e?.response?.data?.msg ?? e.message);
        } finally {
            setSyncing(false);
        }
    }, [syncing, account, loadFolders, loadMessages]);

    // First sync if no folders yet
    useEffect(() => {
        if (account && folders.length === 0 && configured && !syncing) handleSync();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account, folders.length, configured]);

    // Auto-poll every 60s
    useEffect(() => {
        if (!account) return;
        const i = setInterval(() => handleSync(), 60_000);
        return () => clearInterval(i);
    }, [account, handleSync]);

    // ── Open message ────────────────────────────────────────────────────

    const openMessage = useCallback(async (id: number) => {
        setSelectedId(id);
        setLoadingMsg(true);
        setSelectedMsg(null);
        try {
            const msg = await mailApi.getOne(id);
            setSelectedMsg(msg);
            setMessages((arr) => arr.map((m) => (m.id === id ? { ...m, isSeen: true } : m)));
        } catch (e: any) {
            toast.error(e?.response?.data?.msg ?? e.message);
        } finally {
            setLoadingMsg(false);
        }
    }, []);

    const handleToggleFlag = async (msg: MailMessageDetail) => {
        const next = !msg.isFlagged;
        try {
            await mailApi.setFlagged(msg.id, next);
            setSelectedMsg({ ...msg, isFlagged: next });
            setMessages((arr) => arr.map((m) => (m.id === msg.id ? { ...m, isFlagged: next } : m)));
        } catch (e: any) { toast.error(e?.response?.data?.msg ?? e.message); }
    };

    const handleToggleSeen = async (msg: MailMessageDetail) => {
        const next = !msg.isSeen;
        try {
            await mailApi.setSeen(msg.id, next);
            setSelectedMsg({ ...msg, isSeen: next });
            setMessages((arr) => arr.map((m) => (m.id === msg.id ? { ...m, isSeen: next } : m)));
        } catch (e: any) { toast.error(e?.response?.data?.msg ?? e.message); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Перемістити лист в кошик?')) return;
        try {
            await mailApi.delete(id);
            toast.success('Видалено');
            setMessages((arr) => arr.filter((m) => m.id !== id));
            if (selectedId === id) { setSelectedId(null); setSelectedMsg(null); }
            if (account) await loadFolders(account.id);
        } catch (e: any) { toast.error(e?.response?.data?.msg ?? e.message); }
    };

    // ── Sort folders + visible counts ───────────────────────────────────

    const { systemFolders, customFolders } = useMemo(() => {
        const sys: MailFolder[] = [];
        const custom: MailFolder[] = [];
        for (const f of folders) {
            if (f.specialUse) sys.push(f); else custom.push(f);
        }
        sys.sort((a, b) => {
            const ai = SPECIAL_ORDER.indexOf(a.specialUse ?? '');
            const bi = SPECIAL_ORDER.indexOf(b.specialUse ?? '');
            return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
        });
        custom.sort((a, b) => a.name.localeCompare(b.name));
        return { systemFolders: sys, customFolders: custom };
    }, [folders]);

    const unreadInList = messages.filter((m) => !m.isSeen).length;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    // Approximate storage: sum of cached message sizes (MB). Real Hostinger
    // quota lives outside our DB — this is a best-effort indicator from synced
    // envelopes. For an exact value we'd need to query IMAP STATUS QUOTA.
    const storageMb = useMemo(() => {
        return messages.reduce((s, m) => s + (m.size ?? 0), 0) / 1024 / 1024;
    }, [messages]);

    const visibleIds = useMemo(() => messages.map((m) => m.id), [messages]);
    const allChecked = visibleIds.length > 0 && visibleIds.every((id) => checked.has(id));
    const someChecked = checked.size > 0;
    const toggleAll = () => {
        if (allChecked) setChecked(new Set());
        else setChecked(new Set(visibleIds));
    };
    const toggleOne = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setChecked((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };
    const handleBulkDelete = async () => {
        if (!confirm(`Видалити ${checked.size}?`)) return;
        for (const id of checked) {
            await mailApi.delete(id).catch(() => undefined);
        }
        setChecked(new Set());
        await loadMessages();
        if (account) await loadFolders(account.id);
    };
    const handleBulkSeen = async () => {
        for (const id of checked) {
            await mailApi.setSeen(id, true).catch(() => undefined);
        }
        setMessages((arr) => arr.map((m) => (checked.has(m.id) ? { ...m, isSeen: true } : m)));
        setChecked(new Set());
    };

    // ── Render ──────────────────────────────────────────────────────────

    if (!configured) {
        return (
            <div className="mail-page" data-theme={isDark ? 'dark' : 'light'}>
                <div className="mail-config">
                    <Inbox size={48} style={{ color: 'var(--m-primary)', marginBottom: 16 }} />
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--m-text)', marginBottom: 8 }}>
                        Пошта не налаштована
                    </h2>
                    <p style={{ fontSize: 13, color: 'var(--m-text-3)' }}>
                        Додайте у <code>.env</code> файл і перезапустіть API:
                    </p>
                    <pre>{`MAIL_USER=info@reiz.com.ua
MAIL_PASSWORD=...
MAIL_DISPLAY_NAME=REIZ
MAIL_IMAP_HOST=imap.hostinger.com
MAIL_SMTP_HOST=smtp.hostinger.com`}</pre>
                </div>
            </div>
        );
    }

    return (
        <div
            className="mail-page"
            data-theme={isDark ? 'dark' : 'light'}
            style={{
                margin: '-24px -32px',
                height: 'calc(100vh - 0px)',
                position: 'relative',
            }}
        >
            <div className="mail-app">
                {/* ═════════ Folders ═════════ */}
                <aside className="folders-panel">
                    <div className="folders-top">
                        <button type="button" className="compose-btn" onClick={() => setComposer({ mode: 'new' })}>
                            <Pencil size={16} />
                            <span>Написати</span>
                        </button>

                        {account && (
                            <div className="account-card">
                                <div className="account-avatar" style={{ background: 'linear-gradient(135deg,#7C5CFF,#A855F7)' }}>
                                    {(account.displayName || account.email)[0].toUpperCase()}
                                </div>
                                <div className="account-info">
                                    <div className="account-name">{account.displayName || 'REIZ Admin'}</div>
                                    <div className="account-email">{account.email}</div>
                                </div>
                                <ChevronDown size={14} />
                            </div>
                        )}
                    </div>

                    <div className="folders-list">
                        {systemFolders.map((f) => {
                            const Icon = SPECIAL_ICON[f.specialUse ?? ''] ?? Folder;
                            const isActive = f.id === activeFolderId && filter !== 'flagged';
                            const label = SPECIAL_LABEL_UK[f.specialUse ?? ''] ?? f.name;
                            const isInbox = f.specialUse === '\\Inbox';
                            return (
                                <Fragment key={f.id}>
                                    <button
                                        type="button"
                                        className={`folder-item ${isActive ? 'is-active' : ''}`}
                                        onClick={() => { setActiveFolderId(f.id); setFilter('all'); setPage(1); setSelectedId(null); setSelectedMsg(null); }}
                                    >
                                        <Icon size={18} />
                                        <span className="folder-name">{label}</span>
                                        {f.unreadCount > 0 && (
                                            <span className={`folder-count ${isInbox ? 'is-primary' : ''}`}>
                                                {f.unreadCount > 99 ? '99+' : f.unreadCount}
                                            </span>
                                        )}
                                    </button>
                                    {/* Insert virtual "Помічені" filter button right after Inbox */}
                                    {isInbox && (
                                        <button
                                            type="button"
                                            className={`folder-item ${filter === 'flagged' ? 'is-active' : ''}`}
                                            onClick={() => { setFilter('flagged'); setPage(1); setSelectedId(null); setSelectedMsg(null); }}
                                        >
                                            <Star size={18} />
                                            <span className="folder-name">Помічені</span>
                                        </button>
                                    )}
                                </Fragment>
                            );
                        })}

                        <div className="folders-divider">
                            <span>Власні папки</span>
                            <button type="button" className="icon-btn-xs" title="Створи папку у Hostinger webmail" disabled>
                                <Plus size={12} />
                            </button>
                        </div>
                        {customFolders.length === 0 ? (
                            <div style={{ fontSize: 11.5, color: 'var(--m-text-3)', padding: '4px 12px 8px' }}>
                                Створи папку у Hostinger webmail
                            </div>
                        ) : (
                            customFolders.map((f) => {
                                const isActive = f.id === activeFolderId && filter !== 'flagged';
                                return (
                                    <button
                                        key={f.id}
                                        type="button"
                                        className={`folder-item ${isActive ? 'is-active' : ''}`}
                                        onClick={() => { setActiveFolderId(f.id); setFilter('all'); setPage(1); setSelectedId(null); setSelectedMsg(null); }}
                                    >
                                        <Folder size={18} />
                                        <span className="folder-name">{f.name}</span>
                                        {f.unreadCount > 0 && <span className="folder-count">{f.unreadCount}</span>}
                                    </button>
                                );
                            })
                        )}
                    </div>

                    <div className="folders-storage">
                        <div className="storage-row">
                            <span>Сховище</span>
                            <span className="storage-val">{(storageMb / 1024).toFixed(1)} / 15 ГБ</span>
                        </div>
                        <div className="storage-bar">
                            <div className="storage-fill" style={{ width: `${Math.min(storageMb / (15 * 1024) * 100, 100).toFixed(1)}%` }} />
                        </div>
                    </div>

                    <div className="folders-sync">
                        <button type="button" className="sync-btn" onClick={handleSync} disabled={syncing}>
                            {syncing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                            <span>Синхронізувати</span>
                        </button>
                        {account?.lastSyncAt && (
                            <span className="sync-time">Оновлено {relativeTime(account.lastSyncAt)}</span>
                        )}
                    </div>
                </aside>

                {/* ═════════ Message list ═════════ */}
                <section className="list-col">
                    <div className="list-topbar">
                        <div className="search-input">
                            <Search size={16} />
                            <input
                                placeholder="Пошук по пошті"
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            />
                            <kbd>⌘K</kbd>
                        </div>
                        <div className="list-filters">
                            {([
                                { id: 'all', label: 'Усі' },
                                { id: 'unread', label: 'Непрочитані' },
                                { id: 'attachments', label: 'З вкладеннями' },
                                { id: 'flagged', label: 'Помічені' },
                            ] as const).map((f) => (
                                <button
                                    key={f.id}
                                    type="button"
                                    className={`chip ${filter === f.id ? 'is-on' : ''}`}
                                    onClick={() => { setFilter(f.id); setPage(1); }}
                                >
                                    {f.label}
                                    {f.id === 'unread' && unreadInList > 0 && (
                                        <span className="chip-dot">{unreadInList}</span>
                                    )}
                                </button>
                            ))}
                            <span className="list-spacer" />
                            <button type="button" className="chip chip-ghost" title="Сортування">
                                <Filter size={14} />
                                <span>Сортування</span>
                                <ChevronDown size={12} />
                            </button>
                        </div>
                    </div>

                    {someChecked ? (
                        <div className="bulk-bar">
                            <button type="button" className="check-btn is-on" onClick={toggleAll}>
                                {allChecked ? <CheckSquare size={16} /> : <Square size={16} />}
                            </button>
                            <span className="bulk-count">{checked.size} обрано</span>
                            <div className="bulk-actions">
                                <button type="button" className="bulk-action" onClick={handleBulkSeen}>
                                    <Check size={14} /><span>Прочитано</span>
                                </button>
                                <button type="button" className="bulk-action danger" onClick={handleBulkDelete}>
                                    <Trash size={14} /><span>Видалити</span>
                                </button>
                            </div>
                            <button type="button" className="bulk-close" onClick={() => setChecked(new Set())}>
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <div className="list-info">
                            <button type="button" className="check-btn" onClick={toggleAll}>
                                <Square size={16} />
                            </button>
                            <span className="list-count">
                                {total} {total === 1 ? 'лист' : total < 5 ? 'листи' : 'листів'} · {unreadInList} нових
                            </span>
                        </div>
                    )}

                    {loadingList ? (
                        <div className="list-loader">
                            <Loader2 size={20} className="animate-spin" />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="list-scroll">
                            <div className="list-empty">
                                <div className="empty-emoji">📭</div>
                                <div className="empty-title">{debouncedSearch ? 'Нічого не знайдено' : 'Немає листів'}</div>
                                <div className="empty-sub">
                                    {debouncedSearch ? 'Спробуйте інший пошук' : 'Спробуйте інший фільтр'}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="list-scroll">
                            {messages.map((m) => {
                                const isSelected = m.id === selectedId;
                                const isUnread = !m.isSeen;
                                const isChecked = checked.has(m.id);
                                const label = autoLabel(m.fromAddr, m.subject);
                                return (
                                    <div
                                        key={m.id}
                                        className={`msg-row ${isSelected ? 'is-selected' : ''} ${isUnread ? 'is-unread' : ''} ${isChecked ? 'is-checked' : ''}`}
                                        onClick={() => openMessage(m.id)}
                                    >
                                        <div className="msg-row-left">
                                            <button
                                                type="button"
                                                className="check-btn row-check"
                                                onClick={(e) => toggleOne(m.id, e)}
                                                aria-label="Обрати"
                                            >
                                                {isChecked ? <CheckSquare size={16} /> : <Square size={16} />}
                                            </button>
                                            <div className="msg-row-avatar-wrap">
                                                {isUnread && <span className="unread-dot" />}
                                                <Avatar name={m.fromName} addr={m.fromAddr} size={36} />
                                            </div>
                                        </div>
                                        <div className="msg-row-body">
                                            <div className="msg-row-line1">
                                                <span className="msg-from">{m.fromName || m.fromAddr}</span>
                                                <span className="msg-meta">
                                                    {m.hasAttachments && <Paperclip size={13} />}
                                                    {m.isFlagged && <span className="star-on"><Star size={13} fill="currentColor" /></span>}
                                                    <span className="msg-time">{formatTime(m.date)}</span>
                                                </span>
                                            </div>
                                            <div className="msg-subject">{m.subject || '(без теми)'}</div>
                                            <div className="msg-row-line3">
                                                <span className="msg-snippet">{m.snippet || ''}</span>
                                            </div>
                                            {label && (
                                                <span
                                                    className="msg-label"
                                                    style={{ color: label.color, background: label.color + '14' }}
                                                >
                                                    {label.text}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {total > limit && (
                        <div className="list-pagination">
                            <span>{(page - 1) * limit + 1}–{Math.min(page * limit, total)} з {total}</span>
                            <div style={{ display: 'flex', gap: 4 }}>
                                <button type="button" className="pager-btn" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                                    <ChevronLeft size={14} />
                                </button>
                                <button type="button" className="pager-btn" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    )}
                </section>

                {/* ═════════ Viewer ═════════ */}
                {!selectedId ? (
                    <section className="viewer-col viewer-empty">
                        <div className="viewer-empty-inner">
                            <div className="empty-illu"><Inbox size={56} /></div>
                            <div className="empty-title-lg">Виберіть лист</div>
                            <div className="empty-sub">Він з&apos;явиться тут. ←/→ для навігації, R — швидка відповідь.</div>
                            <div className="kbd-row">
                                <span><kbd>R</kbd> Відповісти</span>
                                <span><kbd>E</kbd> В архів</span>
                                <span><kbd>#</kbd> Видалити</span>
                                <span><kbd>C</kbd> Написати</span>
                            </div>
                        </div>
                    </section>
                ) : loadingMsg ? (
                    <section className="viewer-col">
                        <div className="viewer-loader">
                            <Loader2 size={28} className="animate-spin" />
                        </div>
                    </section>
                ) : selectedMsg ? (
                    <MessageViewer
                        msg={selectedMsg}
                        onReply={() => setComposer({ mode: 'reply', parent: selectedMsg })}
                        onForward={() => setComposer({ mode: 'forward', parent: selectedMsg })}
                        onDelete={() => handleDelete(selectedMsg.id)}
                        onToggleFlag={() => handleToggleFlag(selectedMsg)}
                        onToggleSeen={() => handleToggleSeen(selectedMsg)}
                        onSent={async () => {
                            toast.success('Відправлено');
                            await handleSync();
                        }}
                        accountId={account?.id ?? null}
                    />
                ) : null}
            </div>

            {/* ═════════ Composer ═════════ */}
            {composer && account && (
                <Composer
                    accountId={account.id}
                    accountEmail={account.email}
                    mode={composer.mode}
                    parent={composer.parent}
                    onClose={() => setComposer(null)}
                    onSent={async () => {
                        setComposer(null);
                        toast.success('Лист відправлено');
                        await handleSync();
                    }}
                />
            )}
        </div>
    );
}

// ── Message viewer ───────────────────────────────────────────────────────

function MessageViewer({
    msg, onReply, onForward, onDelete, onToggleFlag, onToggleSeen, onSent, accountId,
}: {
    msg: MailMessageDetail;
    onReply: () => void;
    onForward: () => void;
    onDelete: () => void;
    onToggleFlag: () => void;
    onToggleSeen: () => void;
    onSent: () => void;
    accountId: number | null;
}) {
    const [headersOpen, setHeadersOpen] = useState(false);
    const [imagesAllowed, setImagesAllowed] = useState(false);
    const [quickText, setQuickText] = useState('');
    const [quickSending, setQuickSending] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const iframeSrcDoc = useMemo(() => {
        const html = msg.bodyHtml || `<pre style="white-space:pre-wrap;font-family:inherit;margin:0;">${escapeHtml(msg.bodyText ?? '')}</pre>`;
        const safeHtml = imagesAllowed
            ? html
            : html.replace(/<img\b([^>]*?)src=["'](https?:[^"']+)["']/gi, '<img$1data-blocked-src="$2"');
        return `<!doctype html><html><head><meta charset="utf-8"><base target="_blank"><style>
            html, body { margin: 0; padding: 0; }
            body { font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 14.5px; line-height: 1.7; color: #0F1226; padding: 0; word-wrap: break-word; }
            img { max-width: 100%; height: auto; }
            a { color: #7C5CFF; }
            blockquote { border-left: 3px solid #E6E8EF; padding-left: 12px; color: #4B5063; margin: 12px 0; }
            p { margin: 0 0 12px; }
            ol, ul { padding-left: 22px; margin: 0 0 12px; }
            li { margin-bottom: 4px; }
            b, strong { font-weight: 600; }
            pre { white-space: pre-wrap; font-family: inherit; margin: 0; }
            table { max-width: 100%; }
        </style></head><body>${safeHtml}</body></html>`;
    }, [msg.bodyHtml, msg.bodyText, imagesAllowed]);

    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;
        const onLoad = () => {
            try {
                const doc = iframe.contentDocument;
                if (!doc) return;
                const h = doc.documentElement.scrollHeight;
                iframe.style.height = `${Math.max(h + 10, 240)}px`;
            } catch { /* ignore */ }
        };
        iframe.addEventListener('load', onLoad);
        return () => iframe.removeEventListener('load', onLoad);
    }, [iframeSrcDoc]);

    const hasBlockedImages = !imagesAllowed && /data-blocked-src=/i.test(iframeSrcDoc);

    const handleQuickSend = async () => {
        if (!quickText.trim() || !accountId) return;
        setQuickSending(true);
        try {
            await mailApi.send({
                accountId,
                to: [{ name: msg.fromName, address: msg.fromAddr }],
                subject: /^re:/i.test(msg.subject ?? '') ? msg.subject ?? '' : `Re: ${msg.subject ?? ''}`,
                text: quickText,
                inReplyToMessageId: msg.id,
            });
            setQuickText('');
            onSent();
        } catch (e: any) {
            toast.error(e?.response?.data?.msg ?? e.message);
        } finally {
            setQuickSending(false);
        }
    };

    const handleAttachmentDownload = (attId: number, filename: string) => {
        mailApi.downloadAttachment(msg.id, attId, filename)
            .catch((e: any) => toast.error(e?.response?.data?.msg ?? e.message));
    };

    return (
        <section className="viewer-col">
            <div className="viewer-header">
                <div className="viewer-head-top">
                    <div className="viewer-subject-wrap">
                        <h1 className="viewer-subject">{msg.subject || '(без теми)'}</h1>
                        <div className="viewer-tags">
                            <span className="badge-folder"><Inbox size={12} /> Вхідні</span>
                            {(() => {
                                const lbl = autoLabel(msg.fromAddr, msg.subject);
                                return lbl ? (
                                    <span
                                        className="msg-label"
                                        style={{ color: lbl.color, background: lbl.color + '14', marginTop: 0 }}
                                    >
                                        {lbl.text}
                                    </span>
                                ) : null;
                            })()}
                        </div>
                    </div>
                    <div className="viewer-actions">
                        <button type="button" className="iconbtn" title="Відповісти" onClick={onReply}><Reply size={16} /></button>
                        <button type="button" className="iconbtn" title="Відповісти всім" onClick={onReply}><ReplyAll size={16} /></button>
                        <button type="button" className="iconbtn" title="Переслати" onClick={onForward}><Forward size={16} /></button>
                        <span className="iconbtn-sep" />
                        <button
                            type="button"
                            className="iconbtn"
                            title="Помітити"
                            onClick={onToggleFlag}
                        >
                            <Star size={16} fill={msg.isFlagged ? '#F59E0B' : 'none'} style={{ color: msg.isFlagged ? '#F59E0B' : undefined }} />
                        </button>
                        <button type="button" className="iconbtn" title={msg.isSeen ? 'Як непрочитане' : 'Як прочитане'} onClick={onToggleSeen}>
                            <Check size={16} />
                        </button>
                        <button type="button" className="iconbtn" title="Видалити" onClick={onDelete}><Trash2 size={16} /></button>
                        <button type="button" className="iconbtn" title="Ще"><MoreVertical size={16} /></button>
                    </div>
                </div>
            </div>

            <div className="viewer-scroll">
                <div className="sender-block">
                    <Avatar name={msg.fromName} addr={msg.fromAddr} size={44} />
                    <div className="sender-info">
                        <div className="sender-row1">
                            <span className="sender-name">{msg.fromName || msg.fromAddr}</span>
                            {msg.fromName && <span className="sender-email">&lt;{msg.fromAddr}&gt;</span>}
                        </div>
                        <div className="sender-row2">
                            <span>кому: <b>{msg.toAddrs.map((a) => a.address).join(', ')}</b></span>
                            <button type="button" className="link-btn" onClick={() => setHeadersOpen((v) => !v)}>
                                {headersOpen ? 'Згорнути' : 'Розгорнути headers'}
                            </button>
                        </div>
                        {headersOpen && (
                            <div className="headers-block">
                                <div><b>From:</b> {msg.fromName ? `${msg.fromName} ` : ''}&lt;{msg.fromAddr}&gt;</div>
                                <div><b>To:</b> {msg.toAddrs.map((a) => a.address).join(', ')}</div>
                                {msg.ccAddrs && msg.ccAddrs.length > 0 && <div><b>Cc:</b> {msg.ccAddrs.map((a) => a.address).join(', ')}</div>}
                                <div><b>Date:</b> {formatDateLong(msg.date)}</div>
                                <div><b>Message-ID:</b> {msg.messageId || '—'}</div>
                                {msg.inReplyTo && <div><b>In-Reply-To:</b> {msg.inReplyTo}</div>}
                            </div>
                        )}
                    </div>
                    <div className="sender-time">{formatDateLong(msg.date)}</div>
                </div>

                {hasBlockedImages && (
                    <div className="privacy-banner">
                        <ImageIcon size={16} />
                        <span>Зображення заблоковано для конфіденційності.</span>
                        <button type="button" className="link-btn" onClick={() => setImagesAllowed(true)}>
                            Завантажити зображення
                        </button>
                    </div>
                )}

                <div className="email-body">
                    <iframe
                        ref={iframeRef}
                        title="Mail body"
                        sandbox="allow-popups allow-popups-to-escape-sandbox"
                        srcDoc={iframeSrcDoc}
                    />
                </div>

                {msg.attachments.length > 0 && (
                    <div className="attachments-block">
                        <div className="attach-head">
                            <span><Paperclip size={14} /> {msg.attachments.length} {msg.attachments.length === 1 ? 'вкладення' : 'вкладень'}</span>
                        </div>
                        <div className="attach-grid">
                            {msg.attachments.map((a) => {
                                const f = fileTypeFromMime(a.contentType);
                                return (
                                    <button
                                        key={a.id}
                                        type="button"
                                        className="attach-card"
                                        onClick={() => handleAttachmentDownload(a.id, a.filename ?? 'attachment')}
                                    >
                                        <div className="attach-thumb" style={{ background: f.color + '18', color: f.color }}>
                                            {f.label}
                                        </div>
                                        <div className="attach-meta">
                                            <div className="attach-name">{a.filename || 'вкладення'}</div>
                                            <div className="attach-size">{formatBytes(a.size)}</div>
                                        </div>
                                        <div className="attach-actions">
                                            <span className="iconbtn-sm"><Download size={14} /></span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="quick-reply">
                    <div className="qr-head">
                        <Avatar name="REIZ" addr="info@reiz.com.ua" size={32} />
                        <div className="qr-meta">
                            <span>Відповісти <b>{msg.fromName || msg.fromAddr}</b></span>
                        </div>
                        <button type="button" className="link-btn" onClick={onReply}>Повна відповідь →</button>
                    </div>
                    <textarea
                        className="qr-textarea"
                        placeholder="Напишіть швидку відповідь..."
                        value={quickText}
                        onChange={(e) => setQuickText(e.target.value)}
                    />
                    <div className="qr-foot">
                        <div className="qr-icons">
                            <span className="iconbtn-sm"><Paperclip size={14} /></span>
                            <span className="iconbtn-sm"><ImageIcon size={14} /></span>
                            <span className="iconbtn-sm"><Smile size={14} /></span>
                        </div>
                        <button
                            type="button"
                            className="qr-send"
                            disabled={!quickText.trim() || quickSending}
                            onClick={handleQuickSend}
                        >
                            {quickSending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                            <span>{quickSending ? 'Надсилаю...' : 'Надіслати'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ── Composer ─────────────────────────────────────────────────────────────

function Composer({
    accountId, accountEmail, mode, parent, onClose, onSent,
}: {
    accountId: number;
    accountEmail: string;
    mode: 'new' | 'reply' | 'forward';
    parent?: MailMessageDetail;
    onClose: () => void;
    onSent: () => void;
}) {
    const [state, setState] = useState<'normal' | 'minimized' | 'full'>('normal');

    const initialTo = useMemo<MailAddr[]>(() => {
        if (mode === 'reply' && parent) {
            return parent.replyTo && parent.replyTo.length > 0
                ? parent.replyTo
                : [{ name: parent.fromName, address: parent.fromAddr }];
        }
        return [];
    }, [mode, parent]);

    const initialSubject = useMemo(() => {
        if (!parent) return '';
        const subj = parent.subject || '';
        if (mode === 'reply') return /^re:/i.test(subj) ? subj : `Re: ${subj}`;
        if (mode === 'forward') return /^fwd:/i.test(subj) ? subj : `Fwd: ${subj}`;
        return '';
    }, [mode, parent]);

    const [to, setTo] = useState<MailAddr[]>(initialTo);
    const [toInput, setToInput] = useState('');
    const [cc, setCc] = useState<MailAddr[]>([]);
    const [ccInput, setCcInput] = useState('');
    const [showCc, setShowCc] = useState(false);
    const [subject, setSubject] = useState(initialSubject);
    const [files, setFiles] = useState<File[]>([]);
    const [savedAt, setSavedAt] = useState<Date | null>(null);
    const [suggestOpen, setSuggestOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<MailContact[]>([]);
    const [sending, setSending] = useState(false);
    const editorRef = useRef<HTMLDivElement>(null);

    // Pre-fill quoted body for reply / forward
    useEffect(() => {
        if (!editorRef.current) return;
        if (mode === 'reply' && parent) {
            const date = new Date(parent.date).toLocaleString('uk-UA');
            const from = parent.fromName ? `${parent.fromName} &lt;${parent.fromAddr}&gt;` : parent.fromAddr;
            editorRef.current.innerHTML = `<p><br/></p><p><br/></p><blockquote><p style="font-size:12px;color:#8A8FA3;">${date}, ${from} писав:</p>${parent.bodyHtml || `<p>${escapeHtml(parent.bodyText || '')}</p>`}</blockquote>`;
        } else if (mode === 'forward' && parent) {
            const date = new Date(parent.date).toLocaleString('uk-UA');
            const from = parent.fromName ? `${parent.fromName} &lt;${parent.fromAddr}&gt;` : parent.fromAddr;
            editorRef.current.innerHTML = `<p><br/></p><hr/><p><b>Від:</b> ${from}<br/><b>Дата:</b> ${date}<br/><b>Тема:</b> ${escapeHtml(parent.subject || '')}</p>${parent.bodyHtml || `<p>${escapeHtml(parent.bodyText || '')}</p>`}`;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Auto-save tick
    useEffect(() => {
        if (subject || to.length > 0) {
            const t = setTimeout(() => setSavedAt(new Date()), 1500);
            return () => clearTimeout(t);
        }
    }, [subject, to]);

    // Contact suggestions
    useEffect(() => {
        if (!toInput.trim() || toInput.length < 2) { setSuggestions([]); return; }
        const handle = setTimeout(async () => {
            try {
                const list = await mailApi.contacts(accountId, toInput.trim());
                setSuggestions(list);
            } catch { /* ignore */ }
        }, 200);
        return () => clearTimeout(handle);
    }, [toInput, accountId]);

    const exec = (cmd: string, val?: string) => {
        document.execCommand(cmd, false, val);
        editorRef.current?.focus();
    };

    const addRecipient = (addr: string, name: string | null = null) => {
        const trimmed = addr.trim().replace(/[,;]$/, '');
        if (!trimmed) return;
        setTo((prev) => [...prev, { name, address: trimmed }]);
        setToInput('');
        setSuggestOpen(false);
    };

    const removeRecipient = (i: number) => setTo((prev) => prev.filter((_, idx) => idx !== i));

    const handleSend = async () => {
        if (to.length === 0) {
            toast.error('Вкажіть отримувача');
            return;
        }
        const editorHtml = editorRef.current?.innerHTML ?? '';
        if (!subject.trim()) {
            if (!confirm('Тема порожня. Відправити?')) return;
        }
        setSending(true);
        try {
            await mailApi.send({
                accountId,
                to,
                cc: showCc ? cc : undefined,
                subject: subject || '(без теми)',
                html: editorHtml,
                text: editorRef.current?.innerText ?? '',
                inReplyToMessageId: mode === 'reply' && parent ? parent.id : undefined,
                files,
            });
            onSent();
        } catch (e: any) {
            toast.error(e?.response?.data?.msg ?? e.message);
            setSending(false);
        }
    };

    if (state === 'minimized') {
        return (
            <button type="button" className="composer-pill" onClick={() => setState('normal')}>
                <Pencil size={14} />
                <span>{subject || 'Нове повідомлення'}</span>
                <span
                    role="button"
                    className="pill-close"
                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                >
                    <X size={12} />
                </span>
            </button>
        );
    }

    return (
        <div className={`composer ${state === 'full' ? 'is-full' : ''}`}>
            <div className="composer-head">
                <span className="composer-title">
                    {mode === 'reply' ? 'Відповідь' : mode === 'forward' ? 'Переслати' : 'Нове повідомлення'}
                </span>
                <div className="composer-head-actions">
                    <button type="button" className="iconbtn-sm" onClick={() => setState('minimized')} title="Згорнути"><Minus size={14} /></button>
                    <button type="button" className="iconbtn-sm" onClick={() => setState(state === 'full' ? 'normal' : 'full')} title="На весь екран"><Maximize2 size={14} /></button>
                    <button type="button" className="iconbtn-sm" onClick={onClose} title="Закрити"><X size={14} /></button>
                </div>
            </div>

            <div className="composer-fields">
                <div className="cf-row">
                    <span className="cf-label">Від</span>
                    <span className="cf-from">
                        <span className="dot-sm" style={{ background: '#7C5CFF' }} />
                        <span>{accountEmail}</span>
                    </span>
                </div>

                <div className="cf-row cf-to-row">
                    <span className="cf-label">Кому</span>
                    <div className="chips-wrap">
                        {to.map((r, i) => (
                            <span key={i} className="recipient-chip">
                                <span className="dot-sm" style={{ background: colorFor(r.address) }} />
                                <span>{r.name || r.address}</span>
                                <button type="button" onClick={() => removeRecipient(i)}><X size={10} /></button>
                            </span>
                        ))}
                        <input
                            className="chips-input"
                            placeholder={to.length ? '' : "Введіть email або ім'я"}
                            value={toInput}
                            onChange={(e) => { setToInput(e.target.value); setSuggestOpen(true); }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ',') {
                                    e.preventDefault();
                                    addRecipient(toInput);
                                } else if (e.key === 'Backspace' && !toInput && to.length) {
                                    removeRecipient(to.length - 1);
                                }
                            }}
                            onFocus={() => setSuggestOpen(true)}
                            onBlur={() => setTimeout(() => setSuggestOpen(false), 150)}
                        />
                        {suggestOpen && suggestions.length > 0 && (
                            <div className="suggest-pop">
                                {suggestions.map((c) => (
                                    <button
                                        key={c.address}
                                        type="button"
                                        className="suggest-row"
                                        onMouseDown={() => addRecipient(c.address, c.name)}
                                    >
                                        <span className="dot-sm" style={{ background: colorFor(c.address) }} />
                                        <span className="suggest-name">{c.name || c.address}</span>
                                        {c.name && <span className="suggest-email">{c.address}</span>}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    {!showCc && (
                        <button type="button" className="link-btn" onClick={() => setShowCc(true)}>+ Cc</button>
                    )}
                </div>

                {showCc && (
                    <div className="cf-row">
                        <span className="cf-label">Cc</span>
                        <input
                            className="cf-input"
                            placeholder="cc@example.com"
                            value={ccInput}
                            onChange={(e) => setCcInput(e.target.value)}
                            onBlur={() => {
                                if (ccInput.trim()) {
                                    const items = ccInput.split(/[,;]/).map((s) => s.trim()).filter(Boolean);
                                    setCc(items.map((address) => ({ name: null, address })));
                                }
                            }}
                        />
                    </div>
                )}

                <div className="cf-row">
                    <span className="cf-label">Тема</span>
                    <input
                        className="cf-input"
                        placeholder="Тема листа"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />
                </div>
            </div>

            <div className="composer-toolbar">
                <button type="button" className="tb" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('bold')}><Bold size={14} /></button>
                <button type="button" className="tb" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('italic')}><Italic size={14} /></button>
                <button type="button" className="tb" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('underline')}><Underline size={14} /></button>
                <span className="tb-sep" />
                <button type="button" className="tb" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('insertUnorderedList')}><List size={14} /></button>
                <button type="button" className="tb" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('insertOrderedList')}><ListOrdered size={14} /></button>
                <span className="tb-sep" />
                <button
                    type="button"
                    className="tb"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => { const u = prompt('URL:'); if (u) exec('createLink', u); }}
                >
                    <LinkIcon size={14} />
                </button>
                <button type="button" className="tb" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('formatBlock', 'blockquote')}><Quote size={14} /></button>
                <button type="button" className="tb" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('justifyLeft')}><AlignLeft size={14} /></button>
                <span className="tb-sep" />
                <button type="button" className="tb" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('removeFormat')} title="Очистити форматування"><X size={14} /></button>
            </div>

            <div className="composer-body-wrap">
                <div
                    ref={editorRef}
                    className="composer-body"
                    contentEditable
                    suppressContentEditableWarning
                    data-placeholder="Напишіть ваше повідомлення..."
                />

                {files.length > 0 && (
                    <div className="composer-attachments">
                        {files.map((f, i) => {
                            const t = fileTypeFromMime(f.type);
                            return (
                                <div key={i} className="attach-card sm">
                                    <div className="attach-thumb sm" style={{ background: t.color + '18', color: t.color }}>{t.label}</div>
                                    <div className="attach-meta">
                                        <div className="attach-name">{f.name}</div>
                                        <div className="attach-size">{formatBytes(f.size)}</div>
                                    </div>
                                    <button type="button" className="iconbtn-sm" onClick={() => setFiles(files.filter((_, idx) => idx !== i))}>
                                        <X size={12} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="composer-foot">
                <button type="button" className="send-btn" onClick={handleSend} disabled={sending}>
                    {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                    <span>{sending ? 'Надсилаю...' : 'Надіслати'}</span>
                </button>
                <div className="composer-foot-icons">
                    <label className="iconbtn-sm" title="Прикріпити" style={{ cursor: 'pointer' }}>
                        <Paperclip size={15} />
                        <input
                            type="file"
                            multiple
                            style={{ display: 'none' }}
                            onChange={(e) => {
                                const f = Array.from(e.target.files ?? []);
                                setFiles((prev) => [...prev, ...f]);
                                e.target.value = '';
                            }}
                        />
                    </label>
                    <button type="button" className="iconbtn-sm" title="Вставити зображення"><ImageIcon size={15} /></button>
                    <button type="button" className="iconbtn-sm" title="Емодзі"><Smile size={15} /></button>
                    <button type="button" className="iconbtn-sm" title="Запланувати відправку"><Clock size={15} /></button>
                </div>
                <div className="composer-foot-right">
                    {savedAt && <span className="saved-text">Чернетку збережено</span>}
                    <button type="button" className="iconbtn-sm danger" onClick={onClose} title="Скасувати">
                        <Trash2 size={15} />
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── utilities ────────────────────────────────────────────────────────────

function escapeHtml(s: string): string {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
