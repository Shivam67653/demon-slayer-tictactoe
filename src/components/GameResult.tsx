import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import tanjiroImage from "@/assets/tanjiro-victory.jpg";
import akazaImage from "@/assets/akaza-victory.jpg";
import nezukoImage from "@/assets/nezuko-draw.jpg";

type CellValue = "X" | "O" | "";
type Winner = "player" | "ai" | "draw" | null;

interface GameResultProps {
  winner: Winner;
  board: CellValue[];
  onPlayAgain: () => void;
}

interface CharacterData {
  name: string;
  image: string;
  message: string;
  theme: string;
}

const getCharacterData = (winner: Winner): CharacterData => {
  switch (winner) {
    case "player":
      return {
        name: "Tanjiro Kamado",
        image: tanjiroImage,
        message: "Your determination burns bright like the flames of the sun!",
        theme: "Victory achieved through compassion and strength!"
      };
    case "ai":
      return {
        name: "Akaza",
        image: akazaImage,
        message: "The demon's power overwhelms! Your technique needs refinement.",
        theme: "Destructive force claims another victory!"
      };
    case "draw":
      return {
        name: "Nezuko Kamado",
        image: nezukoImage,
        message: "A perfectly balanced battle! Both warriors showed great skill.",
        theme: "Harmony prevails in this gentle stalemate!"
      };
    default:
      return {
        name: "Unknown",
        image: "",
        message: "",
        theme: ""
      };
  }
};

export default function GameResult({ winner, board, onPlayAgain }: GameResultProps) {
  const character = getCharacterData(winner);
  
  const getResultText = () => {
    switch (winner) {
      case "player": return "Player Wins!";
      case "ai": return "AI Wins!";
      case "draw": return "Draw!";
      default: return "";
    }
  };

  const getResultColor = () => {
    switch (winner) {
      case "player": return "text-player-x";
      case "ai": return "text-ai-o";
      case "draw": return "text-accent";
      default: return "text-foreground";
    }
  };

  return (
    <div className="text-center space-y-6">
      {/* Character Image */}
      <div className="relative mx-auto w-48 h-36 rounded-lg overflow-hidden shadow-game-glow">
        <img 
          src={character.image}
          alt={character.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Game Result */}
      <div>
        <h2 className={`text-3xl font-bold ${getResultColor()} mb-2`}>
          {getResultText()}
        </h2>
        <Badge variant="outline" className="text-lg py-1 px-3">
          {character.name}
        </Badge>
      </div>

      {/* Character Message */}
      <Card className="p-4 bg-muted/50">
        <p className="text-muted-foreground italic">
          "{character.message}"
        </p>
      </Card>

      {/* Final Board Display */}
      <div>
        <h3 className="text-sm text-muted-foreground mb-3">Final Board:</h3>
        <div className="grid grid-cols-3 gap-1 w-24 mx-auto">
          {board.map((cell, index) => (
            <div
              key={index}
              className={`
                aspect-square flex items-center justify-center text-xs font-bold
                border border-border rounded
                ${cell === "X" ? "text-player-x bg-player-x/10" : ""}
                ${cell === "O" ? "text-ai-o bg-ai-o/10" : ""}
                ${!cell ? "bg-muted/30" : ""}
              `}
            >
              {cell || "·"}
            </div>
          ))}
        </div>
      </div>

      {/* Play Again Button */}
      <Button 
        onClick={onPlayAgain}
        className="w-full bg-flame-gradient hover:opacity-90 text-primary-foreground font-bold"
      >
        Begin New Battle
      </Button>
    </div>
  );
}