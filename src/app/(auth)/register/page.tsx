import dynamic from "next/dynamic";
import { AuthPanel } from "@/components/auth/auth-panel";
import { redirectIfAuthenticated } from "@/lib/session";

const RegisterForm = dynamic(
  () =>
    import("@/components/auth/register-form").then((mod) => ({
      default: mod.RegisterForm,
    })),
  { suspense: true },
);

export default async function RegisterPage() {
  await redirectIfAuthenticated("/dashboard");

  return (
    <AuthPanel
      title="Créer un compte"
      description="Rejoignez StockAI en quelques secondes."
      footer={{
        prompt: "Déjà membre ?",
        actionHref: "/login",
        actionLabel: "Se connecter",
      }}
    >
      <RegisterForm />
    </AuthPanel>
  );
}
