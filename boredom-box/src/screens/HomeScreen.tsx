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
  return (
    <div className="bb-home">
      <img
        className="bb-home-hero-img"
        src="/design/shot2.png"
        alt="Sehr and Ahan's Underground Games Portal collage"
      />
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
      <div className="bb-home-gallery">
        <img src="/design/shot1.png" alt="Gallery 1" />
        <img src="/design/shot2.png" alt="Gallery 2" />
        <img src="/design/shot3.png" alt="Gallery 3" />
        <img src="/design/shot4.png" alt="Gallery 4" />
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
