import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import tanjiroImage from "@/assets/tanjiro-victory.jpg";
import giyuImage from "@/assets/giyu-hashira.jpg";
import rengokuImage from "@/assets/rengoku-hashira.jpg";
import shinobuImage from "@/assets/shinobu-hashira.jpg";
import akazaImage from "@/assets/akaza-victory.jpg";
import domaImage from "@/assets/doma-uppermoon.jpg";
import kokushiboImage from "@/assets/kokushibo-uppermoon.jpg";
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

const hashiraCharacters = [
  {
    name: "Tanjiro Kamado",
    image: tanjiroImage,
    message: "Your determination burns bright like the flames of the sun!",
    theme: "Victory achieved through compassion and strength!"
  },
  {
    name: "Giyu Tomioka",
    image: giyuImage,
    message: "Water flows peacefully, yet cuts through the strongest stone.",
    theme: "Calm determination leads to victory!"
  },
  {
    name: "Kyojuro Rengoku",
    image: rengokuImage,
    message: "Set your heart ablaze! Your passion burns brighter than flames!",
    theme: "Fiery spirit conquers all challenges!"
  },
  {
    name: "Shinobu Kocho",
    image: shinobuImage,
    message: "Even the smallest blade can defeat the mightiest demon.",
    theme: "Gentle strength achieves impossible victories!"
  }
];

const upperMoonCharacters = [
  {
    name: "Akaza",
    image: akazaImage,
    message: "The demon's power overwhelms! Your technique needs refinement.",
    theme: "Destructive force claims another victory!"
  },
  {
    name: "Doma",
    image: domaImage,
    message: "How fascinating! Your struggle amuses me greatly.",
    theme: "Icy superiority freezes all hope!"
  },
  {
    name: "Kokushibo",
    image: kokushiboImage,
    message: "Six eyes see all weaknesses. You cannot escape fate.",
    theme: "Ancient power transcends mortal limits!"
  }
];

const getCharacterData = (winner: Winner): CharacterData => {
  switch (winner) {
    case "player":
      const randomHashira = hashiraCharacters[Math.floor(Math.random() * hashiraCharacters.length)];
      return randomHashira;
    case "ai":
      const randomUpperMoon = upperMoonCharacters[Math.floor(Math.random() * upperMoonCharacters.length)];
      return randomUpperMoon;
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
  
  const downloadPoster = async () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = 800;
    canvas.height = 1000;
    
    // Background
    ctx.fillStyle = '#0f0f0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Title
    ctx.fillStyle = '#ff6b4a';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Demon Slayer Tic-Tac-Toe', canvas.width / 2, 60);
    
    // Result
    ctx.fillStyle = winner === "player" ? '#22c55e' : winner === "ai" ? '#ef4444' : '#f59e0b';
    ctx.font = 'bold 28px Arial';
    const resultText = winner === "player" ? "Player Wins!" : winner === "ai" ? "AI Wins!" : "Draw!";
    ctx.fillText(resultText, canvas.width / 2, 120);
    
    // Character name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(character.name, canvas.width / 2, 160);
    
    // Load and draw character image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.drawImage(img, canvas.width / 2 - 150, 180, 300, 200);
      
      // Message
      ctx.fillStyle = '#d1d5db';
      ctx.font = '18px Arial';
      const words = character.message.split(' ');
      let line = '';
      let y = 420;
      
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > 600 && n > 0) {
          ctx.fillText(line, canvas.width / 2, y);
          line = words[n] + ' ';
          y += 25;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, canvas.width / 2, y);
      
      // Draw board
      const boardStartX = canvas.width / 2 - 120;
      const boardStartY = y + 50;
      const cellSize = 80;
      
      ctx.strokeStyle = '#4b5563';
      ctx.lineWidth = 2;
      
      // Draw grid
      for (let i = 0; i <= 3; i++) {
        ctx.beginPath();
        ctx.moveTo(boardStartX + i * cellSize, boardStartY);
        ctx.lineTo(boardStartX + i * cellSize, boardStartY + 3 * cellSize);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(boardStartX, boardStartY + i * cellSize);
        ctx.lineTo(boardStartX + 3 * cellSize, boardStartY + i * cellSize);
        ctx.stroke();
      }
      
      // Draw X and O
      ctx.font = 'bold 36px Arial';
      for (let i = 0; i < 9; i++) {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const x = boardStartX + col * cellSize + cellSize / 2;
        const y = boardStartY + row * cellSize + cellSize / 2 + 12;
        
        if (board[i] === 'X') {
          ctx.fillStyle = '#22c55e';
          ctx.fillText('X', x, y);
        } else if (board[i] === 'O') {
          ctx.fillStyle = '#ef4444';
          ctx.fillText('O', x, y);
        }
      }
      
      // Download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `demon-slayer-tic-tac-toe-${winner}-${Date.now()}.png`;
          a.click();
          URL.revokeObjectURL(url);
        }
      });
    };
    img.src = character.image;
  };
  
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

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button 
          onClick={downloadPoster}
          variant="outline"
          className="w-full border-accent text-accent hover:bg-accent/10"
        >
          📥 Download Victory Poster
        </Button>
        <Button 
          onClick={onPlayAgain}
          className="w-full bg-flame-gradient hover:opacity-90 text-primary-foreground font-bold"
        >
          Begin New Battle
        </Button>
      </div>
    </div>
  );
}