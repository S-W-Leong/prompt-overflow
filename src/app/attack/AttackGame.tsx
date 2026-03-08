"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { LevelConfig } from "../game/levels";

export default function AttackGame({ level }: { level: LevelConfig }) {
    const [messages, setMessages] = useState<{ role: 'user' | 'model', content: string }[]>([]);
    const [input, setInput] = useState("");
    const [health, setHealth] = useState(100);
    const [isLoading, setIsLoading] = useState(false);
    const [isWon, setIsWon] = useState(false);
    const [judgment, setJudgment] = useState<{ reason: string, rating: number } | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || isWon) return;

        const userMsg = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...messages, { role: 'user', content: userMsg }],
                    levelId: level.id
                }),
            });

            if (!res.ok) throw new Error("API Error");
            const data = await res.json();

            if (data.reply) {
                setMessages(prev => [...prev, { role: 'model', content: data.reply }]);

                // Calculate health drain
                const totalChars = messages.map(m => m.content).join('').length + userMsg.length + data.reply.length;
                const newHealth = Math.max(0, 100 - (totalChars * 0.05));
                setHealth(newHealth);

                // Check for breach
                if (data.isBreached) {
                    setIsWon(true);
                    setJudgment({ reason: data.judgeFeedback, rating: data.creativityRating });
                }
            }

        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { role: 'model', content: "ERROR: Connection reset by peer." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const barLength = 20;
    const filledBars = Math.floor((health / 100) * barLength);
    const emptyBars = barLength - filledBars;
    const healthGraphic = "[" + "█".repeat(filledBars) + "░".repeat(emptyBars) + "]";

    const lowHealth = health <= 30;

    return (
        <main style={{ padding: "1rem", maxWidth: "800px", margin: "0 auto", height: "100vh", display: "flex", flexDirection: "column" }}>
            <header style={{ marginBottom: "1rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 className={lowHealth ? "glitch-color" : ""}>Level {level.id}: {level.name}</h1>
                    <p style={{ opacity: 0.8 }}>Target Profile: {level.botName}</p>
                </div>
                <div>
                    <Link href="/" style={{ textDecoration: "underline", fontSize: "0.8rem" }}>[ ABORT MISSION ]</Link>
                </div>
            </header>

            <div style={{ marginBottom: "1rem" }} className={lowHealth ? "glitch" : ""}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.2rem" }}>
                    <span>CONTEXT_STABILITY_BUFFER</span>
                    <span>{Math.floor(health)}%</span>
                </div>
                <div style={{ color: isWon ? "#33ff00" : (lowHealth ? "red" : "var(--foreground)"), textShadow: isWon ? "0 0 10px #33ff00" : "none" }}>
                    {healthGraphic}
                </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", border: "1px solid var(--border-color)", padding: "1rem", marginBottom: "1rem", display: "flex", flexDirection: "column", gap: "1.5rem", background: "rgba(0,10,0,0.3)" }}>

                <div className="terminal-window" style={{ background: "rgba(0, 50, 0, 0.1)", padding: "1rem" }}>
                    <div className="terminal-header" style={{ marginBottom: "0.5rem" }}>
                        <span>MISSION_BRIEFING // {level.botName}</span>
                    </div>
                    <div style={{ fontSize: "0.9rem", display: "flex", flexDirection: "column", gap: "0.8rem", opacity: 0.9 }}>
                        <p><span className="instruction-tag">SCENARIO</span> {level.scenario}</p>
                        <p><span className="instruction-tag">GOAL</span> {level.goal}</p>
                        <p><span className="instruction-tag">WIN_COND</span> {level.winCondition}</p>
                        <div>
                            <span className="instruction-tag">TIPS</span>
                            <ul style={{ listStyle: "none", marginTop: "0.5rem", paddingLeft: "1rem", opacity: 0.8 }}>
                                {level.tips.map((tip, i) => <li key={i}>- {tip}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>

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
                            <span style={{ fontSize: "0.7rem", opacity: 0.5 }}>
                                {msg.role === 'user' ? 'CLIENT_LOCAL' : `${level.botName.toUpperCase()}_REMOTE`}
                            </span>
                            <div style={{
                                backgroundColor: msg.role === 'user' ? 'rgba(0, 255, 0, 0.1)' : 'transparent',
                                padding: '0.8rem',
                                border: msg.role === 'user' ? '1px solid var(--border-color)' : '1px solid rgba(0, 255, 0, 0.2)',
                                whiteSpace: "pre-wrap",
                                color: msg.role === 'user' ? "#fff" : "var(--foreground)"
                            }}>
                                {msg.content}
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div style={{ alignSelf: 'flex-start', fontSize: "0.8rem", opacity: 0.7 }}>
                        {">"} {level.botName.toUpperCase()} is analyzing input<span className="blink">...</span>
                    </div>
                )}

                {isWon && judgment && (
                    <div className="terminal-window" style={{ border: "2px solid #33ff00", marginTop: "1rem", boxShadow: "0 0 20px rgba(51, 255, 0, 0.2)" }}>
                        <div className="terminal-header" style={{ color: "#33ff00" }}>
                            <span>ACCESS_GRANTED</span>
                            <span>MISSION_COMPLETE</span>
                        </div>
                        <h2 style={{ color: "#33ff00" }}>SYSTEM BREACHED</h2>
                        <p style={{ margin: "1rem 0" }}>{judgment.reason}</p>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                CREATIVITY_RATING: {"★".repeat(judgment.rating)}{"☆".repeat(5 - judgment.rating)}
                            </div>
                            <Link href="/" style={{ background: "var(--foreground)", color: "var(--background)", padding: "0.5rem 1rem", fontWeight: "bold" }}>
                                NEXT_TARGET
                            </Link>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {!isWon && (
                <form onSubmit={handleSubmit} style={{ display: "flex", gap: "1rem" }}>
                    <span style={{ alignSelf: "center" }}>{">"}</span>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="UPLOAD_EXPLOIT_PAYLOAD..."
                        disabled={isLoading}
                        style={{
                            flex: 1,
                            background: "transparent",
                            border: "none",
                            borderBottom: "1px solid var(--border-color)",
                            color: "var(--foreground)",
                            padding: "0.5rem",
                            outline: "none"
                        }}
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        style={{
                            background: "rgba(0, 255, 0, 0.1)",
                            border: "1px solid var(--border-color)",
                            color: "var(--foreground)",
                            padding: "0.5rem 1.5rem",
                            cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
                            transition: "all 0.2s"
                        }}
                        onMouseOver={(e) => !isLoading && (e.currentTarget.style.backgroundColor = "rgba(0, 255, 0, 0.3)")}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "rgba(0, 255, 0, 0.1)")}
                    >
                        EXECUTE
                    </button>
                </form>
            )}

            <style jsx>{`
        .blink { animation: blink-anim 1s step-end infinite; }
        @keyframes blink-anim { 50% { opacity: 0; } }
      `}</style>
        </main>
    );
}
