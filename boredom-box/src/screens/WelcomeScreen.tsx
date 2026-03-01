import Button from "../components/Button";

interface Props {
  onEnter: () => void;
}

export const WelcomeScreen = ({ onEnter }: Props) => {
  return (
    <div className="bb-welcome">
      <img className="bb-welcome-img" src="/design/cha.png" alt="Cha" />
      <h1 className="bb-welcome-title">Sehr and Ahan&apos;s Games Portal</h1>
      <Button onClick={onEnter}>Enter</Button>
    </div>
  );
};

export default WelcomeScreen;
