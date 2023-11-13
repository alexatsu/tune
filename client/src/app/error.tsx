"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </main>
  );
}
