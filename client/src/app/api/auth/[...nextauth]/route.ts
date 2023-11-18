import NextAuth, { AuthOptions, Profile } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { db } from "@/shared/services";

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/signin",
    signOut: "/",
    error: "/error",
  },
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "database",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const existingUser = await db.user.findUnique({
        where: { id: user.id },
      });

      if (!existingUser) {
        return false;
      }

      const googleProfilePicture = profile as Profile & { picture?: string };
      const githubProfilePicture = profile as Profile & { avatar_url?: string };

      await db.user.update({
        where: { id: existingUser?.id },
        data: {
          name: profile?.name,
          image: account?.provider
            ? googleProfilePicture?.picture
            : githubProfilePicture?.avatar_url,
        },
      });

      await db.$disconnect();
      return true;
    },
    async session({ session, user, token }) {
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
