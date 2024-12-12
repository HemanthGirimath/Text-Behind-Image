import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { User } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      plan: string; // Current subscription plan
    }
  }

  interface User {
    id: string;
    email: string;
    name: string | null;
    plan: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string | null;
    plan: string;
  }
}

export const authOptions: NextAuthOptions = {
  pages:{
    signIn: "/login",
    signOut: "/logout",
    error: "/login",
    verifyRequest: "/login"
  },
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Please enter both email and password");
          }

          // Create a new PrismaClient instance for this request
          const prismaClient = new PrismaClient();
          
          try {
            const user = await prismaClient.user.findUnique({
              where: {
                email: credentials.email
              },
              select: {
                id: true,
                email: true,
                name: true,
                password: true,
                plan: true
              }
            });

            if (!user) {
              throw new Error("No user found with this email");
            }

            if (!user.password) {
              throw new Error("Please login with the method you used to create your account");
            }

            const isPasswordValid = await bcrypt.compare(
              credentials.password,
              user.password
            );

            if (!isPasswordValid) {
              throw new Error("Invalid password");
            }

            return {
              id: user.id,
              email: user.email || "",
              name: user.name,
              plan: user.plan || "free"
            };
          } finally {
            // Always disconnect the client
            await prismaClient.$disconnect();
          }
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        // Initial sign in
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.plan = user.plan;
      } else if (trigger === "update" && session?.plan) {
        // Update token if plan changes
        token.plan = session.plan;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.plan = token.plan;
      }
      return session;
    }
  },
  debug: process.env.NODE_ENV === 'development',
  events: {
    async signIn(message) {
      console.log("User signed in:", message.user.email);
    },
    async signOut(message) {
      console.log("User signed out:", message.token?.email);
    }
  }
};
