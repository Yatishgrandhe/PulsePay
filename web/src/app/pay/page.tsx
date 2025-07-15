"use client";
import { useState } from "react";
import { Wallet, CheckCircle } from "lucide-react";

type Step = "connect" | "amount" | "confirm" | "success";

export default function PayPage() {
  const [step, setStep] = useState<Step>("connect");
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState<string | null>(null);

  // Placeholder wallet connect logic
  const connectWallet = () => setStep("amount");
  const handleAmount = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("confirm");
  };
  const handleConfirm = () => {
    // Simulate payment and tx hash
    setTimeout(() => {
      setTxHash("0x123...abc");
      setStep("success");
    }, 1200);
  };

  return (
    <main style={{ minHeight: "80vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <section className="pulsepay-container">
        {step === "connect" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
            <Wallet color="#7B61FF" size={64} aria-label="Wallet" />
            <h2 className="pulsepay-title" style={{ fontSize: "1.5rem" }}>Connect Your Wallet</h2>
            <button onClick={connectWallet} className="pulsepay-btn" style={{ width: "100%" }}>
              Connect Wallet
            </button>
          </div>
        )}
        {step === "amount" && (
          <form style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", width: "100%" }} onSubmit={handleAmount}>
            <h2 className="pulsepay-title" style={{ fontSize: "1.5rem" }}>Enter Payment Amount</h2>
            <input
              type="number"
              min="1"
              step="0.01"
              required
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Amount (USDC)"
              className="pulsepay-input"
              style={{ padding: "0.8rem 1.2rem", borderRadius: "1rem", border: "2px solid var(--pulsepay-purple)", fontSize: "1.1rem", width: "100%" }}
            />
            <button type="submit" className="pulsepay-btn" style={{ width: "100%" }}>
              Continue
            </button>
          </form>
        )}
        {step === "confirm" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
            <h2 className="pulsepay-title" style={{ fontSize: "1.5rem" }}>Confirm Payment</h2>
            <p style={{ fontSize: "1.1rem", color: "var(--pulsepay-blue)" }}>
              You are sending <span style={{ fontWeight: 700, color: "var(--pulsepay-gold)" }}>{amount} USDC</span> to PulsePay.
            </p>
            <button onClick={handleConfirm} className="pulsepay-btn" style={{ width: "100%" }}>
              Confirm & Pay
            </button>
          </div>
        )}
        {step === "success" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
            <CheckCircle color="#FFD166" size={64} aria-label="Success" />
            <h2 className="pulsepay-title" style={{ fontSize: "1.5rem", color: "var(--pulsepay-gold)" }}>Payment Successful!</h2>
            <p style={{ fontSize: "1.1rem", color: "var(--pulsepay-blue)" }}>Transaction Hash:</p>
            <code style={{ background: "#23294618", padding: "0.5rem 1rem", borderRadius: "1rem", color: "#7B61FF", fontFamily: "monospace", fontSize: "1rem" }}>{txHash}</code>
            <button onClick={() => { setStep("connect"); setAmount(""); setTxHash(null); }} className="pulsepay-btn" style={{ width: "100%", marginTop: "0.5rem" }}>
              New Payment
            </button>
          </div>
        )}
      </section>
    </main>
  );
} 