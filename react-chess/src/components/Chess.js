import React, { useState, useEffect } from "react";
import axios from "axios";
import "./chess.css";
const Chess = ({ dataa }) => {
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(0);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [currentBoardIndex, setCurrentBoardIndex] = useState(0);
  const [chessboard, setChessboard] = useState(
    Array(8).fill(Array(8).fill(null))
  );
  const [prevChessboard, setPrevChessboard] = useState(
    Array(8).fill(Array(8).fill(null))
  );

  const pieceMapper = (piece) => {
    const piecesMap = {
      R: "&#9820;",
      N: "&#9822;",
      B: "&#9821;",
      Q: "&#9819;",
      K: "&#9818;",
      r: "&#9814;",
      n: "&#9816;",
      b: "&#9815;",
      q: "&#9813;",
      k: "&#9812;",
      p: "&#9817;",
      P: "&#9823;",
    };
    return piecesMap[piece] || null;
  };
  
  let boardStrings = [ 
    // "r . b q k b n r↵p p p p p p p p↵n . . . . . . .↵. . . . . . . .↵. . . . . . . .↵N . . . . . . .↵P P P P P P P P↵R . B Q K B N R"
    // "r n b q k b n r↵p p p p p p p p↵. . . . . . . .↵. . . . . . . .↵. . . . . . . .↵. . . . . . . .↵P P P P P P P P↵R N B Q K B N R",
    // "r . b q k b r .↵p p p p p p p p↵n . . . . n . .↵. . . . . . . .↵. . . . . . . .↵N . . . . . . .↵P P P P P P P P↵R . B Q K B N R",
  ];

  if (dataa) {
    for(let i = 0; i < dataa.length; i++){
    for (let x = 0; x < dataa[0].length; x++) {
      boardStrings.push(dataa[0][x]["board"]);
    } 
    } 
  }

  const renderChessboard = () => {
    // console.log("this is the chessboard", chessboard)
    let idx = 0
    let idxx = 1
    let count = 0
    return chessboard.map((row, rowIndex) => {
      return row.map((cell, cellIndex) => {
        count++
        const cellColor = (idx + idxx) % 2 === 0 ? "white" : "black";
        idxx ? idxx= 0 : idxx = 1
        if (count % 8 === 0)
            idx++
            
        return (
          <div
            key={`${rowIndex}-${cellIndex}`} 
            className={cellColor}
            dangerouslySetInnerHTML={{ __html: cell ? cell.piece : "" }}
            
          />
        );
      }); 
      
    });
  };


  // const renderChessboard = () => {
  //   let idx = 0;
  //   let idxx = 1;
  //   let count = 0;
  //   return chessboard.map((row, rowIndex) => {
  //     return row.map((cell, cellIndex) => {
  //       count++;
  //       const cellColor = (idx + idxx) % 2 === 0 ? "white" : "black";
  //       idxx ? (idxx = 0) : (idxx = 1);
  //       if (count % 8 === 0) idx++;

  //       const movingPiece =
  //         cell &&
  //         prevChessboard[rowIndex][cellIndex] &&
  //         cell.piece !== prevChessboard[rowIndex][cellIndex].piece
  //           ? "moving-piece"
  //           : "";

  //       return (
  //         <div
  //           key={`${rowIndex}-${cellIndex}`}
  //           className={`${cellColor} ${movingPiece}`}
  //           dangerouslySetInnerHTML={{ __html: cell ? cell.piece : "" }}
  //         />
  //       );
  //     });
  //   });
  // };

  useEffect(() => {
     
    const interval = setInterval(() => {
      setCurrentBoardIndex(
        (prevIndex) => (prevIndex + 1) % boardStrings.length
      );
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

function splitStringInto8x8Grid(inputString) {
  const cleanedString = inputString.replace(/[\s\n]/g, "");
  const result = [];

  for (let i = 0; i < cleanedString.length; i += 8) {
    const row = cleanedString.slice(i, i + 8).split("");
    result.push(row);
  }

  return result;
}


  // useEffect(() => {
 
  //   if (boardStrings.length > 0) {
  //     let return_string = splitStringInto8x8Grid(boardStrings[currentBoardIndex]);
  //     const newBoard = return_string.map((row, rowIndex) =>
  //       row.map((cell, cellIndex) =>
  //         pieceMapper(cell)
  //           ? {
  //               piece: pieceMapper(cell),
  //               position: { row: rowIndex, col: cellIndex },
  //             }
  //           : null
  //       )
  //     );
  //     setChessboard(newBoard); 
  //   }
  // }, [currentBoardIndex]);


  useEffect(() => {
    if (boardStrings.length > 0) {
      let return_string = splitStringInto8x8Grid(
        boardStrings[currentBoardIndex]
      );
      const newBoard = return_string.map((row, rowIndex) =>
        row.map((cell, cellIndex) =>
          pieceMapper(cell)
            ? {
                piece: pieceMapper(cell),
                position: { row: rowIndex, col: cellIndex },
              }
            : null
        )
      );
      setPrevChessboard(chessboard);
      setChessboard(newBoard);
    }
  }, [currentBoardIndex]);


  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div className="flex-col">
        <p>Kung Fu Chess Vizualizer</p>
        <div>
          <p>Game: {currentGameIndex}</p>
        </div>
        <div>
          <p>Time: {currentBoardIndex} </p>
        </div>
      </div>
      <div className="chessboard-container">
        <div className="chessboard">{renderChessboard()}</div>
      </div>
    </>
  );
}

export default Chess;
