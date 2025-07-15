"use client";
import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else setSuccess("Logged in! Redirecting...");
    setLoading(false);
  };

  const handleMagicLink = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setError(error.message);
    else setSuccess("Magic link sent! Check your email.");
    setLoading(false);
  };

  return (
    <main style={{ minHeight: "80vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <section className="pulsepay-container">
        <Image
          src="/image.png"
          alt="PulsePay Logo"
          width={90}
          height={90}
          className="pulsepay-logo"
          priority
        />
        <h2 className="pulsepay-title" style={{ fontSize: "2rem" }}>Sign In to PulsePay</h2>
        <form style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1.2rem" }} onSubmit={handleLogin}>
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="pulsepay-input"
            autoComplete="email"
            style={{ padding: "0.8rem 1.2rem", borderRadius: "1rem", border: "2px solid var(--pulsepay-purple)", fontSize: "1.1rem" }}
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="pulsepay-input"
            autoComplete="current-password"
            style={{ padding: "0.8rem 1.2rem", borderRadius: "1rem", border: "2px solid var(--pulsepay-purple)", fontSize: "1.1rem" }}
          />
          <button
            type="submit"
            disabled={loading}
            className="pulsepay-btn"
            style={{ width: "100%" }}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <button
          onClick={handleMagicLink}
          disabled={loading || !email}
          className="pulsepay-btn alt"
          style={{ width: "100%", marginTop: "0.5rem" }}
        >
          {loading ? "Sending..." : "Send Magic Link"}
        </button>
        {error && <div style={{ color: "#e53935", textAlign: "center", marginTop: "0.5rem" }}>{error}</div>}
        {success && <div style={{ color: "#43a047", textAlign: "center", marginTop: "0.5rem" }}>{success}</div>}
        <div style={{ textAlign: "center", marginTop: "1rem", color: "var(--pulsepay-blue)" }}>
          Don&apos;t have an account?{' '}
          <Link href="/register" style={{ color: "var(--pulsepay-gold)", textDecoration: "underline", fontWeight: 700 }}>Sign Up</Link>
        </div>
      </section>
    </main>
  );
} 