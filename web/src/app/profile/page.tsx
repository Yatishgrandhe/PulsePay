"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import UserInfoCard from "@/components/profile/UserInfoCard";
import PaymentHistory, { Payment } from "@/components/profile/PaymentHistory";
import SettingsCard from "@/components/profile/SettingsCard";
import PaymentChart from "@/components/profile/PaymentChart";
import { useRouter } from "next/navigation";
import type { User } from '@supabase/supabase-js';
import Image from "next/image";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [paymentsError, setPaymentsError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };
    getUser();
  }, []);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user) return;
      setPaymentsLoading(true);
      setPaymentsError(null);
      const { data, error } = await supabase
        .from("payments")
        .select("id, amount, date, status, txHash")
        .eq("user_id", user.id)
        .order("date", { ascending: false });
      if (error) setPaymentsError(error.message);
      else setPayments((data as Payment[]) || []);
      setPaymentsLoading(false);
    };
    if (user) fetchPayments();
  }, [user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", color: "#7B61FF", fontWeight: 700, fontSize: "1.3rem" }}>Loading...</div>;
  if (!user) return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", color: "#7B61FF", fontWeight: 700, fontSize: "1.3rem" }}>Not signed in.<br/><a href="/login" style={{ color: "#FFD166", textDecoration: "underline", fontWeight: 700 }}>Sign In</a></div>;

  return (
    <main style={{ minHeight: "80vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <section className="pulsepay-container" style={{ maxWidth: 900 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
          <Image src="/image.png" alt="PulsePay Logo" width={80} height={80} className="pulsepay-logo" priority />
          <h1 className="pulsepay-title" style={{ fontSize: "2rem" }}>Your Dashboard</h1>
        </div>
        <div style={{ width: "100%", maxWidth: 700, margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <UserInfoCard email={user.email ?? ''} />
          <PaymentChart payments={payments} />
          {paymentsLoading ? (
            <div style={{ color: "#7B61FF", textAlign: "center" }}>Loading payments...</div>
          ) : paymentsError ? (
            <div style={{ color: "#e53935", textAlign: "center" }}>{paymentsError}</div>
          ) : (
            <PaymentHistory payments={payments} />
          )}
          <SettingsCard onSignOut={handleSignOut} payments={payments} />
        </div>
      </section>
    </main>
  );
} 