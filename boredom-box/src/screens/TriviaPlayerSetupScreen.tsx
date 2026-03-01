import PlayerListEditor from "../components/PlayerListEditor";
import Button from "../components/Button";
import type { Player } from "../app/state/types";

interface Props {
  players: Player[];
  onAddPlayer: (name: string) => void;
  onRemovePlayer: (id: string) => void;
  onRenamePlayer: (id: string, name: string) => void;
  onContinue: () => void;
  onBack: () => void;
  onHome: () => void;
  lifetimeScores: Record<string, number>;
}

export const TriviaPlayerSetupScreen = ({
  players,
  onAddPlayer,
  onRemovePlayer,
  onRenamePlayer,
  onContinue,
  onBack,
  onHome,
  lifetimeScores,
}: Props) => {
  return (
    <div className="bb-screen bb-screen--trivia">
      <div className="bb-topbar">
        <Button variant="ghost" onClick={onBack}>
          ← Back
        </Button>
        <Button variant="ghost" onClick={onHome}>
          Home
        </Button>
        <h2>Trivia setup</h2>
      </div>
      <PlayerListEditor
        players={players}
        onAdd={onAddPlayer}
        onRemove={onRemovePlayer}
        onRename={onRenamePlayer}
      />
      <div className="bb-scoreboard bb-home-scoreboard" style={{ marginTop: 16 }}>
        <p className="bb-label">All-time Scoreboard</p>
        {[...players]
          .sort((a, b) => (lifetimeScores[b.id] ?? 0) - (lifetimeScores[a.id] ?? 0))
          .map((p) => (
            <div key={p.id} className="bb-score-row">
              <span>{p.name}</span>
              <span className="bb-score">{lifetimeScores[p.id] ?? 0}</span>
            </div>
          ))}
      </div>
      <div className="bb-actions">
        <Button onClick={onContinue}>Continue →</Button>
      </div>
    </div>
  );
};

export default TriviaPlayerSetupScreen;
