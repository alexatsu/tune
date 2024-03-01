import NextAuth from "next-auth";

import { authOptions } from "@/shared/utils/functions";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
