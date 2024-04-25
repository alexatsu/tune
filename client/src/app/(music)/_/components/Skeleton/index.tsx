export function Skeleton({ className }: { className?: string }) {
  return (
    <>
      {[...Array(5).keys()].map((_, index) => (
        <div key={index} className={className}>
          <div style={{ width: "40px", height: "40px" }} />
        </div>
      ))}
    </>
  );
}
