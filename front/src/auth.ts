import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      clientId: number;
      email: string;
      name: string;
      image?: string | null;
    };
  }
}

declare module "next-auth" {
  interface User {
    clientId?: number;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    clientId?: number;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/auth/login",
    newUser: "/account",
  },
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        const account = await prisma.customerAccount.findUnique({
          where: { email },
          include: { client: true },
        });

        if (!account || !account.passwordHash || !account.isActive || account.deletedAt) {
          return null;
        }

        if (account.client.isBlocked) return null;

        const valid = await compare(password, account.passwordHash);
        if (!valid) return null;

        return {
          id: account.id,
          email: account.email,
          name: `${account.client.firstName} ${account.client.lastName}`,
          image: account.avatarUrl,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const email = user.email!;

        // Check if blocked or deleted
        const existing = await prisma.customerAccount.findUnique({
          where: { email },
          include: { client: true },
        });

        if (existing) {
          if (existing.deletedAt || !existing.isActive || existing.client.isBlocked) {
            return false;
          }
          // Link Google ID if not set
          if (!existing.googleId) {
            await prisma.customerAccount.update({
              where: { id: existing.id },
              data: {
                googleId: account.providerAccountId,
                emailVerified: new Date(),
                avatarUrl: user.image,
              },
            });
          }
          return true;
        }

        // Create new Client + CustomerAccount for Google sign-in
        const nameParts = (user.name || "").split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        const client = await prisma.client.create({
          data: {
            firstName,
            lastName,
            phone: "",
            email,
          },
        });

        await prisma.customerAccount.create({
          data: {
            email,
            clientId: client.id,
            googleId: account.providerAccountId,
            emailVerified: new Date(),
            avatarUrl: user.image,
          },
        });

        return true;
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        // On initial sign-in, load clientId and picture
        const customerAccount = await prisma.customerAccount.findUnique({
          where: { email: token.email! },
        });
        if (customerAccount) {
          token.clientId = customerAccount.clientId;
          token.sub = customerAccount.id;
        }
        if (user.image) {
          token.picture = user.image;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token.clientId) {
        session.user.clientId = token.clientId as number;
        session.user.id = token.sub!;
      }
      if (token.picture) {
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
});
