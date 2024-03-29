import Link from "next/link";

export function page() {
  return (
    <div>
      chill go to <Link href={"/music"}>Music</Link>
    </div>
  );
}
