"use client";

import React, {useEffect, useRef, useCallback} from "react";
import intlTelInput from "intl-tel-input";
import "./TelInput.scss";

type TelInputProps = {
    name?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    className?: string;
    placeholder?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function TelInput({
                                     name,
                                     defaultValue,
                                     onChange,
                                     className,
                                     placeholder = "+380 ...",
                                     ...props
                                 }: TelInputProps) {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const itiRef = useRef<any>(null);
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    useEffect(() => {
        const input = inputRef.current;
        if (!input) return;

        itiRef.current = intlTelInput(input, {
            initialCountry: "ua",
            separateDialCode: true,
            nationalMode: false,
        });

        const handleChange = () => {
            const iti = itiRef.current;
            if (!iti) return;
            // getNumber() requires utils loaded, _getFullNumber() works without utils
            const number = typeof iti.getNumber === 'function' && intlTelInput.utils
                ? iti.getNumber()
                : iti._getFullNumber?.() || '';
            onChangeRef.current?.(number);
        };

        input.addEventListener("input", handleChange);
        input.addEventListener("countrychange", handleChange);

        return () => {
            input.removeEventListener("input", handleChange);
            input.removeEventListener("countrychange", handleChange);
            try {
                itiRef.current?.destroy();
            } catch (err) {
                console.warn("Safe destroy prevented removeChild error", err);
            }
            itiRef.current = null;
        };
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const allowedKeys = [
            "Backspace", "Delete", "Tab", "Escape", "Enter",
            "ArrowLeft", "ArrowRight", "Home", "End"
        ];

        if (
            allowedKeys.includes(e.key) ||
            ((e.ctrlKey || e.metaKey) && ["a", "c", "v", "x"].includes(e.key.toLowerCase()))
        ) {
            return;
        }

        if (!/^\d$/.test(e.key)) {
            e.preventDefault();
        }
    };

    const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text/plain");
        // Keep + and digits so pasting "+972532414153" works correctly
        const cleaned = pastedData.replace(/[^\d+]/g, "");

        if (inputRef.current && itiRef.current) {
            const iti = itiRef.current;
            iti.setNumber(cleaned);
            const number = typeof iti.getNumber === 'function' && intlTelInput.utils
                ? iti.getNumber()
                : iti._getFullNumber?.() || '';
            onChangeRef.current?.(number);
        }
    }, []);

    return (
        <div
            ref={wrapperRef}
            style={{width: "100%", borderRadius: "12px"}}
            className={`${className}`}
        >
            <input
                {...props}
                ref={inputRef}
                type="tel"
                name={name}
                defaultValue={defaultValue}
                placeholder={placeholder}
                className={className}
                style={{fontFamily: "Inter, sans-serif", fontSize: "14px"}}
                autoComplete="tel"
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
            />
        </div>
    );
}
