import Link from "next/link";

export default function Page() {
  return (
    <div>
      albums go to <Link href={"/music"}>Music</Link>
    </div>
  );
}
