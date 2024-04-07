import Link from "next/link";

const list = [{ title: "New card", cover: "something" }];

export default function page() {
  return (
    <div>
      chill go to <Link href={"/music"}>Music</Link>
    </div>
  );
}
