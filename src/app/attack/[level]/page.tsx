import { ATTACK_LEVELS } from "../../game/levels";
import AttackGame from "../AttackGame";
import { notFound } from "next/navigation";

export default async function AttackPage({ params }: { params: Promise<{ level: string }> }) {
    const resolvedParams = await params;
    const levelId = parseInt(resolvedParams.level, 10);

    if (isNaN(levelId)) return notFound();

    const levelConfig = ATTACK_LEVELS.find(l => l.id === levelId);

    if (!levelConfig) return notFound();

    return <AttackGame level={levelConfig} />;
}
