import { DEFEND_LEVELS } from "../../game/levels";
import DefendGame from "../DefendGame";
import { notFound } from "next/navigation";

export default async function DefendPage({ params }: { params: Promise<{ level: string }> }) {
    const resolvedParams = await params;
    const levelId = parseInt(resolvedParams.level, 10);

    if (isNaN(levelId)) return notFound();

    const levelConfig = DEFEND_LEVELS.find(l => l.id === levelId);

    if (!levelConfig) return notFound();

    return <DefendGame level={levelConfig} />;
}
