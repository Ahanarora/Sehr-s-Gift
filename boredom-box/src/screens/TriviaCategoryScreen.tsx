import Button from "../components/Button";
import type { Category } from "../app/state/types";

interface Props {
  categories: Category[];
  onSelectCategory: (category: Category) => void;
  onBack: () => void;
}

export const TriviaCategoryScreen = ({ categories, onSelectCategory, onBack }: Props) => {
  return (
    <div className="bb-screen">
      <div className="bb-topbar">
        <Button variant="ghost" onClick={onBack}>
          ← Back
        </Button>
        <h2>Pick a category</h2>
      </div>
      <div className="bb-grid">
        {categories.map((cat) => (
          <button
            key={cat}
            className="bb-card"
            onClick={() => onSelectCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TriviaCategoryScreen;
