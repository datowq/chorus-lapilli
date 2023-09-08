import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>{value}</button>
  );
}

function isAdjacent(s, t) {
  const adjacentMoves = [
    [1, 3, 4],
    [0, 2, 3, 4, 5],
    [1, 4, 5],
    [0, 1, 4, 6, 7],
    [0, 1, 2, 3, 5, 6, 7, 8],
    [1, 2, 4, 7, 8],
    [3, 4, 7],
    [3, 4, 5, 6, 8],
    [4, 5, 7],
  ]
  for (let i = 0; i < adjacentMoves[s].length; i++) {
    if (t === adjacentMoves[s][i]) { return true; }
  }
  return false;
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares [a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function Board({ xIsNext, squares, currentMove, onPlay }) {
  const [selected, setSelected] = useState(-1);
  const [tell, setTell] = useState("Welcome!!!");

  const handleClick = (i) => {
    setTell("...");
    if(calculateWinner(squares)) return;
    const nextSquares = squares.slice();
    if (currentMove >= 6) {
      if(!nextSquares[i] && selected === -1) return;
      if(nextSquares[i]) {
        if (xIsNext && nextSquares[i] != 'X') return;
        if (!xIsNext && nextSquares[i] != 'O') return;
        setSelected(i);
        setTell("Move selected at: Row " + (i % 3 + 1) + ", Col " + (Math.floor(i / 3) + 1));
        return;
      }
      if(!nextSquares[i] && selected != -1) {
        if(!isAdjacent(selected, i)) {
          setTell("That move is illegal!! You must select an adjacent square.");
          return;
        }
        const validate = nextSquares.slice();
        if (xIsNext) {
          validate[i] = 'X';
        } else {
          validate[i] = 'O';
        }
        validate[selected] = '';

        if (selected != 4 && nextSquares[4] === 'X' && xIsNext && !calculateWinner(validate)) {
          setTell("Must move out of the center, or win!");
          return;
        }
        if (selected != 4 && nextSquares[4] === 'O' && !xIsNext && !calculateWinner(validate)) {
          setTell("Must move out of the center, or win!");
          return;
        }

        if (xIsNext) {
          nextSquares[i] = 'X';
        } else {
          nextSquares[i] = 'O';
        }
        nextSquares[selected] = '';

        setTell("Amazing move!");
        setSelected(-1);
      }
    } else {
      if(squares[i]) return;
      else if (xIsNext) {
        nextSquares[i] = 'X';
      } else {
        nextSquares[i] = 'O';
      }
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if(winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">CHORUS LAPILLI</div>
      <div className="status">{status}</div>
      <div className="status">{tell}</div>
      {
        Array(3).fill(null).map((_, r) => (
          <div className="board-row" key={r}>
            {
              Array(3).fill(null).map((_, c) => (
              <Square 
                key={r+c*3} 
                value={squares[r+c*3]} 
                onSquareClick={() => handleClick(r+c*3)}
              />
              ))
            }
          </div>
        ))
      }
    </>
  )
}

function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    
    if (move === currentMove) {
      description = 'You are at move #' + move;
    } else if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        {
        (move === currentMove) ?
        <div>{description}</div>
        :
        <button onClick={() => jumpTo(move)}>{description}</button>
        }
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} currentMove={currentMove} 
        onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

export default Game