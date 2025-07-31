import { Button } from "@/components/ui/button";

type CellValue = "X" | "O" | "";

interface GameBoardProps {
  board: CellValue[];
  onCellClick: (index: number) => void;
  disabled?: boolean;
}

export default function GameBoard({ board, onCellClick, disabled }: GameBoardProps) {
  return (
    <div className="grid grid-cols-3 gap-3 w-full max-w-xs mx-auto">
      {board.map((cell, index) => (
        <Button
          key={index}
          variant="outline"
          className={`
            aspect-square text-3xl font-bold transition-all duration-300
            bg-board-cell border-border hover:bg-board-hover
            ${cell === "X" ? "text-player-x border-player-x shadow-game-glow" : ""}
            ${cell === "O" ? "text-ai-o border-ai-o shadow-game-glow" : ""}
            ${disabled ? "cursor-not-allowed opacity-50" : "hover:scale-105 active:animate-cell-pulse"}
          `}
          onClick={() => onCellClick(index)}
          disabled={disabled || cell !== ""}
        >
          {cell}
        </Button>
      ))}
    </div>
  );
}