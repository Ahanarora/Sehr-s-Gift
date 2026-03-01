import { useEffect, useMemo, useState } from "react";
import { triviaQuestions } from "../app/data/trivia";
import Button from "../components/Button";
import ScoreboardModal from "../components/ScoreboardModal";
import Modal from "../components/Modal";
import type { Category, Player, Question, TriviaSession } from "../app/state/types";

interface Props {
  players: Player[];
  session: TriviaSession;
  lifetimeScores: Record<string, number>;
  seenQuestions: Record<string, boolean>;
  onStartRound: () => void;
  onHome: () => void;
  onChooseCategory: (category: Category) => void;
  onShuffleOptions: () => void;
  onRevealAnswer: () => void;
  onChangeQuestion: () => void;
  onAddPoint: (playerId: string) => void;
}

export const TriviaQuestionScreen = ({
  players,
  session,
  lifetimeScores,
  seenQuestions,
  onStartRound,
  onHome,
  onChooseCategory,
  onShuffleOptions,
  onRevealAnswer,
  onChangeQuestion,
  onAddPoint,
}: Props) => {
  const [scoreboardOpen, setScoreboardOpen] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [spinKey, setSpinKey] = useState(0);
  const [answerOpen, setAnswerOpen] = useState(false);

  const chooser = players[session.chooserIndex];

  useMemo(() => {
    // kept for potential future stats; currently unused after UI removal
    if (!session.category) return;
    void triviaQuestions.filter((q) => q.category === session.category);
  }, [session.category, seenQuestions]);

  useEffect(() => {
    if (session.activeQuestion) {
      setSpinKey((k) => k + 1);
      setSpinning(true);
      const timer = setTimeout(() => setSpinning(false), 900);
      return () => clearTimeout(timer);
    }
  }, [session.activeQuestion?.id]);

  useEffect(() => {
    setAnswerOpen(session.questionState === "revealed");
  }, [session.questionState]);

  useEffect(() => {
    if (session.questionState === "revealed") {
      setAnswerOpen(true);
    } else {
      setAnswerOpen(false);
    }
  }, [session.questionState]);

  const renderQuestion = (question: Question) => {
    return (
      <div className="bb-machine bg-slot">
        <div className={`bb-card-flip ${spinning ? "flipping" : "settled"}`}>
          <div className="bb-card-face bb-card-front">
            <span>?</span>
          </div>
          <div className="bb-card-face bb-card-back">
            <div key={spinKey} className="bb-question-plain bb-question-animate">
              <p className="bb-label">{question.category}</p>
              <h3>{question.prompt}</h3>
            </div>
          </div>
        </div>
        <div className="bb-lever-wrap bb-lever-overlay">
          <button
            className={`bb-lever ${spinning ? "bb-lever-pulled" : ""}`}
            onClick={() => {
              setSpinning(true);
              onChangeQuestion();
            }}
            disabled={!session.category}
            aria-label="Pull lever to spin a new question"
          >
            <span className="bb-lever-handle" />
            <span className="bb-lever-stick" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bb-screen">
      <div className="bb-topbar">
        <div>
          <p className="bb-label">Chooser</p>
          <h2>{chooser?.name ?? "Player"}</h2>
          <p className="bb-label">Round {session.round || 1}</p>
        </div>
        <div className="bb-topbar-right">
          <Button variant="ghost" onClick={onHome}>
            Home
          </Button>
          <Button variant="ghost" onClick={() => setScoreboardOpen(true)}>
            Scoreboard
          </Button>
          <Button variant="ghost" onClick={onStartRound}>
            New Round
          </Button>
        </div>
      </div>

      {!session.category && (
        <div className="bb-topic-free">
          <p className="bb-label">Choose a topic (2 options)</p>
          {session.optionCategories.length === 0 ? (
            <Button onClick={onStartRound}>Draw options</Button>
          ) : (
            <div className="bb-topic-grid">
              {session.optionCategories.map((cat) => (
                <button
                  key={cat}
                  className="bb-topic-circle"
                  onClick={() => onChooseCategory(cat)}
                >
                  {cat.replace(/_/g, " ").replace(/\\b\\w/g, (s) => s.toUpperCase())}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {session.optionCategories.length > 0 && !session.category && (
        <div className="bb-actions">
          <Button variant="secondary" onClick={onShuffleOptions}>
            Shuffle categories
          </Button>
          <Button onClick={onStartRound}>New Round</Button>
        </div>
      )}

      {session.category && !session.activeQuestion && (
        <div className="bb-empty">
          <p>No unseen questions left for {session.category}. Start a new round.</p>
          <Button onClick={onStartRound}>New Round</Button>
        </div>
      )}

      {session.activeQuestion && (
        <div className="bb-question-area">{renderQuestion(session.activeQuestion)}</div>
      )}

      <div className="bb-actions">
        {session.activeQuestion && session.questionState === "idle" && (
          <Button
            onClick={() => {
              onRevealAnswer();
              setAnswerOpen(true);
            }}
          >
            Reveal Answer
          </Button>
        )}

        {session.activeQuestion && (
          <Button variant="secondary" onClick={onChangeQuestion}>
            Change Question
          </Button>
        )}
      </div>

      <ScoreboardModal
        open={scoreboardOpen}
        onClose={() => setScoreboardOpen(false)}
        players={players}
        lifetimeScores={lifetimeScores}
      />

      <Modal open={answerOpen} onClose={() => setAnswerOpen(false)} title="Answer">
        {session.activeQuestion && (
          <div className="bb-answer">
            <p className="bb-label">{session.activeQuestion.category}</p>
            <h3>{session.activeQuestion.prompt}</h3>
            {session.activeQuestion.format === "list" && session.activeQuestion.answers ? (
              <>
                <p className="bb-label">Accepted answers</p>
                <ul>
                  {session.activeQuestion.answers.map((ans) => (
                    <li key={ans}>{ans}</li>
                  ))}
                </ul>
                {session.activeQuestion.allRequired && (
                  <p className="bb-note">All required; order doesn’t matter.</p>
                )}
              </>
            ) : (
              <p>Answer: {session.activeQuestion.answer}</p>
            )}
            {session.activeQuestion.explanation && (
              <p className="bb-expl">{session.activeQuestion.explanation}</p>
            )}
            <div className="bb-actions" style={{ marginTop: 12 }}>
              {players.map((p) => (
                <Button key={p.id} onClick={() => onAddPoint(p.id)}>
                  +1 {p.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TriviaQuestionScreen;
