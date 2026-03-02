import { useMemo, useState } from "react";
import { thoughtsOfDay } from "../app/data/thoughts";
interface Props {
  onSelectTrivia: () => void;
  onSelectConversation: () => void;
  players: { id: string; name: string; score: number }[];
  lifetimeScores: Record<string, number>;
}

export const HomeScreen = ({
  onSelectTrivia,
  onSelectConversation,
  players,
  lifetimeScores,
}: Props) => {
  const lifetimeSorted = [...players].sort(
    (a, b) => (lifetimeScores[b.id] ?? 0) - (lifetimeScores[a.id] ?? 0),
  );
  const [flipped, setFlipped] = useState(false);

  const spotlightImages = useMemo(
    () => ["/design/shot1.png", "/design/shot2.png", "/design/shot3.png", "/design/shot4.png"],
    [],
  );
  const spotlightSrc = useMemo(() => {
    const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    const idx = dayIndex % spotlightImages.length;
    return spotlightImages[idx];
  }, [spotlightImages]);

  const thoughtOfDay = useMemo(() => {
    const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    const list = thoughtsOfDay as string[];
    const raw = list[dayIndex % list.length] ?? "";
    return raw.replace(/^Thought\\s*\\d+:\\s*/i, "");
  }, []);

  return (
    <div className="bb-home">
      <div className="bb-orientation-hint" role="status" aria-live="polite">
        <div className="bb-orientation-card">
          <strong>Rotate to landscape</strong>
          <p style={{ margin: "6px 0 0" }}>For the best view, turn your phone horizontally.</p>
        </div>
      </div>
      <h1 className="bb-home-title">Sehr and Ahan&apos;s Underground Games Portal</h1>
      <div className="bb-home-hero">
        <div className="bb-home-circles">
          <button className="bb-home-circle" onClick={onSelectTrivia}>
            Trivia Arena
          </button>
          <button className="bb-home-circle" onClick={onSelectConversation}>
            Conversation Randomizer
          </button>
        </div>
      </div>
      <div className="bb-home-spotlight">
        <p className="bb-note">Your flowers for today</p>
        <div
          className={`bb-spotlight-card ${flipped ? "flipped" : ""}`}
          onClick={() => setFlipped((v) => !v)}
        >
          <div className="bb-spotlight-face front">
            <img src={spotlightSrc} alt="Daily spotlight" className="bb-spotlight-img" />
          </div>
          <div className="bb-spotlight-face back">
            <p className="bb-spotlight-text">{thoughtOfDay}</p>
          </div>
        </div>
      </div>
      <div className="bb-scoreboard bb-home-scoreboard">
        <p className="bb-label">All-time Scoreboard</p>
        {lifetimeSorted.map((p) => (
          <div key={p.id} className="bb-score-row">
            <span>{p.name}</span>
            <span className="bb-score">{lifetimeScores[p.id] ?? 0}</span>
          </div>
        ))}
        {lifetimeSorted.length === 0 && <p>No players yet.</p>}
      </div>
    </div>
  );
};

export default HomeScreen;
