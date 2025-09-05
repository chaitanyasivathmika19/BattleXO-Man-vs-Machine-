const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("reset");
const darkModeToggle = document.getElementById("darkModeToggle");
const modeSelect = document.getElementById("mode");

const xScoreDisplay = document.getElementById("xScore");
const oScoreDisplay = document.getElementById("oScore");
const drawsDisplay = document.getElementById("draws");

let xScore = 0;
let oScore = 0;
let draws = 0;

let currentPlayer = "X";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

function getMode() {
  return modeSelect.value;
}

const winConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function handleCellClick(e) {
  const index = e.target.dataset.index;

  if (gameBoard[index] !== "" || !gameActive) return;

  makeMove(index, currentPlayer);
  if (getMode() !== "human" && gameActive && currentPlayer === "O") {
    setTimeout(computerMove, 500);
  }
}

function makeMove(index, player) {
  if (gameBoard[index] !== "") return;

  gameBoard[index] = player;
  cells[index].textContent = player;

  if (checkWin(player)) {
    statusText.textContent = `🎉 Player ${player} wins!`;
    gameActive = false;
    updateScore(player);
  } else if (gameBoard.every(cell => cell !== "")) {
    statusText.textContent = "😲 It's a draw!";
    draws++;
    drawsDisplay.textContent = draws;
    gameActive = false;
  } else {
    currentPlayer = player === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function computerMove() {
  const mode = getMode();
  let move;

  if (mode === "easy") {
    const empty = gameBoard.map((v, i) => v === "" ? i : null).filter(v => v !== null);
    move = empty[Math.floor(Math.random() * empty.length)];
  } else if (mode === "hard") {
    move = getBestMove("O");
  }

  makeMove(move, "O");
}

function getBestMove(player) {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (gameBoard[i] === "") {
      gameBoard[i] = player;
      let score = minimax(gameBoard, 0, false);
      gameBoard[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(board, depth, isMaximizing) {
  if (checkWin("O", board)) return 10 - depth;
  if (checkWin("X", board)) return depth - 10;
  if (board.every(cell => cell !== "")) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "O";
        best = Math.max(best, minimax(board, depth + 1, false));
        board[i] = "";
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "X";
        best = Math.min(best, minimax(board, depth + 1, true));
        board[i] = "";
      }
    }
    return best;
  }
}

function checkWin(player, board = gameBoard) {
  return winConditions.some(condition =>
    condition.every(index => board[index] === player)
  );
}

function updateScore(winner) {
  if (winner === "X") {
    xScore++;
    xScoreDisplay.textContent = xScore;
  } else {
    oScore++;
    oScoreDisplay.textContent = oScore;
  }
}

function resetGame() {
  currentPlayer = "X";
  gameBoard = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  statusText.textContent = `Player ${currentPlayer}'s turn`;
  cells.forEach(cell => (cell.textContent = ""));
  if (getMode() !== "human" && currentPlayer === "O") {
    setTimeout(computerMove, 500);
  }
}

cells.forEach(cell => cell.addEventListener("click", handleCellClick));
resetBtn.addEventListener("click", resetGame);
modeSelect.addEventListener("change", resetGame);

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  darkModeToggle.textContent = document.body.classList.contains("dark")
    ? "☀️ Light Mode"
    : "🌙 Dark Mode";
});
