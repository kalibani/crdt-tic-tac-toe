import { useState, useEffect } from "react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";

import Board from "./Board";
import calculateWinner from "./CalculateWinner";

const ydoc = new Y.Doc();
const provider = new WebrtcProvider(`tic-tac-toe-crdt`, ydoc);

provider.on("synced", (synced) => {
  console.log("synced!", synced);
});

function Game() {
  const [ticTacToeStates, setTicTacToeStates] = useState({
    history: [
      {
        squares: Array(9).fill(null),
      },
    ],
    stepNumber: 0,
    xIsNext: true,
  });

  useEffect(() => {
    provider.on();
    const ymap = ydoc.getMap("state");
    ymap.observe(() => {
      const xstate = { ...ymap.get("state") };
      setTicTacToeStates(xstate);
    });

    return () => {
      provider.disconnect();
      provider.destroy();
    };
  }, []);

  useEffect(() => {
    () => {
      const ymap = ydoc.getMap("state");
      ymap.set("state", ticTacToeStates);

      console.log("ymap", ymap);
    };
  }, [ticTacToeStates]);

  useEffect(() => {});

  const handleClick = (i) => {
    const history = ticTacToeStates.history.slice(
      0,
      ticTacToeStates.stepNumber + 1
    );
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = ticTacToeStates.xIsNext ? "X" : "O";
    setTicTacToeStates({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !ticTacToeStates.xIsNext,
    });
  };

  const jumpTo = (step) => {
    setTicTacToeStates({
      ...ticTacToeStates,
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  };

  const history = ticTacToeStates.history;
  const current = history[ticTacToeStates.stepNumber];
  const winner = calculateWinner(current.squares);

  const moves = history.map((step, move) => {
    const desc = move ? "Move #" + move : "Game start";
    return (
      <li key={move}>
        <a href="#" onClick={() => jumpTo(move)}>
          {desc}
        </a>
      </li>
    );
  });

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (ticTacToeStates.xIsNext ? "X" : "O");
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={current.squares} onClick={(i) => handleClick(i)} />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

export default Game;
