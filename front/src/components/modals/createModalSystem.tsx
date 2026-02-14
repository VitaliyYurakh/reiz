"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { lockScroll, unlockScroll } from "@/lib/utils/scroll";

export type ModalSpec = {
  [K in string]: {
    data?: unknown;
    callback?: (...args: any[]) => void | Promise<void>;
    options?: {
      closeOnOverlay?: boolean;
      closeOnEsc?: boolean;
      initialFocusSelector?: string;
    };
  };
};

type Entry<K extends string = string, D = unknown, C = unknown> = {
  key: K;
  id: string;
  isOpen: boolean;
  data: D;
  callback: C;
  options: Required<NonNullable<ModalSpec[string]["options"]>>;
  closing?: boolean;
  lastActive?: HTMLElement | null;
};

const defOpts = (): Required<NonNullable<ModalSpec[string]["options"]>> => ({
  closeOnOverlay: true,
  closeOnEsc: true,
  initialFocusSelector: "",
});

export function createModalSystem<S extends ModalSpec>() {
  type API = {
    openModal: <K extends keyof S & string>(
      key: K,
      data?: S[K]["data"],
      callback?: S[K]["callback"],
      options?: S[K]["options"],
    ) => string;
    replaceModal: <K extends keyof S & string>(
      id: string,
      key: K,
      data?: S[K]["data"],
      callback?: S[K]["callback"],
      options?: S[K]["options"],
    ) => void;
    closeModal: (id?: string) => void;
    closeAll: () => void;
    isModalOpen: (id?: string) => boolean;
    setModalData: (id: string, data: any) => void;
    getModalData: <T = unknown>(id: string) => T | undefined;
  };

  const Ctx = createContext<API | null>(null);

  function Provider<K extends keyof S & string>(props: {
    children: ReactNode;
    registry: Record<
      K,
      (args: {
        id: string;
        data: S[K]["data"];
        close: () => void;
        replace: (
          data?: S[K]["data"],
          cb?: S[K]["callback"],
          opts?: S[K]["options"],
        ) => void;
        runCallback: (...a: any[]) => any;
        isClosing: boolean;
      }) => ReactNode
    >;
    classNames?: { overlayActive?: string; overlay?: string };
  }) {
    const { children, registry, classNames } = props;

    const initialEntries = useMemo(() => {
      const map: Record<string, Entry> = {};
      (Object.keys(registry) as K[]).forEach((key) => {
        map[key] = {
          key: key as string,
          id: key as string,
          isOpen: false,
          data: undefined,
          callback: undefined,
          options: defOpts(),
          closing: false,
          lastActive: null,
        };
      });
      return map;
    }, [registry]);

    const [entries, setEntries] =
      useState<Record<string, Entry>>(initialEntries);
    const [order, setOrder] = useState<string[]>([]);

    const hasModals = order.length > 0;
    useEffect(() => {
      if (hasModals) {
        lockScroll();
        return () => unlockScroll();
      }
    }, [hasModals]);

    const openModal = useCallback(
      <KK extends keyof S & string>(
        key: KK,
        data?: S[KK]["data"],
        callback?: S[KK]["callback"],
        options?: S[KK]["options"],
      ) => {
        setEntries((prev) => ({
          ...prev,
          [key]: {
            ...prev[key],
            isOpen: true,
            closing: false,
            data: data as any,
            callback: callback as any,
            options: { ...prev[key].options, ...(options || {}) },
            lastActive: document.activeElement as HTMLElement,
          },
        }));
        setOrder((prev) => (prev.includes(key) ? prev : [...prev, key]));
        return key;
      },
      [],
    );

    const replaceModal = useCallback(
      <KK extends keyof S & string>(
        id: string,
        key: KK,
        data?: S[KK]["data"],
        callback?: S[KK]["callback"],
        options?: S[KK]["options"],
      ) => {
        setEntries((prev) => ({
          ...prev,
          [id]: {
            ...prev[id],
            key: key as string,
            data: data as any,
            callback: callback as any,
            options: { ...prev[id].options, ...(options || {}) },
          },
        }));
      },
      [],
    );

    const closeModal = useCallback(
      (id?: string) => {
        const key = id ?? order[order.length - 1];
        if (!key) return;

        setEntries((prev) => {
          const key = id ?? order[order.length - 1];
          if (!key) return prev;
          const e = prev[key];
          if (!e || !e.isOpen) return prev;
          return { ...prev, [key]: { ...e, isOpen: false, closing: true } };
        });

        setTimeout(() => {
          setOrder((prev) => prev.filter((k) => k !== id));
        }, 200);
      },
      [order],
    );

    const closeAll = useCallback(() => {
      setEntries((prev) => {
        const copy = { ...prev };
        order.forEach((k) => {
          copy[k] = { ...copy[k], isOpen: false, closing: true };
        });
        return copy;
      });

      setTimeout(() => {
        setOrder([]);
      }, 200);
    }, [order]);

    const isModalOpen = useCallback(
      (id?: string) => {
        if (!id) return order.length > 0;
        return !!entries[id]?.isOpen;
      },
      [entries, order.length],
    );

    const setModalData = useCallback((id: string, data: any) => {
      setEntries((prev) => ({ ...prev, [id]: { ...prev[id], data } }));
    }, []);
    const getModalData = useCallback(
      <T = unknown>(id: string) => entries[id]?.data as T | undefined,
      [entries],
    );

    const topKey = order[order.length - 1];
    useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
        if (!topKey) return;
        if (entries[topKey]?.options.closeOnEsc && e.key === "Escape")
          closeModal(topKey);
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [topKey, entries, closeModal]);

    const api = useMemo(
      () => ({
        openModal,
        replaceModal,
        closeModal,
        closeAll,
        isModalOpen,
        setModalData,
        getModalData,
      }),
      [
        openModal,
        replaceModal,
        closeModal,
        closeAll,
        isModalOpen,
        setModalData,
        getModalData,
      ],
    );

    return (
      <Ctx.Provider value={api}>
        {children}

        {(Object.keys(registry) as K[]).map((key) => {
          const Comp = registry[key] as unknown as (args: {
            id: string;
            data: any;
            close: () => void;
            isClosing: boolean;
            replace: (data?: any, cb?: any, opts?: any) => void;
            runCallback: (...a: any[]) => any;
          }) => React.ReactNode;

          const entry = entries[key];
          const index = order.indexOf(key);
          const isOpen = entry.isOpen;
          const isClosing = !!entry.closing;
          const isVisible = isOpen || isClosing;
          const isTop = index === order.length - 1 && index !== -1;

          return (
            <div
              key={key}
              className={[
                classNames?.overlay ?? "overlay fixed-block",
                isOpen && !isClosing
                  ? (classNames?.overlayActive ?? "active mode")
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{
                zIndex: 1000 + Math.max(index, 0) * 2,
                paddingRight: 0,
              }}
              aria-hidden={!isVisible}
              onClick={(ev) => {
                if (
                  isTop &&
                  entries[key].options.closeOnOverlay &&
                  ev.target === ev.currentTarget
                ) {
                  closeModal(key);
                }
              }}
            >
              {isVisible && (
                <Comp
                  id={key}
                  data={entry.data}
                  isClosing={isClosing}
                  close={() => closeModal(key)}
                  replace={(data?: any, cb?: any, opts?: any) =>
                    replaceModal(key, key as K, data, cb, opts)
                  }
                  runCallback={(...a: any[]) => (entry.callback as any)?.(...a)}
                />
              )}
            </div>
          );
        })}
      </Ctx.Provider>
    );
  }

  const useModalContext = () => {
    const ctx = useContext(Ctx);
    if (!ctx)
      throw new Error("useModalContext must be used within ModalProvider");
    return ctx;
  };

  function useModal<K extends keyof S & string>(key: K) {
    const ctx = useModalContext();
    return {
      open: (
        data?: S[K]["data"],
        callback?: S[K]["callback"],
        options?: S[K]["options"],
      ) => ctx.openModal(key, data, callback, options),
      closeTop: () => ctx.closeModal(),
      closeAll: ctx.closeAll,
      isAnyOpen: () => ctx.isModalOpen(),
    };
  }

  return { Provider, useModal, useModalContext };
}
