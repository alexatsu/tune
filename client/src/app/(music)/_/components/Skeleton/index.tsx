export function Skeleton({
  className,
  amount = 5,
}: {
  className?: string;
  amount?: number;
  imagePlaceholder?: boolean;
}) {
  return (
    <>
      {[...Array(amount).keys()].map((_, index) => (
        <div key={index} className={className}>
          <div style={{ width: "40px", height: "40px" }} />
        </div>
      ))}
    </>
  );
}
