import Link from "next/link";

export default function Page() {
  return (
    <div style={{ color: "white" }}>
      Here is the music
      <Link href={"/"}>Back home</Link>
    </div>
  );
}
