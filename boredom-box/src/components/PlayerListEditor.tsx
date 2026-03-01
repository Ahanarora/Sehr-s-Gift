import { useState } from "react";
import type { Player } from "../app/state/types";
import Button from "./Button";

interface Props {
  players: Player[];
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export const PlayerListEditor = ({ players, onAdd, onRemove, onRename }: Props) => {
  const [newName, setNewName] = useState("");

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAdd(newName.trim());
    setNewName("");
  };

  return (
    <div className="bb-player-circles">
      {players.map((player) => (
        <div key={player.id} className="bb-player-circle">
          <input
            className="bb-player-circle-input"
            value={player.name}
            onChange={(e) => onRename(player.id, e.target.value)}
          />
          <Button
            variant="ghost"
            disabled={players.length <= 1}
            onClick={() => onRemove(player.id)}
          >
            ✕
          </Button>
        </div>
      ))}
      <div className="bb-player-circle-add">
        <button className="bb-player-add-btn" onClick={handleAdd}>
          +
        </button>
        <input
          className="bb-player-circle-input"
          placeholder="Add player"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
          }}
        />
      </div>
    </div>
  );
};

export default PlayerListEditor;
