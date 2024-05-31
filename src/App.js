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
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function runBFS(grid, start, target) {
    clearPathVisualization();
    const visited = new Array(grid.length).fill(false);
    const parent = new Array(grid.length).fill(null);
    const queue = [start];
    visited[start] = true;

    while (queue.length > 0) {
        const current = queue.shift();
        if (current === target) {
            return constructPath(parent, start, target);
        }

        const neighbors = getValidNeighbors(current, grid);
        for (const neighbor of neighbors) {
            if (!visited[neighbor]) {
                queue.push(neighbor);
                visited[neighbor] = true;
                parent[neighbor] = current; //Record parent node
                document.getElementById(`${neighbor}`).style.backgroundColor = '#FFB347';
            }
        }
    }

    return []; //Target not reachable
}

function clearPathVisualization() {
    const gridElements = document.querySelectorAll('.square');
    gridElements.forEach(element => {
        if (element.style.backgroundColor !== "black") {
            element.style.backgroundColor = ''; // Clear background color
        }
    });
}

function getValidNeighbors(index, grid) {
    const neighbors = [];
    const rowSize = Math.sqrt(grid.length);
    const row = Math.floor(index / rowSize);
    const col = index % rowSize;

    //Check neighboring cells for validity
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // Up, Down, Left, Right
    for (const [dx, dy] of directions) {
        const newRow = row + dx;
        const newCol = col + dy;
        const newIndex = newRow * rowSize + newCol;
        
        if (
            newRow >= 0 && newRow < rowSize &&
            newCol >= 0 && newCol < rowSize &&
            grid[newIndex] !== 'B'
        ) {
            neighbors.push(newIndex);
        }
    }

    return neighbors;
}


//Helper function to construct the path from start to target
function constructPath(parent, start, target) {
    const path = [target];
    let current = target;
    while (current !== start) {
        document.getElementById(`${current}`).style.backgroundColor = '#00FFFF';
        current = parent[current];
        path.unshift(current);
    }
    return path;
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------
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
    let start = null
    let end = null
    const nextSquares = squares.slice();
    if (activeButton === 'button1')
    {
        if (squares.includes("O")) 
            {
            //allows user to change the start location without resetting the whole board
            start = squares.indexOf("O");
            nextSquares[start] = null;
            nextSquares[i] = 'O';
            start = 0;
            } 
        else 
        {
            nextSquares[i] = 'O'; // Set starting point
        }
    }
    else if (activeButton === 'button2') 
        {
        if (squares.includes("X")) 
            {
                //allows user to change the end location without resetting the whole board
                end = squares.indexOf("X");
                nextSquares[end] = null;
                nextSquares[i] = 'X';
                end = 0;
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
    className='button'
    id="button1"
    onClick={() => handleSetActiveButton('button1')}
    style={{ backgroundColor: buttonStates.button1 ? 'green' : 'white' }}
    >
    Set Start
    </button>
    <button
    className='button'
    id="button2"
    onClick={() => handleSetActiveButton('button2')}
    style={{ backgroundColor: buttonStates.button2 ? 'red' : 'white' }}
    >
    Set End
    </button>
    <button
    className='button'
    id="button3"
    onClick={() => handleSetActiveButton('button3')}
    style={{ backgroundColor: buttonStates.button3 ? 'gray' : 'white' }}
    >
    Set Block
    </button>
    <br />
    <br />
    <button className='button' onClick={resetBoard}>Reset Board</button>
    <br />
    <br />
    <button className='button' onClick={() => runBFS(squares, squares.indexOf("O"), squares.indexOf("X"))}>Run BFS</button>
    </>
  );
}
