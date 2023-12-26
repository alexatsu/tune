import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { MusicList } from "../_/components";



export default async function Page() {
  const session = await getServerSession(authOptions);

  // if (!session) {
  //   redirect("/signin");
  // }

  return <MusicList />;
}
