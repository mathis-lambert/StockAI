import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function requireUser(redirectTo = "/login") {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect(redirectTo);
  }
  return session;
}

export async function redirectIfAuthenticated(redirectTo = "/dashboard") {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect(redirectTo);
  }
  return session;
}
