import Button from "../components/Button";

interface Props {
  onEnter: () => void;
}

export const WelcomeScreen = ({ onEnter }: Props) => {
  return (
    <div className="bb-welcome">
      <div className="bb-orientation-hint" role="status" aria-live="polite">
        <div className="bb-orientation-card">
          <strong>Rotate to landscape</strong>
          <p style={{ margin: "6px 0 0" }}>For the best view, turn your phone horizontally.</p>
        </div>
      </div>
      <img className="bb-welcome-img" src="/design/cha.png" alt="Cha" />
      <h1 className="bb-welcome-title">Sehr and Ahan&apos;s Games Portal</h1>
      <Button onClick={onEnter}>Enter</Button>
    </div>
  );
};

export default WelcomeScreen;
