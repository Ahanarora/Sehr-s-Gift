import type { Tone } from "../app/state/types";
import Button from "./Button";

interface Props {
  tones: Tone[];
  active?: Tone[];
  onChange: (tones: Tone[]) => void;
}

export const ToneFilterChips = ({ tones, active = [], onChange }: Props) => {
  const toggle = (tone: Tone) => {
    if (active.includes(tone)) {
      onChange(active.filter((t) => t !== tone));
    } else {
      onChange([...active, tone]);
    }
  };

  if (tones.length === 0) return null;

  return (
    <div className="bb-chip-row">
      {tones.map((tone) => (
        <Button
          key={tone}
          variant={active.includes(tone) ? "primary" : "secondary"}
          onClick={() => toggle(tone)}
        >
          {tone}
        </Button>
      ))}
    </div>
  );
};

export default ToneFilterChips;
