import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/_/utils/functions";

import { MainChartsContainer } from "./_/layouts";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");

  return <MainChartsContainer />;
}
