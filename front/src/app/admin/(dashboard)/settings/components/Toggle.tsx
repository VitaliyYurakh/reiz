'use client';

export function Toggle({
  checked,
  onChange,
  size = 'md',
}: {
  checked: boolean;
  onChange: () => void;
  size?: 'sm' | 'md';
}) {
  const isSm = size === 'sm';
  const dotLeft = isSm
    ? (checked ? 18 : 2)
    : (checked ? 22 : 2);

  return (
    <div
      onClick={onChange}
      className={`h-toggle ${isSm ? 'h-toggle-sm' : ''} ${checked ? 'h-toggle-on' : 'h-toggle-off'}`}
    >
      <div
        className="h-toggle-dot"
        style={{ left: dotLeft }}
      />
    </div>
  );
}
