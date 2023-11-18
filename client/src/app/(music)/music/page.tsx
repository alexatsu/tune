import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "../../api/auth/[...nextauth]/route";

export default async function Page() {
  const session = await getServerSession(authOptions);
  console.log(session, "here is the session");
  console.log('rendered music page');

  if (!session) {
    redirect("/signin");
  }

  return (
    <div style={{ color: "white", height: "calc(100% - 100px)" }}>
      Here is the music
      <Link href={"/"}>Back home</Link>
    </div>
  );
}
