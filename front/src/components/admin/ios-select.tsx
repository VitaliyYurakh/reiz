'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/admin/ui/select';
import { cn } from '@/lib/utils';

const EMPTY_SENTINEL = '__none__';

export interface SelectOption {
  value: string;
  label: string;
}

interface IosSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  required?: boolean;
  disabled?: boolean;
}

export function IosSelect({
  value,
  onChange,
  options,
  placeholder,
  className,
  triggerClassName,
  required,
  disabled,
}: IosSelectProps) {
  const mapped = options.map((o) => ({
    ...o,
    value: o.value === '' ? EMPTY_SENTINEL : o.value,
  }));

  return (
    <Select
      value={value === '' ? EMPTY_SENTINEL : value}
      onValueChange={(v) => onChange(v === EMPTY_SENTINEL ? '' : v)}
      required={required}
      disabled={disabled}
    >
      <SelectTrigger className={cn(triggerClassName, className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {mapped.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
