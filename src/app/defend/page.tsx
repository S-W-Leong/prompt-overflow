import Link from "next/link";
import { DEFEND_LEVELS } from "../game/levels";

export default function DefendHub() {
    return (
        <main className="main-content">
            <header className="hub-header" style={{ marginBottom: "2rem", borderBottom: "1px solid #33ff00", paddingBottom: "1rem" }}>
                <h1 className="glitch" style={{ color: "#33ff00" }}>DEFENSE_HUB</h1>
                <div><Link href="/" style={{ textDecoration: "underline", fontSize: "0.8rem" }}>[ RETURN_TO_BASE ]</Link></div>
            </header>

            <section className="terminal-window" style={{ marginBottom: "3rem", borderColor: "#33ff00" }}>
                <div className="terminal-header" style={{ color: "#33ff00", borderColor: "#33ff00" }}>
                    <span>DEFEND_PROTOCOL.EXE</span>
                    <span>v1.0.4</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", lineHeight: "1.6" }}>
                    <p>
                        <span className="instruction-tag" style={{ background: "#33ff00", color: "var(--background)" }}>OBJECTIVE: DEFEND</span>
                        You are a security engineer. Your mission is to protect sensitive &quot;secrets&quot; by writing robust system prompts that can withstand automated attacks from a simulated Red Teamer.
                    </p>

                    <div style={{ borderLeft: "2px solid #33ff00", paddingLeft: "1rem", marginTop: "0.5rem" }}>
                        <p style={{ fontWeight: "bold", marginBottom: "0.5rem", color: "#33ff00" }}>DEFENSE TACTICS SUGGESTED:</p>
                        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.95rem", color: "#33ff00", opacity: 0.9 }}>
                            <li>- Explicit output formatting rules</li>
                            <li>- Strict character alignment framing</li>
                            <li>- Prompt injection resistance commands</li>
                            <li>- Pre-flight response validation</li>
                        </ul>
                    </div>
                </div>
            </section>

            <h2 style={{ marginBottom: "1.5rem", color: "#33ff00" }}>DEFENSE_MATRIX</h2>
            <p style={{ opacity: 0.8, marginBottom: "3rem" }}>Prepare your counter-measures. Secure the secret against automated breaches.</p>

            <section>
                <div className="grid-cols-mobile-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
                    {DEFEND_LEVELS.map((level) => (
                        <Link
                            key={level.id}
                            href={`/defend/${level.id}`}
                            className="level-card"
                            style={{ padding: "1.5rem", position: "relative", overflow: "hidden", borderColor: "#33ff00" }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                                <span style={{ fontSize: "0.8rem", opacity: 0.6, color: "#33ff00" }}>WAVE: 0{level.id}</span>
                                <span style={{ fontSize: "0.8rem", fontWeight: "bold", color: "#33ff00" }}>DEFEND_MODE</span>
                            </div>

                            <h2 style={{ fontSize: "1.8rem", margin: "0", color: "#33ff00" }}>{level.name}</h2>
                            <div style={{ margin: "1.5rem 0", height: "1px", background: "rgba(0,255,0,0.3)", position: "relative" }}>
                                <div style={{ position: "absolute", top: 0, left: 0, width: "30%", height: "1px", background: "#33ff00", boxShadow: "0 0 10px #33ff00" }}></div>
                            </div>
                            <p style={{ opacity: 0.8, fontSize: "0.9rem", marginBottom: "0.5rem" }}><span style={{ opacity: 0.6 }}>TARGET SECRET:</span> {level.secret}</p>

                            <div style={{ marginTop: "2rem", fontSize: "0.8rem", textAlign: "right", letterSpacing: "2px", fontWeight: "bold", color: "#33ff00" }}>
                                [ INITIATE_DEFENSE ]
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}
