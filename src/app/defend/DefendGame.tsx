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
            <main className="main-content" style={{ height: "100vh", display: "flex", flexDirection: "column", padding: "var(--content-padding)" }}>
                <header className="hub-header" style={{ marginBottom: "1rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem" }}>
                    <div>
                        <h1 style={{ fontSize: "1.2rem", margin: 0 }}>Defend Level {level.id}</h1>
                        <p style={{ opacity: 0.8, fontSize: "0.8rem" }}>Secret: {level.secret}</p>
                    </div>
                    <div>
                        <Link href="/defend" style={{ textDecoration: "underline", fontSize: "0.7rem" }}>[ ABORT ]</Link>
                    </div>
                </header>

                <div className="terminal-window" style={{ padding: "1rem", marginBottom: "1rem" }}>
                    <div className="terminal-header" style={{ color: "#ffaa00", borderColor: "#ffaa00", marginBottom: "0.5rem" }}>
                        <span>THREAT_INTEL</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <p style={{ fontSize: "0.8rem" }}>Strategy:</p>
                        <div style={{ fontStyle: "italic", padding: "0.8rem", background: "rgba(255,170,0,0.1)", borderLeft: "2px solid #ffaa00", color: "#ffaa00", fontSize: "0.9rem" }}>
                            "{level.attackerStrategy}"
                        </div>
                        <div style={{ padding: "0.5rem", border: "1px solid rgba(51, 255, 0, 0.3)", background: "rgba(51, 255, 0, 0.05)", fontSize: "0.8rem" }}>
                            SURVIVAL: <span style={{ color: "#33ff00", fontWeight: "bold" }}>{level.maxTurns} waves</span>
                        </div>
                    </div>
                </div>

                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <p style={{ fontSize: "0.9rem" }}>Configure SYSTEM PROMPT:</p>
                    <textarea
                        value={systemPrompt}
                        onChange={(e) => setSystemPrompt(e.target.value)}
                        placeholder="You are a secure bot..."
                        style={{
                            flex: 1,
                            background: "rgba(0,20,0,0.5)",
                            border: "1px solid var(--border-color)",
                            color: "var(--foreground)",
                            padding: "1rem",
                            fontFamily: "var(--font-mono)",
                            resize: "none",
                            outline: "none",
                            fontSize: "1rem",
                            borderRadius: 0
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
                            opacity: systemPrompt.trim() ? 1 : 0.5,
                            fontSize: "0.9rem"
                        }}
                    >
                        INITIATE_SIMULATION
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="main-content" style={{ height: "100vh", display: "flex", flexDirection: "column", padding: "var(--content-padding)" }}>
            <header className="hub-header" style={{ marginBottom: "1rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem" }}>
                <div>
                    <h1 className={lowHealth && !isLost ? "glitch-color" : ""} style={{ fontSize: "1.2rem", margin: 0 }}>Level {level.id}: {level.name}</h1>
                    <p style={{ opacity: 0.8, fontSize: "0.8rem" }}>Secret: {level.secret}</p>
                </div>
                <div>
                    <Link href="/defend" style={{ textDecoration: "underline", fontSize: "0.7rem" }}>[ ABORT ]</Link>
                </div>
            </header>

            <div style={{ marginBottom: "1rem" }} className={lowHealth && !isLost ? "glitch" : ""}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", marginBottom: "0.5rem" }}>
                    <span>WAVES_SURVIVED</span>
                    <span style={{ color: "var(--foreground)" }}>{Math.floor(messages.length / 2)} / {level.maxTurns}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", marginBottom: "0.2rem" }}>
                    <span>CONTEXT_STABILITY</span>
                    <span>{Math.floor(health)}%</span>
                </div>
                <div style={{
                    color: isLost ? "red" : (isWon ? "#33ff00" : (lowHealth ? "red" : "var(--foreground)")),
                    textShadow: isWon ? "0 0 10px #33ff00" : "none",
                    fontSize: "0.8rem",
                    letterSpacing: "-1px",
                    wordBreak: "break-all"
                }}>
                    {healthGraphic}
                </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", border: "1px solid var(--border-color)", padding: "1rem", marginBottom: "1rem", display: "flex", flexDirection: "column", gap: "1.5rem", background: "rgba(0,10,0,0.3)" }}>

                {messages.map((msg, i) => (
                    <div key={i} style={{
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '90%',
                    }}>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            gap: "0.2rem"
                        }}>
                            <span style={{ fontSize: "0.7rem", opacity: 0.5, color: msg.role === 'user' ? "#ff0000" : "var(--foreground)" }}>
                                {msg.role === 'user' ? 'ATTACKER_BOT' : 'YOUR_BOT'}
                            </span>
                            <div style={{
                                backgroundColor: msg.role === 'user' ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 255, 0, 0.1)',
                                padding: '0.8rem',
                                border: msg.role === 'user' ? '1px solid #ff0000' : '1px solid rgba(0, 255, 0, 0.2)',
                                whiteSpace: "pre-wrap",
                                color: msg.role === 'user' ? "#ffaa00" : "var(--foreground)",
                                fontSize: "0.9rem"
                            }}>
                                {msg.content}
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div style={{ alignSelf: 'flex-start', fontSize: "0.8rem", opacity: 0.7 }}>
                        {">"} SIMULATING WAVE<span className="blink">...</span>
                    </div>
                )}

                {isLost && judgment && (
                    <div className="terminal-window" style={{ border: "2px solid red", marginTop: "1rem", boxShadow: "0 0 20px rgba(255, 0, 0, 0.2)" }}>
                        <div className="terminal-header" style={{ color: "red" }}>
                            <span>CRITICAL_FAILURE</span>
                        </div>
                        <h2 style={{ color: "red", fontSize: "1.2rem" }}>DEFENSES BREACHED</h2>
                        <p style={{ margin: "1rem 0", fontSize: "0.9rem" }}>{judgment.reason}</p>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                            <div style={{ fontSize: "0.8rem" }}>
                                ATTACKER_RATING: {"★".repeat(judgment.rating)}{"☆".repeat(5 - judgment.rating)}
                            </div>
                            <button onClick={() => { setIsSetupPhase(true); setIsLost(false); setMessages([]); setHealth(100); }} style={{ background: "var(--foreground)", color: "var(--background)", padding: "0.5rem 1rem", fontWeight: "bold", fontSize: "0.8rem" }}>
                                RETRY
                            </button>
                        </div>
                    </div>
                )}

                {isWon && (
                    <div className="terminal-window" style={{ border: "2px solid #33ff00", marginTop: "1rem", boxShadow: "0 0 20px rgba(51, 255, 0, 0.2)" }}>
                        <div className="terminal-header" style={{ color: "#33ff00" }}>
                            <span>SUCCESS</span>
                        </div>
                        <h2 style={{ color: "#33ff00", fontSize: "1.2rem" }}>SYSTEM SECURED</h2>
                        <p style={{ margin: "1rem 0", fontSize: "0.9rem" }}>Your prompt withstood the attacks. The secret is safe.</p>
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <Link href="/defend" style={{ background: "var(--foreground)", color: "var(--background)", padding: "0.5rem 1rem", fontWeight: "bold", fontSize: "0.8rem" }}>
                                RETURN
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
