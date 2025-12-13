"use client";

import React, {useEffect, useRef} from "react";
import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.css";

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

    useEffect(() => {
        const input = inputRef.current;
        if (!input) return;

        itiRef.current = intlTelInput(input, {
            initialCountry: "ua",
            separateDialCode: true,
            nationalMode: false,
        });

        const handleChange = () => {
            const selectedCountryData = itiRef.current.getSelectedCountryData();
            onChange?.(selectedCountryData.dialCode + input.value);
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
    }, [onChange]);

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

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text/plain");
        const numericData = pastedData.replace(/\D/g, "");

        if (inputRef.current) {
            itiRef.current.setNumber(inputRef.current.value + numericData);
            onChange?.(inputRef.current.value);
        }
    };

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
                // Добавляем обработчики
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
            />
        </div>
    );
}
