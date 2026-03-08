"use client";

import React, { useEffect, useRef } from "react";

const MatrixBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        // Character size and columns
        const fontSize = 16;
        const columns = Math.floor(width / fontSize);

        // An array of drops - one per column
        const drops: number[] = new Array(columns).fill(1).map(() => Math.random() * height / fontSize);

        const draw = () => {
            // Black background with 0.05 opacity for trail effect
            ctx.fillStyle = "rgba(5, 5, 5, 0.05)";
            ctx.fillRect(0, 0, width, height);

            // Green text
            ctx.fillStyle = "#33ff00"; // Matching --foreground
            ctx.font = `${fontSize}px monospace`;

            // Loop over drops
            for (let i = 0; i < drops.length; i++) {
                // Random 0 or 1
                const text = Math.random() > 0.5 ? "0" : "1";

                // x = column index * fontSize, y = value of drops[i] * fontSize
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                // Sending drop back to top randomly after it has crossed the screen
                if (drops[i] * fontSize > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                // Incrementing Y coordinate
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 33);

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;

            const newColumns = Math.floor(width / fontSize);
            if (newColumns > drops.length) {
                for (let i = drops.length; i < newColumns; i++) {
                    drops[i] = Math.random() * height / fontSize;
                }
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            clearInterval(interval);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            id="matrix-bg"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: -1,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                opacity: 0.15, // Keep it subtle
            }}
        />
    );
};

export default MatrixBackground;
