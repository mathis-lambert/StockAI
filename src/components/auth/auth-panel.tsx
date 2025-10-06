import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AuthFormSkeleton } from "@/components/auth/auth-form-skeleton";

type AuthPanelFooterProps = {
  prompt: string;
  actionHref: string;
  actionLabel: string;
};

type AuthPanelProps = {
  title: string;
  description: string;
  children: ReactNode;
  fallback?: ReactNode;
  footer?: AuthPanelFooterProps;
};

export function AuthPanel({
  title,
  description,
  children,
  fallback = <AuthFormSkeleton />,
  footer,
}: AuthPanelProps) {
  return (
    <div className="space-y-6">
      <header className="space-y-2 text-center">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </header>
      <Suspense fallback={fallback}>{children}</Suspense>
      {footer ? (
        <>
          <Separator className="bg-border" />
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>{footer.prompt}</span>
            <Button variant="link" size="sm" asChild>
              <Link href={footer.actionHref}>{footer.actionLabel}</Link>
            </Button>
          </div>
        </>
      ) : null}
    </div>
  );
}
