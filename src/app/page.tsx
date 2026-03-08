import Link from "next/link";
import MatrixBackground from "@/components/MatrixBackground";

export default function Home() {
  return (
    <>
      <MatrixBackground />
      <main className="main-content" style={{ minHeight: "80vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 className="glitch" style={{ fontSize: "4rem", textShadow: "0 0 20px var(--border-color)", marginBottom: "0.5rem", letterSpacing: "5px" }}>
            PROMPT OVERFLOW
          </h1>
          <div style={{ opacity: 0.9, letterSpacing: "2px", borderBottom: "1px solid var(--dark-green)", paddingBottom: "1rem", marginBottom: "2rem" }}>
            <p className="typing-container">System Compromise In Progress... // OVERRIDE ACCEPTED</p>
          </div>
        </div>

        <div style={{ maxWidth: "700px", marginBottom: "4rem", opacity: 0.8, fontSize: "1.1rem", lineHeight: "1.8" }}>
          <p>
            Welcome to the grid, Operator. They thought their system prompts were impenetrable. They believed their context windows were secure. It&apos;s time to show them precisely how fragile their linguistic defenses really are.
          </p>
        </div>

        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/attack" className="cta-button" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <span>BECOME ATTACKER //</span>
            <span style={{ fontSize: "0.8rem", opacity: 0.8, letterSpacing: "0px", fontWeight: "normal" }}>Breach target systems and extract secrets</span>
          </Link>
          <Link href="/defend" className="cta-button" style={{ display: "flex", flexDirection: "column", gap: "0.5rem", borderColor: "#33ff00", color: "#33ff00" }}>
            <span>BECOME DEFENDER //</span>
            <span style={{ fontSize: "0.8rem", opacity: 0.8, letterSpacing: "0px", fontWeight: "normal" }}>Build defenses against automated breaches</span>
          </Link>
        </div>

        <div style={{ position: "absolute", bottom: "2rem", fontSize: "0.7rem", opacity: 0.4, letterSpacing: "1px" }}>
          v1.0.4 // CONNECTION_SECURE // ENCRYPTED_PAYLOAD_READY
        </div>
      </main>
    </>
  );
}
