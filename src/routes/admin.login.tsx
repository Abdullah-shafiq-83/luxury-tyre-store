import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Lock, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Login — TyreLux" },
      { name: "description", content: "Secure administrator access for TyreLux." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created. Signing you in…");
      }
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Welcome back, admin.");
      navigate({ to: "/admin" });
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.18),transparent_60%),radial-gradient(circle_at_80%_80%,hsl(var(--primary)/0.12),transparent_55%)]" />
      <Card className="relative z-10 w-full max-w-md p-8 backdrop-blur-xl bg-card/70 border-border/60 shadow-2xl">
        <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition">← Back to store</Link>
        <div className="flex items-center gap-3 mt-4 mb-6">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary/40 grid place-items-center shadow-lg shadow-primary/30">
            <ShieldCheck className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold tracking-tight">Admin Portal</h1>
            <p className="text-xs text-muted-foreground">Restricted access — admins only</p>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@tyrelux.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" disabled={busy} className="w-full h-11 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition shadow-lg shadow-primary/20">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Lock className="w-4 h-4" /> {mode === "login" ? "Sign in" : "Create admin"}</>}
          </Button>
          <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")} className="block w-full text-xs text-muted-foreground hover:text-primary transition">
            {mode === "login" ? "First-time setup? Create the admin account →" : "Already have an account? Sign in →"}
          </button>
        </form>
      </Card>
    </div>
  );
}
