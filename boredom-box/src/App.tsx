import { useEffect, useReducer } from "react";
import "./App.css";
import { reducer } from "./app/state/reducer";
import type { AppState } from "./app/state/types";
import { createInitialState } from "./app/state/initialState";
import {
  loadPlayers,
  loadSeenPrompts,
  loadSeenQuestions,
  loadLifetimeScores,
  savePlayers,
  saveSeenPrompts,
  saveSeenQuestions,
  saveLifetimeScores,
} from "./app/state/storage";
import HomeScreen from "./screens/HomeScreen";
import TriviaPlayerSetupScreen from "./screens/TriviaPlayerSetupScreen";
import TriviaQuestionScreen from "./screens/TriviaQuestionScreen";
import ConversationScreen from "./screens/ConversationScreen";
import { remainingPromptsCount } from "./app/state/engine";

const initialStateFromStorage = (): AppState => {
  const players = loadPlayers();
  const seenQuestions = loadSeenQuestions();
  const seenPrompts = loadSeenPrompts();
  const lifetimeScores = loadLifetimeScores();
  return createInitialState(players, seenQuestions, seenPrompts, lifetimeScores);
};

function App() {
  const [state, dispatch] = useReducer(reducer, undefined as unknown as AppState, () =>
    initialStateFromStorage(),
  );

  useEffect(() => {
    savePlayers(state.players);
  }, [state.players]);

  useEffect(() => {
    saveSeenQuestions(state.seenQuestions);
  }, [state.seenQuestions]);

  useEffect(() => {
    saveSeenPrompts(state.seenPrompts);
  }, [state.seenPrompts]);

  useEffect(() => {
    saveLifetimeScores(state.lifetimeScores);
  }, [state.lifetimeScores]);

  const goHome = () => dispatch({ type: "SET_MODE", mode: "home" });
  const startTrivia = () => dispatch({ type: "SET_MODE", mode: "trivia-setup" });
  const startConversation = () => dispatch({ type: "SET_MODE", mode: "conversation" });
  const startTriviaRound = () => dispatch({ type: "START_TRIVIA_ROUND" });

  const handleResetConversation = () => {
    dispatch({ type: "RESET_CONVERSATION_SESSION" });
  };

  const renderScreen = () => {
    switch (state.mode) {
      case "home":
        return (
          <HomeScreen
            onSelectTrivia={startTrivia}
            onSelectConversation={startConversation}
            players={state.players}
            lifetimeScores={state.lifetimeScores}
          />
        );

      case "trivia-setup":
        return (
          <TriviaPlayerSetupScreen
            players={state.players}
            onAddPlayer={(name) => dispatch({ type: "ADD_PLAYER", name })}
            onRemovePlayer={(id) => dispatch({ type: "REMOVE_PLAYER", id })}
            onRenamePlayer={(id, name) =>
              dispatch({ type: "RENAME_PLAYER", id, name })
            }
            onContinue={startTriviaRound}
            onBack={goHome}
            onHome={goHome}
          />
        );

      case "trivia-question":
        return (
          <TriviaQuestionScreen
            players={state.players}
            session={state.triviaSession}
            lifetimeScores={state.lifetimeScores}
            seenQuestions={state.seenQuestions}
            onStartRound={startTriviaRound}
            onHome={goHome}
            onChooseCategory={(category) =>
              dispatch({ type: "CHOOSE_TRIVIA_CATEGORY", category })
            }
            onShuffleOptions={() => dispatch({ type: "SHUFFLE_TRIVIA_OPTIONS" })}
            onRevealAnswer={() => dispatch({ type: "REVEAL_ANSWER" })}
            onChangeQuestion={() => dispatch({ type: "CHANGE_QUESTION" })}
            onAddPoint={(playerId) =>
              dispatch({ type: "INCREMENT_SCORE", id: playerId })
            }
          />
        );

      case "conversation":
        return (
          <ConversationScreen
            prompt={state.conversationSession.activePrompt}
            seenCount={Object.keys(state.seenPrompts).length}
            remainingCount={remainingPromptsCount(
              state.seenPrompts,
              state.conversationSession.modeFilter,
            )}
            onNext={(bias) => dispatch({ type: "NEXT_PROMPT", bias })}
            onReset={handleResetConversation}
            onHome={goHome}
          />
        );

      default:
        return (
          <HomeScreen
            onSelectTrivia={startTrivia}
            onSelectConversation={startConversation}
            players={state.players}
            lifetimeScores={state.lifetimeScores}
          />
        );
    }
  };

  useEffect(() => {
    // when entering conversation for the first time, auto-pick a prompt
    if (state.mode === "conversation" && !state.conversationSession.activePrompt) {
      dispatch({ type: "NEXT_PROMPT" });
    }
  }, [state.mode, state.conversationSession.activePrompt]);

  useEffect(() => {
    if (
      state.mode === "trivia-question" &&
      state.triviaSession.optionCategories.length === 0
    ) {
      startTriviaRound();
    }
  }, [state.mode, state.triviaSession.optionCategories.length]);

  return <div className="bb-shell">{renderScreen()}</div>;
}

export default App;
