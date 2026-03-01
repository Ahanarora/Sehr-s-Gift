import type { Player } from "../app/state/types";
import Modal from "./Modal";

interface Props {
  open: boolean;
  onClose: () => void;
  players: Player[];
  lifetimeScores: Record<string, number>;
}

export const ScoreboardModal = ({ open, onClose, players, lifetimeScores }: Props) => {
  const gameSorted = [...players].sort((a, b) => b.score - a.score);
  const lifetimeSorted = [...players].sort(
    (a, b) => (lifetimeScores[b.id] ?? 0) - (lifetimeScores[a.id] ?? 0),
  );

  return (
    <Modal open={open} onClose={onClose} title="Scoreboard">
      <div className="bb-scoreboard">
        <p className="bb-label">This game</p>
        {gameSorted.map((p) => (
          <div key={`game-${p.id}`} className="bb-score-row">
            <span>{p.name}</span>
            <span className="bb-score">{p.score}</span>
          </div>
        ))}
        {gameSorted.length === 0 && <p>No players yet.</p>}
      </div>

      <div className="bb-scoreboard" style={{ marginTop: 12 }}>
        <p className="bb-label">Lifetime</p>
        {lifetimeSorted.map((p) => (
          <div key={`life-${p.id}`} className="bb-score-row">
            <span>{p.name}</span>
            <span className="bb-score">{lifetimeScores[p.id] ?? 0}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default ScoreboardModal;
