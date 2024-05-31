import React, { useState } from 'react';
//create each square with the id which we need to change the background color for the algorithm an onsquare function to make the appropiate actions to each square
function Square({ id, value, onSquareClick }) 
{
    return (
    <button id={`${id}`} className="square" onClick={onSquareClick}>
        {value}
    </button>
  );
}

export default function Board() 
{
    const [squares, setSquares] = useState(Array(81).fill(null));
    //next few lines of code are to highlight which function is currently available: startpoint, endpoint, blockpoint
    const [activeButton, setActiveButton] = useState(null);
    const [buttonStates, setButtonStates] = useState({
        button1: false,
        button2: false,
        button3: false
});

function resetBoard() 
{
    setSquares(Array(81).fill(null));
    const squares = document.querySelectorAll('.square');
    squares.forEach(square => {
        square.style.backgroundColor = 'white'; // Set the desired background color
    });
}

//when a square is clicked depending on which mode is highlighted it will do any of the following:
function handleClick(i) 
{
    const nextSquares = squares.slice();
    //sets the start point, console logs a message if more than one start point is attempted
    //ONLY 1 START POINT IS ALLOWED 
    if (activeButton === 'button1')
    {
        if (squares.includes("O")) 
            {
            console.log("You can only have one starting position!");
            } 
        else 
        {
            nextSquares[i] = 'O'; // Set starting point
        }
    }
    //sets the end point, console logs a message if more that on end point is attempted
    //ONLY 1 END POINT IS ALLOWED
    else if (activeButton === 'button2') 
        {
        if (squares.includes("X")) 
            {
            console.log("You can only have 1 end point!");
            } 
        else 
        {
            nextSquares[i] = 'X'; // Set ending point
        }
        }
    //will black out a path making it unavailable to traverse
    else if (activeButton === 'button3')
        {
        //allows the user to undo a white space instead of resetting the entire board
        if(document.getElementById(`${i}`).style.backgroundColor === 'black')
            {
                document.getElementById(`${i}`).style.backgroundColor = 'white';
                nextSquares[i] = ''; // Set block
            }
            else
            {
                nextSquares[i] = 'B'; // Set block
            document.getElementById(`${i}`).style.backgroundColor = 'black';
            }
        }
    setSquares(nextSquares);
}
//sets the current active button
function handleSetActiveButton(buttonName) 
{
    setActiveButton(buttonName);
    setButtonStates(prevStates => ({
      ...prevStates,
      button1: buttonName === 'button1',
      button2: buttonName === 'button2',
      button3: buttonName === 'button3'
    }));
}

// Create an array to hold the rows of squares
const boardRows = [];
// Loop to create 9 rows
for (let i = 0; i < 9; i++) 
    {
    const row = [];
    // Loop to create 9 squares in each row
    for (let j = 0; j < 9; j++) 
        {
            const index = i * 9 + j;
            row.push(
            <Square
            key={index}
            id={index}
            value={squares[index]}
            onSquareClick={() => handleClick(index)}
            />
        );
        }
    boardRows.push(<div key={i} className="board-row">{row}</div>);
    }

return (
    <>
    {boardRows}
    <h1>Click a starting spot and an ending spot</h1>
    <h2>O = Starting : X = Ending</h2>
    <button
    id="button1"
    onClick={() => handleSetActiveButton('button1')}
    style={{ backgroundColor: buttonStates.button1 ? 'green' : 'transparent' }}
    >
    Set Start
    </button>
    <button
    id="button2"
    onClick={() => handleSetActiveButton('button2')}
    style={{ backgroundColor: buttonStates.button2 ? 'red' : 'transparent' }}
    >
    Set End
    </button>
    <button
    id="button3"
    onClick={() => handleSetActiveButton('button3')}
    style={{ backgroundColor: buttonStates.button3 ? 'gray' : 'transparent' }}
    >
    Set Block
    </button>
    <br />
    <button onClick={resetBoard}>Reset Board</button>
    <br />
    <button>Run BFS</button>
    </>
  );
}
