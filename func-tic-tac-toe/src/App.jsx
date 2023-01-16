import { useState } from 'react';
import calculateWinner from './calculateWinner';

function Square({ value, onSquareClick, squareNum, winnerSquares }) {
  return (
    <button
      className='square'
      style={
        winnerSquares.includes(squareNum)
          ? { backgroundColor: 'lightblue' }
          : { backgroundColor: 'white' }
      }
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)[0]) {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }

    onPlay(nextSquares, i);
  }

  const [winner, winnerSquares] = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    // No winner, show turn
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  function createBoard() {
    let boardRows = [];
    const rows = 3;
    const cols = 3;

    for (let row = 0; row < rows; row++) {
      const boardCols = [];

      for (let col = 0; col < cols; col++) {
        let squareNum = row * rows + col;

        boardCols.push(
          <Square
            key={squareNum}
            squareNum={squareNum}
            winnerSquares={winnerSquares}
            value={squares[squareNum]}
            onSquareClick={() => {
              handleClick(squareNum);
            }}
          />
        );
      }
      boardRows.push(
        <div key={row} className='board-row'>
          {boardCols}
        </div>
      );
    }

    return boardRows;
  }

  return (
    <>
      <div className='status'>{status}</div>
      {createBoard()}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAccending, setIsAccending] = useState(true);
  const [latestMoveSquare, setLatestMoveSquare] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares, squareNum) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setLatestMoveSquare(squareNum);
  }

  // History jumps
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handleIsAccending() {
    setIsAccending(!isAccending);
  }

  const moves = history.map((squares, move) => {
    const col = latestMoveSquare % 3;
    const row = latestMoveSquare % 3;

    let description;
    if (move > 0) {
      description = description = `Go to move #${move} at (${col}, ${row})`;
    } else {
      description = 'Go to game start';
    }

    let element;
    if (move === history.length - 1) {
      element = <span>You are at move {move}</span>;
    } else {
      element = (
        <button
          onClick={() => {
            jumpTo(move);
          }}
        >
          {description}
        </button>
      );
    }

    return <li key={move}>{element}</li>;
  });

  return (
    <div className='game'>
      <div className='game-board'>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className='game-info'>
        <button onClick={() => handleIsAccending()}>Change Order</button>
        <ol>{isAccending ? moves : moves.reverse()}</ol>
      </div>
    </div>
  );
}
