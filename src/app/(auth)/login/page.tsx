import dynamic from "next/dynamic";
import { AuthPanel } from "@/components/auth/auth-panel";
import { redirectIfAuthenticated } from "@/lib/session";

const LoginForm = dynamic(() =>
  import("@/components/auth/login-form").then((mod) => ({
    default: mod.LoginForm,
  })),
);

export default async function LoginPage() {
  await redirectIfAuthenticated("/dashboard");

  return (
    <AuthPanel
      title="Se connecter"
      description="Utilisez vos identifiants professionnels pour rejoindre la plateforme."
      footer={{
        prompt: "Pas encore de compte ?",
        actionHref: "/register",
        actionLabel: "Créer un compte",
      }}
    >
      <LoginForm />
    </AuthPanel>
  );
}
