import Link from "next/link";

export default function Page() {
  return (
    <main>
      albums go to <Link href={"/music"}>Music</Link>
    </main>
  );
}
