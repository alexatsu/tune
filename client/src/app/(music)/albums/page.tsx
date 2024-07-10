import { PageTitle } from "@/music/_/components";

import PageContainer from "../_/layouts/PageContainer";
import { AlbumList } from "./_/components";

export default function Page() {
  return (
    <PageContainer>
      <PageTitle title={"Albums"} />
      <AlbumList />
    </PageContainer>
  );
}
