import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import GameBoard from "./GameBoard";
import GameResult from "./GameResult";
import { toast } from "sonner";

type CellValue = "X" | "O" | "";
type GameState = "selecting" | "playing" | "finished";
type Winner = "player" | "ai" | "draw" | null;
type PlayerSymbol = "X" | "O";

export default function TicTacToeGame() {
  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(""));
  const [gameState, setGameState] = useState<GameState>("selecting");
  const [winner, setWinner] = useState<Winner>(null);
  const [isAiTurn, setIsAiTurn] = useState(false);
  const [playerSymbol, setPlayerSymbol] = useState<PlayerSymbol>("X");

  const checkWinner = (board: CellValue[]): Winner => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a] === playerSymbol ? "player" : "ai";
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

    const aiSymbol = playerSymbol === "X" ? "O" : "X";

    // Try to win
    for (const cell of emptyCells) {
      const testBoard = [...currentBoard];
      testBoard[cell] = aiSymbol;
      if (checkWinner(testBoard) === "ai") {
        return cell;
      }
    }

    // Block player from winning
    for (const cell of emptyCells) {
      const testBoard = [...currentBoard];
      testBoard[cell] = playerSymbol;
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

  const startGame = (symbol: PlayerSymbol) => {
    setPlayerSymbol(symbol);
    setGameState("playing");
    setBoard(Array(9).fill(""));
    setWinner(null);
    setIsAiTurn(false); // Player always starts first
    
    toast.info("A new battle begins!");
  };

  const handleCellClick = (index: number) => {
    if (board[index] !== "" || gameState === "finished" || isAiTurn) return;

    const newBoard = [...board];
    newBoard[index] = playerSymbol;
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
        const aiSymbol = playerSymbol === "X" ? "O" : "X";
        aiBoard[aiMove] = aiSymbol;
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
    setGameState("selecting");
    setBoard(Array(9).fill(""));
    setWinner(null);
    setIsAiTurn(false);
  };

  return (
    <div className="min-h-screen bg-night-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-flame-gradient bg-clip-text text-transparent mb-2 animate-flame-flicker">
            Demon Slayer
          </h1>
          <h2 className="text-2xl text-foreground mb-4">Tic-Tac-Toe</h2>
          
          {gameState === "playing" && (
            <>
              <div className="flex justify-center gap-4 mb-4">
                <Badge variant="outline" className={playerSymbol === "X" ? "border-player-x text-player-x" : "border-ai-o text-ai-o"}>
                  You: {playerSymbol}
                </Badge>
                <Badge variant="outline" className={playerSymbol === "X" ? "border-ai-o text-ai-o" : "border-player-x text-player-x"}>
                  Demon: {playerSymbol === "X" ? "O" : "X"}
                </Badge>
              </div>
              {isAiTurn && (
                <p className="text-muted-foreground animate-pulse">
                  The demon is thinking...
                </p>
              )}
            </>
          )}
        </div>

        <Card className="p-6 shadow-game-glow">
          {gameState === "selecting" ? (
            <div className="text-center space-y-6">
              <h3 className="text-xl font-semibold mb-4">Choose Your Symbol</h3>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => startGame("X")}
                  className="text-2xl font-bold px-8 py-6 bg-player-x/20 border-player-x text-player-x hover:bg-player-x/30"
                  variant="outline"
                >
                  X
                </Button>
                <Button 
                  onClick={() => startGame("O")}
                  className="text-2xl font-bold px-8 py-6 bg-ai-o/20 border-ai-o text-ai-o hover:bg-ai-o/30"
                  variant="outline"
                >
                  O
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Choose your symbol and strike first!
              </p>
            </div>
          ) : gameState === "playing" ? (
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