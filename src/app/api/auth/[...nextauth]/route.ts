import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter, AdapterUser } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";
import NextAuth from "next-auth/next";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      plan: string;
      image?: string | null;
    }
  }
  interface User {
    id: string;
    email: string;
    name: string;
    plan: string;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    plan: string;
    image?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          plan: user.plan,
          image: user.image
        };
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.plan = token.plan;
        session.user.image = token.image;
      }
      return session;
    },
    async jwt({ token, user, account, trigger, session }) {
      if (trigger === "update" && session?.user) {
        return { ...token, ...session.user };
      }

      if (account && user) {
        token.id = user.id;
        token.plan = user.plan;
        token.image = user.image;
        return token;
      }

      const dbUser = await prisma.user.findUnique({
        where: { id: token.id }
      });

      if (!dbUser) return token;

      return {
        ...token,
        name: dbUser.name,
        email: dbUser.email,
        plan: dbUser.plan,
        image: dbUser.image
      };
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
