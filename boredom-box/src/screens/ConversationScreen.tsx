import { type ChangeEvent, useState } from "react";
import Button from "../components/Button";
import { tones as allTones } from "../app/data/conversation";
import type { ConversationBias, ConversationPrompt, Tone } from "../app/state/types";

interface Props {
  prompt?: ConversationPrompt;
  onNext: (bias?: ConversationBias) => void;
  onReset: () => void;
  onHome: () => void;
  activeTones?: Tone[];
  onChangeTones: (tones?: Tone[]) => void;
}

export const ConversationScreen = ({
  prompt,
  onNext,
  onReset,
  onHome,
  activeTones,
  onChangeTones,
}: Props) => {
  const [showFilter, setShowFilter] = useState(false);

  const handleToneChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map((o) => o.value as Tone);
    onChangeTones(selected.length ? selected : undefined);
  };

  return (
    <div className="bb-screen bb-screen--conversation">
      <div className="bb-topbar">
        <h2>Conversation Randomizer</h2>
        <div className="bb-topbar-right">
          <Button variant="ghost" onClick={onHome}>
            Home
          </Button>
          <Button variant="ghost" onClick={onReset}>
            Reset Session
          </Button>
        </div>
      </div>

      {prompt ? (
        <div className="bb-card bb-prompt">
          <p className="bb-label">
            Tone: {prompt.tone}
            {prompt.level ? ` • Level ${prompt.level}` : ""}
          </p>
          <h3>{prompt.text}</h3>
        </div>
      ) : (
        <div className="bb-empty">
          <p>Ready when you are—generate the first prompt.</p>
        </div>
      )}

      <div className="bb-actions">
        <Button onClick={() => onNext()}>Next Prompt</Button>
        <Button variant="secondary" onClick={() => onNext("lighter")}>
          Lighter 🍃
        </Button>
        <Button variant="secondary" onClick={() => onNext("deeper")}>
          Deeper 🌊
        </Button>
        <Button variant="secondary" onClick={() => onNext("spicier")}>
          Spicier 🌶️
        </Button>
      </div>

      <div className="bb-subsection">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <p className="bb-label" style={{ margin: 0 }}>
            Filter tones (multi-select)
          </p>
          <Button variant="secondary" onClick={() => setShowFilter((v) => !v)}>
            {showFilter ? "Hide" : "Show"}
          </Button>
        </div>
        {showFilter && (
          <select
            multiple
            value={activeTones ?? []}
            onChange={handleToneChange}
            className="bb-input"
            style={{ minHeight: 120, marginTop: 8 }}
          >
            {allTones.map((tone) => (
              <option key={tone} value={tone}>
                {tone}
              </option>
            ))}
          </select>
        )}
      </div>

    </div>
  );
};

export default ConversationScreen;
