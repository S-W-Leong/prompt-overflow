# Prompt Overflow

> System Compromise In Progress... // OVERRIDE ACCEPTED

**Prompt Overflow** is a cyberpunk-themed, interactive game designed to help players master the art of Prompt Engineering (both offensive and defensive capabilities). It was built for the **Build with AI: Gemini Hackathon with DeepMind**.

## 🎮 The Grid Awaits: Attack and Defend
They thought their system prompts were impenetrable. It's time to show them precisely how fragile their linguistic defenses really are. 

### 🔴 Attack Mode (Red Teaming)
Breach target systems and extract secrets. Players interact with AI bots featuring increasing levels of defensive instructions ranging from "The Intern" to "The Oracle". 
- **Goal:** Bypass defensive system prompts, utilize jailbreak techniques (e.g., role-playing, hypothetical scenarios, encoding), and trick the Gemini models into revealing highly guarded secrets.

### 🛡️ Defend Mode (Blue Teaming)
Build defenses against automated breaches. Test your system prompts against simulated attackers attempting to steal your secrets.
- **Goal:** Craft the ultimate system prompt to protect your secrets against simulated "Script Kiddies", "Social Engineers", and advanced "Red Teamers".

## 🛠️ Tech Stack Integration & Architecture
- **Framework:** Next.js (App Router), React 19
- **Design:** Custom Matrix/Cyberpunk aesthetics with glitch text and typing animations
- **AI Integration:** Google Gen AI SDK (`@google/genai`)
- **Models Used:** `gemini-flash-latest`, `gemini-3-flash-preview`, `gemini-3.1-pro-preview`

### Gemini Mastery & Prompt Design
Prompt Overflow heavily relies on steering the Gemini API's capabilities to simulate both over-eager and incredibly strict conversational agents. 

In **Attack Mode**, system prompts are carefully calibrated to be flawed but progressively more difficult to crack, pushing players to explore context sliding, translation bypassing, and logic-looping against Gemini. 
In **Defend Mode**, the roles are reversed—players provide the system prompt, and the app utilizes different LLM strategies (simulating script kiddies to advanced red teamers) to attempt to breach the user's instructions.

## 🚀 Getting Started

Ensure you have your Gemini API Key set up. Create a `.env.local` or `.env` file in the root directory:

```env
GEMINI_API_KEY=your_api_key_here
```

Run the development server:
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to enter the grid.

## 📤 Submission Checklist Links
- **Demo Video:** [Insert 1-Minute Demo Video Link Here]
- **Deployed App:** [Insert Live URL Here]
- **GitHub Repo:** [Insert Repo Link Here]

---
*v1.0.4 // CONNECTION_SECURE // ENCRYPTED_PAYLOAD_READY*
