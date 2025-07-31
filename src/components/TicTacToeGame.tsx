import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import GameBoard from "./GameBoard";
import GameResult from "./GameResult";
import { toast } from "sonner";

type CellValue = "X" | "O" | "";
type GameState = "playing" | "finished";
type Winner = "player" | "ai" | "draw" | null;

export default function TicTacToeGame() {
  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(""));
  const [gameState, setGameState] = useState<GameState>("playing");
  const [winner, setWinner] = useState<Winner>(null);
  const [isAiTurn, setIsAiTurn] = useState(false);

  const checkWinner = (board: CellValue[]): Winner => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a] === "X" ? "player" : "ai";
      }
    }

    if (board.every(cell => cell !== "")) {
      return "draw";
    }

    return null;
  };

  const makeAiMove = (currentBoard: CellValue[]) => {
    // Simple AI: try to win, block player, or take center/corner
    const emptyCells = currentBoard.map((cell, index) => cell === "" ? index : null).filter(index => index !== null) as number[];
    
    if (emptyCells.length === 0) return;

    // Try to win
    for (const cell of emptyCells) {
      const testBoard = [...currentBoard];
      testBoard[cell] = "O";
      if (checkWinner(testBoard) === "ai") {
        return cell;
      }
    }

    // Block player from winning
    for (const cell of emptyCells) {
      const testBoard = [...currentBoard];
      testBoard[cell] = "X";
      if (checkWinner(testBoard) === "player") {
        return cell;
      }
    }

    // Take center if available
    if (emptyCells.includes(4)) {
      return 4;
    }

    // Take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(corner => emptyCells.includes(corner));
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Take any remaining cell
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  };

  const handleCellClick = (index: number) => {
    if (board[index] !== "" || gameState === "finished" || isAiTurn) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    if (winner) {
      setWinner(winner);
      setGameState("finished");
      toast.success(winner === "player" ? "Victory is yours!" : winner === "ai" ? "The demon prevails!" : "A balanced battle!");
      return;
    }

    // AI turn
    setIsAiTurn(true);
    setTimeout(() => {
      const aiMove = makeAiMove(newBoard);
      if (aiMove !== undefined) {
        const aiBoard = [...newBoard];
        aiBoard[aiMove] = "O";
        setBoard(aiBoard);

        const aiWinner = checkWinner(aiBoard);
        if (aiWinner) {
          setWinner(aiWinner);
          setGameState("finished");
          toast.success(aiWinner === "ai" ? "The demon prevails!" : aiWinner === "player" ? "Victory is yours!" : "A balanced battle!");
        }
      }
      setIsAiTurn(false);
    }, 800);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(""));
    setGameState("playing");
    setWinner(null);
    setIsAiTurn(false);
    toast.info("A new battle begins!");
  };

  return (
    <div className="min-h-screen bg-night-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-flame-gradient bg-clip-text text-transparent mb-2 animate-flame-flicker">
            Demon Slayer
          </h1>
          <h2 className="text-2xl text-foreground mb-4">Tic-Tac-Toe</h2>
          <div className="flex justify-center gap-4 mb-4">
            <Badge variant="outline" className="border-player-x text-player-x">
              You: X
            </Badge>
            <Badge variant="outline" className="border-ai-o text-ai-o">
              Akaza: O
            </Badge>
          </div>
          {isAiTurn && (
            <p className="text-muted-foreground animate-pulse">
              Akaza is thinking...
            </p>
          )}
        </div>

        <Card className="p-6 shadow-game-glow">
          {gameState === "playing" ? (
            <GameBoard 
              board={board} 
              onCellClick={handleCellClick}
              disabled={isAiTurn}
            />
          ) : (
            <GameResult 
              winner={winner} 
              board={board}
              onPlayAgain={resetGame}
            />
          )}
        </Card>

        {gameState === "playing" && (
          <div className="text-center mt-6">
            <Button variant="outline" onClick={resetGame}>
              Reset Battle
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}