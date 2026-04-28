import adminApi from './admin';

export interface MailAddr {
    name: string | null;
    address: string;
}

export interface MailAccount {
    id: number;
    email: string;
    displayName: string | null;
    isActive: boolean;
    lastSyncAt: string | null;
    signature: string | null;
    createdAt: string;
}

export interface MailFolder {
    id: number;
    accountId: number;
    path: string;
    name: string;
    specialUse: string | null;
    unreadCount: number;
    totalCount: number;
    lastSyncAt: string | null;
}

export interface MailMessageListItem {
    id: number;
    uid: number;
    messageId: string | null;
    fromName: string | null;
    fromAddr: string;
    toAddrs: MailAddr[];
    subject: string | null;
    snippet: string | null;
    date: string;
    hasAttachments: boolean;
    size: number | null;
    isSeen: boolean;
    isFlagged: boolean;
    isAnswered: boolean;
}

export interface MailAttachmentMeta {
    id: number;
    filename: string | null;
    contentType: string | null;
    size: number | null;
}

export interface MailMessageDetail extends MailMessageListItem {
    accountId: number;
    folderId: number;
    inReplyTo: string | null;
    references: string | null;
    threadKey: string | null;
    ccAddrs: MailAddr[] | null;
    bccAddrs: MailAddr[] | null;
    replyTo: MailAddr[] | null;
    bodyText: string | null;
    bodyHtml: string | null;
    attachments: MailAttachmentMeta[];
}

export interface MailContact {
    address: string;
    name: string | null;
}

export const mailApi = {
    accounts: () =>
        adminApi.get<{accounts: MailAccount[]; configured: boolean}>('/mail/accounts').then((r) => r.data),

    sync: (accountId?: number) =>
        adminApi.post<{folders: number; newMessages: number}>('/mail/sync', accountId ? {accountId} : {}).then((r) => r.data),

    folders: (accountId: number) =>
        adminApi
            .get<{folders: MailFolder[]}>('/mail/folders', {params: {accountId}})
            .then((r) => r.data.folders),

    messages: (params: {
        accountId: number;
        folder?: string;
        folderId?: number;
        page?: number;
        limit?: number;
        search?: string;
        filter?: 'all' | 'unread' | 'flagged' | 'attachments';
    }) =>
        adminApi
            .get<{items: MailMessageListItem[]; total: number; page: number; limit: number; folder: MailFolder | null}>(
                '/mail/messages',
                {params},
            )
            .then((r) => r.data),

    getOne: (id: number) =>
        adminApi.get<{message: MailMessageDetail}>(`/mail/messages/${id}`).then((r) => r.data.message),

    setSeen: (id: number, isSeen: boolean) =>
        adminApi.patch<{message: MailMessageDetail}>(`/mail/messages/${id}`, {isSeen}).then((r) => r.data.message),

    setFlagged: (id: number, isFlagged: boolean) =>
        adminApi.patch<{message: MailMessageDetail}>(`/mail/messages/${id}`, {isFlagged}).then((r) => r.data.message),

    delete: (id: number) =>
        adminApi.delete<{ok: boolean}>(`/mail/messages/${id}`).then((r) => r.data),

    deleteBulk: (ids: number[]) =>
        adminApi
            .post<{deletedDbCount: number; succeeded: number[]; failed: {id: number; error: string}[]}>(
                '/mail/messages/delete-bulk',
                {ids},
            )
            .then((r) => r.data),

    send: (input: {
        accountId?: number;
        to: MailAddr[];
        cc?: MailAddr[];
        bcc?: MailAddr[];
        subject: string;
        text?: string;
        html?: string;
        inReplyToMessageId?: number;
        files?: File[];
    }) => {
        const fd = new FormData();
        fd.append('to', JSON.stringify(input.to));
        if (input.cc?.length) fd.append('cc', JSON.stringify(input.cc));
        if (input.bcc?.length) fd.append('bcc', JSON.stringify(input.bcc));
        fd.append('subject', input.subject);
        if (input.text) fd.append('text', input.text);
        if (input.html) fd.append('html', input.html);
        if (input.inReplyToMessageId) fd.append('inReplyToMessageId', String(input.inReplyToMessageId));
        if (input.accountId) fd.append('accountId', String(input.accountId));
        for (const f of input.files ?? []) fd.append('attachments', f);
        return adminApi
            .post<{messageId: string; sentMessageId: number | null}>('/mail/send', fd, {
                headers: {'Content-Type': 'multipart/form-data'},
            })
            .then((r) => r.data);
    },

    contacts: (accountId: number, q: string) =>
        adminApi
            .get<{contacts: MailContact[]}>('/mail/contacts', {params: {accountId, q}})
            .then((r) => r.data.contacts),

    downloadAttachment: async (messageId: number, attachmentId: number, filename: string) => {
        const res = await adminApi.get(`/mail/messages/${messageId}/attachments/${attachmentId}`, {
            responseType: 'blob',
        });
        const blob = new Blob([res.data]);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || 'attachment';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    },
};
