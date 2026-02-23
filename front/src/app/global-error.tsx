"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="uk">
      <body>
        <h2>Щось пішло не так</h2>
        <button type="button" onClick={() => reset()}>
          Спробувати ще раз
        </button>
      </body>
    </html>
  );
}
