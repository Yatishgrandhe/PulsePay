"use client";
import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else setSuccess("Registration successful! Check your email to confirm.");
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
        <h2 className="pulsepay-title" style={{ fontSize: "2rem" }}>Create Your PulsePay Account</h2>
        <form style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1.2rem" }} onSubmit={handleRegister}>
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
            autoComplete="new-password"
            style={{ padding: "0.8rem 1.2rem", borderRadius: "1rem", border: "2px solid var(--pulsepay-purple)", fontSize: "1.1rem" }}
          />
          <button
            type="submit"
            disabled={loading}
            className="pulsepay-btn"
            style={{ width: "100%" }}
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>
        {error && <div style={{ color: "#e53935", textAlign: "center", marginTop: "0.5rem" }}>{error}</div>}
        {success && <div style={{ color: "#43a047", textAlign: "center", marginTop: "0.5rem" }}>{success}</div>}
        <div style={{ textAlign: "center", marginTop: "1rem", color: "var(--pulsepay-blue)" }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: "var(--pulsepay-gold)", textDecoration: "underline", fontWeight: 700 }}>Sign In</Link>
        </div>
      </section>
    </main>
  );
} 