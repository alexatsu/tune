import { PrismaAdapter } from "@auth/prisma-adapter";
import { AuthOptions, Profile } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { db } from "@/api/_/services";

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/signin",
    signOut: "/",
    error: "/error",
  },
  adapter: PrismaAdapter(db) as Adapter,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "database",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GH_ID ?? "",
      clientSecret: process.env.GH_SECRET ?? "",
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
      const googleProfilePicture = profile as Profile & { picture?: string };
      const githubProfilePicture = profile as Profile & { avatar_url?: string };

      if (!existingUser) {
        const newUser = await db.user.create({
          data: {
            id: user.id,
            name: profile?.name,
            image: account?.provider
              ? googleProfilePicture?.picture
              : githubProfilePicture?.avatar_url,
          },
        });
        await db.$disconnect();
        return true;
      }

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
  // events: {
  //   async signOut({ token, session }) {
  //     signOut();
  //   },
  // },
};
