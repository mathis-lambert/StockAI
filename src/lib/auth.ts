import argon2 from "argon2";
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { logAuthError, logAuthInfo } from "@/lib/logger";
import { findUserByEmail } from "@/lib/user";
import { loginSchema } from "@/lib/validations/auth";
import { env } from "@/env";

export const authOptions: NextAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const startedAt = performance.now();

        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          logAuthError("auth.login", "Validation des identifiants échouée", {
            issues: parsed.error.flatten().fieldErrors,
          });
          throw new Error("Identifiants invalides");
        }

        const normalizedEmail = parsed.data.email.toLowerCase();
        const user = await findUserByEmail(normalizedEmail);
        if (!user) {
          logAuthError("auth.login", "Compte introuvable", {
            email: normalizedEmail,
          });
          throw new Error("Compte introuvable");
        }

        const passwordMatches = await argon2.verify(
          user.password,
          parsed.data.password,
        );
        if (!passwordMatches) {
          logAuthError("auth.login", "Mot de passe incorrect", {
            email: normalizedEmail,
          });
          throw new Error("Mot de passe incorrect");
        }

        const durationMs = performance.now() - startedAt;
        logAuthInfo("auth.login", "Connexion réussie", {
          email: normalizedEmail,
          userId: user._id.toString(),
          durationMs,
        });

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token?.id) {
        session.user.id = token.id as string;
      }

      if (session.user?.email) {
        session.user.email = session.user.email.toLowerCase();
      }

      return session;
    },
  },
  events: {
    async signIn({ user }) {
      logAuthInfo("auth.login", "Session ouverte", {
        userId: user.id,
        email: user.email,
      });
    },
    async signOut({ token }) {
      logAuthInfo("auth.logout", "Déconnexion", {
        userId: token?.id,
        email: token?.email,
      });
    },
    async session({ session }) {
      logAuthInfo("auth.refresh", "Session rafraîchie", {
        userId: session.user?.id,
        email: session.user?.email,
      });
    },
  },
};
