import Button from "../components/Button";
import type { ConversationBias, ConversationPrompt } from "../app/state/types";

interface Props {
  prompt?: ConversationPrompt;
  onNext: (bias?: ConversationBias) => void;
  onReset: () => void;
  onHome: () => void;
}

export const ConversationScreen = ({
  prompt,
  onNext,
  onReset,
  onHome,
}: Props) => {
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
          <p className="bb-label">{prompt.level ? `Level ${prompt.level}` : "Conversation Prompt"}</p>
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
    </div>
  );
};

export default ConversationScreen;
