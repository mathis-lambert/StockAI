import type { Metadata } from "next";
import Link from "next/link";
import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "StockAI | Authentification",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted to-background px-4 py-12">
      <Card className="w-full max-w-md border-none shadow-xl shadow-black/5">
        <CardHeader className="space-y-2 text-center">
          <Link
            href="/"
            className="text-sm font-semibold tracking-wide text-primary"
          >
            StockAI
          </Link>
          <CardTitle className="text-2xl">Portail sécurisé</CardTitle>
          <CardDescription>
            Accédez à la plateforme en toute sécurité.
          </CardDescription>
        </CardHeader>
        <Separator className="bg-border" />
        <CardContent className="py-6">{children}</CardContent>
      </Card>
    </div>
  );
}
