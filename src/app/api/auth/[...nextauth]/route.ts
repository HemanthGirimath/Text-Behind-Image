import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { prisma } from "@/lib/prisma";
import { UserPlan } from "@/lib/utils";

// Extend the built-in session types
declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string | null;
    plan: UserPlan;
    subscriptionEndDate: Date | null;
  }

  interface Session {
    user: {
      imagesUsed: any;
      id: string;
      email: string;
      name: string | null;
      plan: UserPlan;
      subscriptionEndDate: Date | null;
    };
  }
}

// Extend JWT type
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string | null;
    plan: UserPlan;
    subscriptionEndDate: Date | null;
  }
}

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Please enter both email and password');
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
              plan: true,
              subscriptionEndDate: true,
              imagesUsed: true
            }
          });

          if (!user || !user.password) {
            throw new Error('Invalid email or password');
          }

          const isPasswordValid = await compare(credentials.password, user.password);
          if (!isPasswordValid) {
            throw new Error('Invalid email or password');
          }

          // Check if subscription has expired
          const now = new Date();
          const subscriptionExpired = user.subscriptionEndDate && user.subscriptionEndDate < now;
          
          // If subscription has expired, reset to free plan
          if (subscriptionExpired && user.plan !== 'free') {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                plan: 'free',
                subscriptionEndDate: null,
              },
            });
            user.plan = 'free';
            user.subscriptionEndDate = null;
          }

          // Validate that the plan is a valid UserPlan type
          if (!['free', 'basic', 'premium'].includes(user.plan)) {
            throw new Error('Invalid plan type in database');
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            plan: user.plan as UserPlan,
            subscriptionEndDate: user.subscriptionEndDate,
            imagesUsed: user.imagesUsed,
          };
        } catch (error) {
          console.error('Authorization error:', error);
          throw error;
        }
      },
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.plan = user.plan;
        token.subscriptionEndDate = user.subscriptionEndDate;
        token.imagesUsed = user.imagesUsed;
      }
      
      if (trigger === "update" && session?.user) {
        // Fetch fresh user data from database
        const freshUser = await prisma.user.findUnique({
          where: { email: token.email as string },
          select: {
            plan: true,
            subscriptionEndDate: true,
            imagesUsed: true,
          },
        });

        if (freshUser) {
          // Validate that the plan is a valid UserPlan type
          if (!['free', 'basic', 'premium'].includes(freshUser.plan)) {
            throw new Error('Invalid plan type in database');
          }

          token.plan = freshUser.plan as UserPlan;
          token.subscriptionEndDate = freshUser.subscriptionEndDate;
          token.imagesUsed = freshUser.imagesUsed;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          name: token.name,
          plan: token.plan,
          subscriptionEndDate: token.subscriptionEndDate,
          imagesUsed: token.imagesUsed,
        };
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
