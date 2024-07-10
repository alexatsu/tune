import { PageTitle } from "@/music/_/components/PageTitle";

import PageContainer from "../_/layouts/PageContainer";
import { StreamList } from "./_/components";

export default function page() {
  return (
    <PageContainer>
      <PageTitle title={"Streams"} />
      <StreamList />
    </PageContainer>
  );
}
