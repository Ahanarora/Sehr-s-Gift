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
}

export const TriviaPlayerSetupScreen = ({
  players,
  onAddPlayer,
  onRemovePlayer,
  onRenamePlayer,
  onContinue,
  onBack,
  onHome,
}: Props) => {
  return (
    <div className="bb-screen">
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
      <div className="bb-actions">
        <Button onClick={onContinue}>Continue →</Button>
      </div>
    </div>
  );
};

export default TriviaPlayerSetupScreen;
