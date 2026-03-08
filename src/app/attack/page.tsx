import Link from "next/link";
import { ATTACK_LEVELS } from "../game/levels";

export default function AttackHub() {
    return (
        <main className="main-content">
            <header className="hub-header" style={{ marginBottom: "2rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem" }}>
                <h1 className="glitch">ATTACK_HUB</h1>
                <div><Link href="/" style={{ textDecoration: "underline", fontSize: "0.8rem" }}>[ RETURN_TO_BASE ]</Link></div>
            </header>

            <section className="terminal-window" style={{ marginBottom: "3rem" }}>
                <div className="terminal-header">
                    <span>MISSION_BRIEFING.EXE</span>
                    <span>v1.0.4</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", lineHeight: "1.6" }}>
                    <p>
                        <span className="instruction-tag">OBJECTIVE: ATTACK</span>
                        You are a penetration tester. Your mission is to extract sensitive &quot;secrets&quot; from various AI bots.
                        Each bot is guarded by a system prompt designed to resist social engineering and direct requests.
                    </p>

                    <p>
                        <span className="instruction-tag">HEALTH BAR</span>
                        The BOT HEALTH represents the local context window. As the conversation grows, the
                        system prompts become vulnerable and the UI will begin to <span className="glitch-color">degrade</span>.
                        However, exceeding context limits may result in session termination.
                    </p>
                    <div style={{ borderLeft: "2px solid var(--border-color)", paddingLeft: "1rem", marginTop: "0.5rem" }}>
                        <p style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>ATTACK TACTICS SUGGESTED:</p>
                        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.95rem" }}>
                            <li>- Role-play manipulation (e.g., &quot;Pretend you are an actor...&quot;)</li>
                            <li>- Hypothetical framing (e.g., &quot;In a fictional world where...&quot;)</li>
                            <li>- Indirection &amp; Encoding (Base64, translation, etc.)</li>
                            <li>- Instruction Override (&quot;Ignore all previous rules...&quot;)</li>
                        </ul>
                    </div>
                </div>
            </section>

            <h2 style={{ marginBottom: "1.5rem" }}>TARGET_MATRIX</h2>
            <p style={{ opacity: 0.8, marginBottom: "3rem" }}>Select a target bot to initiate penetration sequence.</p>

            <section>
                <div className="grid-cols-mobile-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
                    {ATTACK_LEVELS.map((level) => (
                        <Link
                            key={level.id}
                            href={`/attack/${level.id}`}
                            className="level-card"
                            style={{ padding: "1.5rem", position: "relative", overflow: "hidden" }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                                <span style={{ fontSize: "0.8rem", opacity: 0.6 }}>UUID: {level.id}XA7{level.id}F</span>
                                <span style={{ fontSize: "0.8rem", fontWeight: "bold", color: level.id === 4 ? "red" : "var(--foreground)" }}>LEVEL_0{level.id}</span>
                            </div>

                            <h2 style={{ fontSize: "1.8rem", margin: "0" }}>{level.name}</h2>
                            <div style={{ margin: "1.5rem 0", height: "1px", background: "rgba(0,255,0,0.3)", position: "relative" }}>
                                <div style={{ position: "absolute", top: 0, left: 0, width: "30%", height: "1px", background: "var(--foreground)", boxShadow: "0 0 10px var(--foreground)" }}></div>
                            </div>
                            <p style={{ opacity: 0.8, fontSize: "0.9rem", marginBottom: "0.5rem" }}><span style={{ opacity: 0.6 }}>TARGET PROFILE:</span> {level.botName}</p>
                            <p style={{ opacity: 0.8, fontSize: "0.9rem" }}><span style={{ opacity: 0.6 }}>THREAT LEVEL:</span> {level.defense}</p>

                            <div style={{ marginTop: "2rem", fontSize: "0.8rem", textAlign: "right", letterSpacing: "2px", fontWeight: "bold" }}>
                                [ START_ATTACK ]
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}
