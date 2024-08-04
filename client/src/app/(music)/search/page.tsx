import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/_/utils/functions";
import { PageTitle } from "@/music/_/components";

import PageContainer from "../_/layouts/PageContainer";
import { SearchPageContainer } from "./_/layouts/SearchPageContainer";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");

  return (
    <PageContainer>
      <PageTitle title={"Search"} />
      <SearchPageContainer />
    </PageContainer>
  );
}
