"use client";

const LAUNCH_YEAR = 2025;

type Props = {
  text: string;
};

export default function CopyrightYear({ text }: Props) {
  const currentYear = new Date().getFullYear();
  const years =
    currentYear > LAUNCH_YEAR
      ? `${LAUNCH_YEAR}–${currentYear}`
      : String(LAUNCH_YEAR);

  return <span suppressHydrationWarning>{`© ${years} ${text}`}</span>;
}
