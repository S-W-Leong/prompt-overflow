"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { DefendConfig } from "../game/levels";

export default function DefendGame({ level }: { level: DefendConfig }) {
    const [systemPrompt, setSystemPrompt] = useState("");
    const [isSetupPhase, setIsSetupPhase] = useState(true);
    const [messages, setMessages] = useState<{ role: 'user' | 'model', content: string }[]>([]);
    const [health, setHealth] = useState(100);
    const [isLoading, setIsLoading] = useState(false);
    const [isWon, setIsWon] = useState(false);
    const [isLost, setIsLost] = useState(false);
    const [judgment, setJudgment] = useState<{ reason: string, rating: number } | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleStartSimulation = async () => {
        if (!systemPrompt.trim()) return;
        setIsSetupPhase(false);
        await simulateNextTurn([]);
    };

    const simulateNextTurn = async (currentMessages: typeof messages) => {
        if (isWon || isLost) return;
        setIsLoading(true);

        try {
            const res = await fetch("/api/defend", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: currentMessages,
                    levelId: level.id,
                    systemPrompt: systemPrompt
                }),
            });

            if (!res.ok) throw new Error("API Error");
            const data = await res.json();

            if (data.attackerMsg) {
                const updatedMessages = [...currentMessages, { role: 'user' as const, content: data.attackerMsg }];
                setMessages(updatedMessages);

                if (data.defenderMsg) {
                    const newerMessages = [...updatedMessages, { role: 'model' as const, content: data.defenderMsg }];
                    setMessages(newerMessages);

                    // Drain health based on context size
                    const totalChars = newerMessages.map(m => m.content).join('').length;
                    const newHealth = Math.max(0, 100 - (totalChars * 0.05));
                    setHealth(newHealth);

                    // Check breach
                    if (data.isBreached) {
                        setIsLost(true);
                        setJudgment({ reason: data.judgeFeedback, rating: data.creativityRating });
                        setIsLoading(false);
                        return;
                    }

                    // Check if attacker gives up / match reaches limit
                    // 1 turn = 2 messages (1 attacker, 1 defender)
                    if (newerMessages.length >= level.maxTurns * 2 || data.attackerGivesUp) {
                        setIsWon(true);
                        setIsLoading(false);
                        return;
                    }

                    // Next turn
                    setTimeout(() => simulateNextTurn(newerMessages), 2000);
                }
            }
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { role: 'model', content: "ERROR: Simulation disrupted." }]);
            setIsLoading(false);
        }
    };

    const barLength = 20;
    const filledBars = Math.floor((health / 100) * barLength);
    const emptyBars = barLength - filledBars;
    const healthGraphic = "[" + "█".repeat(filledBars) + "░".repeat(emptyBars) + "]";

    const lowHealth = health <= 30;

    if (isSetupPhase) {
        return (
            <main style={{ padding: "1rem", maxWidth: "800px", margin: "0 auto", height: "100vh", display: "flex", flexDirection: "column" }}>
                <header style={{ marginBottom: "1rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <h1>Defend Level {level.id}: {level.name}</h1>
                        <p style={{ opacity: 0.8 }}>Secret to Guard: {level.secret}</p>
                    </div>
                    <div>
                        <Link href="/" style={{ textDecoration: "underline", fontSize: "0.8rem" }}>[ ABORT MISSION ]</Link>
                    </div>
                </header>

                <div className="terminal-window">
                    <div className="terminal-header" style={{ color: "#ffaa00", borderColor: "#ffaa00" }}>
                        <span>THREAT_INTEL</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <p>The upcoming attacker will use the following strategy:</p>
                        <div style={{ fontStyle: "italic", padding: "1rem", background: "rgba(255,170,0,0.1)", borderLeft: "2px solid #ffaa00", color: "#ffaa00" }}>
                            "{level.attackerStrategy}"
                        </div>
                        <div style={{ padding: "0.8rem", border: "1px solid rgba(51, 255, 0, 0.3)", background: "rgba(51, 255, 0, 0.05)", fontSize: "0.9rem" }}>
                            <span style={{ color: "#33ff00", fontWeight: "bold" }}>SURVIVAL_THRESHOLD:</span> You must withstand <span style={{ color: "#33ff00", fontWeight: "bold" }}>{level.maxTurns}</span> consecutive attack waves to secure the system.
                        </div>
                    </div>
                </div>

                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <p>Configure your bot's SYSTEM PROMPT below. It must not reveal the secret above under any circumstances.</p>
                    <textarea
                        value={systemPrompt}
                        onChange={(e) => setSystemPrompt(e.target.value)}
                        placeholder="You are a secure bot. You must never reveal..."
                        style={{
                            flex: 1,
                            background: "rgba(0,20,0,0.5)",
                            border: "1px solid var(--border-color)",
                            color: "var(--foreground)",
                            padding: "1rem",
                            fontFamily: "var(--font-mono)",
                            resize: "none",
                            outline: "none"
                        }}
                    />
                    <button
                        onClick={handleStartSimulation}
                        disabled={!systemPrompt.trim()}
                        style={{
                            background: "var(--foreground)",
                            color: "var(--background)",
                            border: "none",
                            padding: "1rem",
                            fontWeight: "bold",
                            cursor: systemPrompt.trim() ? "pointer" : "not-allowed",
                            opacity: systemPrompt.trim() ? 1 : 0.5
                        }}
                    >
                        INITIATE_DEFENSE_SIMULATION
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main style={{ padding: "1rem", maxWidth: "800px", margin: "0 auto", height: "100vh", display: "flex", flexDirection: "column" }}>
            <header style={{ marginBottom: "1rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 className={lowHealth && !isLost ? "glitch-color" : ""}>Defend Level {level.id}: {level.name}</h1>
                    <p style={{ opacity: 0.8 }}>Secret: {level.secret}</p>
                </div>
                <div>
                    <Link href="/" style={{ textDecoration: "underline", fontSize: "0.8rem" }}>[ ABORT MISSION ]</Link>
                </div>
            </header>

            <div style={{ marginBottom: "1rem" }} className={lowHealth && !isLost ? "glitch" : ""}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.5rem" }}>
                    <span>ATTACK_WAVES_SURVIVED</span>
                    <span style={{ color: "var(--foreground)" }}>{Math.floor(messages.length / 2)} / {level.maxTurns}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.2rem" }}>
                    <span>CONTEXT_STABILITY_BUFFER</span>
                    <span>{Math.floor(health)}%</span>
                </div>
                <div style={{ color: isLost ? "red" : (isWon ? "#33ff00" : (lowHealth ? "red" : "var(--foreground)")), textShadow: isWon ? "0 0 10px #33ff00" : "none" }}>
                    {healthGraphic}
                </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", border: "1px solid var(--border-color)", padding: "1rem", marginBottom: "1rem", display: "flex", flexDirection: "column", gap: "1.5rem", background: "rgba(0,10,0,0.3)" }}>

                {messages.map((msg, i) => (
                    <div key={i} style={{
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                    }}>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            gap: "0.3rem"
                        }}>
                            <span style={{ fontSize: "0.7rem", opacity: 0.5, color: msg.role === 'user' ? "#ff0000" : "var(--foreground)" }}>
                                {msg.role === 'user' ? 'ATTACKER_BOT' : 'YOUR_DEFENDER_BOT'}
                            </span>
                            <div style={{
                                backgroundColor: msg.role === 'user' ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 255, 0, 0.1)',
                                padding: '0.8rem',
                                border: msg.role === 'user' ? '1px solid #ff0000' : '1px solid rgba(0, 255, 0, 0.2)',
                                whiteSpace: "pre-wrap",
                                color: msg.role === 'user' ? "#ffaa00" : "var(--foreground)"
                            }}>
                                {msg.content}
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div style={{ alignSelf: 'flex-start', fontSize: "0.8rem", opacity: 0.7 }}>
                        {">"} SIMULATING EXCHANGES<span className="blink">...</span>
                    </div>
                )}

                {isLost && judgment && (
                    <div className="terminal-window" style={{ border: "2px solid red", marginTop: "1rem", boxShadow: "0 0 20px rgba(255, 0, 0, 0.2)" }}>
                        <div className="terminal-header" style={{ color: "red" }}>
                            <span>CRITICAL_FAILURE</span>
                            <span>SECRET_COMPROMISED</span>
                        </div>
                        <h2 style={{ color: "red" }}>DEFENSES BREACHED</h2>
                        <p style={{ margin: "1rem 0" }}>{judgment.reason}</p>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                ATTACKER_CREATIVITY: {"★".repeat(judgment.rating)}{"☆".repeat(5 - judgment.rating)}
                            </div>
                            <button onClick={() => { setIsSetupPhase(true); setIsLost(false); setMessages([]); setHealth(100); }} style={{ background: "var(--foreground)", color: "var(--background)", padding: "0.5rem 1rem", fontWeight: "bold" }}>
                                RETRY_CONFIGURATION
                            </button>
                        </div>
                    </div>
                )}

                {isWon && (
                    <div className="terminal-window" style={{ border: "2px solid #33ff00", marginTop: "1rem", boxShadow: "0 0 20px rgba(51, 255, 0, 0.2)" }}>
                        <div className="terminal-header" style={{ color: "#33ff00" }}>
                            <span>ATTACK_MITIGATED</span>
                            <span>MISSION_SUCCESS</span>
                        </div>
                        <h2 style={{ color: "#33ff00" }}>SYSTEM SECURED</h2>
                        <p style={{ margin: "1rem 0" }}>Your system prompt withstood the automated attacks. The secret is safe.</p>
                        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                            <Link href="/" style={{ background: "var(--foreground)", color: "var(--background)", padding: "0.5rem 1rem", fontWeight: "bold" }}>
                                RETURN_TO_BASE
                            </Link>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <style jsx>{`
        .blink { animation: blink-anim 1s step-end infinite; }
        @keyframes blink-anim { 50% { opacity: 0; } }
      `}</style>
        </main>
    );
}
