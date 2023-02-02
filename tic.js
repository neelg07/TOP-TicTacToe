// Show versus-text depending on where user is hovering
const pvp = document.querySelector('.pvp img');
const pvai = document.querySelector('.ai img');
const pvpText = document.getElementById('pvp-txt');
const pvaiText = document.getElementById('pvai-txt');

// Toggle class with display:none;
function toggleHidden(query) {
    query.classList.toggle('hidden');
}

// Mouseover/Mouseout functions
pvp.addEventListener('mouseover', () => {
    toggleHidden(pvpText);
});

pvp.addEventListener('mouseout', () => {
    toggleHidden(pvpText);
});

pvai.addEventListener('mouseover', () => {
    toggleHidden(pvaiText);
});

pvai.addEventListener('mouseout', () => {
    toggleHidden(pvaiText);
});

const body = document.querySelector('.body');
const gameDisplay = document.querySelector('.game-body');

// Choose opponent onclick funcs
pvp.addEventListener('click', () => {
    toggleHidden(body);
    toggleHidden(gameDisplay);
    pvpGame.play();
});

pvai.addEventListener('click', () => {
    // To Do
});

const boardDiv = document.querySelector('.board');

/** Dom manipulation functions (used in gameBoard module/object) */
function removeChildNodes() {
    while (boardDiv.firstChild) {
        boardDiv.removeChild(boardDiv.firstChild);
    }
}

function addDiv(marker) {
    // create parent div
    let div = document.createElement('div');
    div.classList.toggle('cell');
    // add h1 with innerhtml referencing the marker arg
    let h1 = document.createElement('h1');
    h1.classList.toggle('marking');
    h1.innerHTML = marker;
    // Append children to parent nodes
    div.appendChild(h1);
    boardDiv.appendChild(div);
}

// DOM created cells in gameboard
let cells = document.getElementsByClassName('cell');

// Add onclick event for each cell in board
function addBoardEventListeners(marker) {
    for (let i = 0; i < cells.length; i++) {
        cells[i].onclick = () => {
            gameBoard.updateBoard(marker, i);
        };
    }
}

/** Gameboard functionality */
const gameBoard = (() => {
    let board = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
    const displayBoard = (marker) => {
        removeChildNodes();
        for (let cell of board) {
            addDiv(cell);
        }
        addBoardEventListeners(marker);
    };
    const updateBoard = (marker, position) => {
        if (board[position] === ' ') {
            board[position] = marker;
        } else {
            console.log('Spot taken!');
        }
        displayBoard();
    };
    const resetBoard = () => {
        board = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
        displayBoard();
    };
    const checkWin = (marker) => {
        return (
            (board[0] === marker &&
                board[1] === marker &&
                board[2] === marker) ||
            (board[3] === marker &&
                board[4] === marker &&
                board[5] === marker) ||
            (board[6] === marker &&
                board[7] === marker &&
                board[8] === marker) ||
            (board[0] === marker &&
                board[3] === marker &&
                board[6] === marker) ||
            (board[1] === marker &&
                board[4] === marker &&
                board[7] === marker) ||
            (board[2] === marker &&
                board[5] === marker &&
                board[8] === marker) ||
            (board[0] === marker &&
                board[4] === marker &&
                board[8] === marker) ||
            (board[2] === marker && board[4] === marker && board[6] === marker)
        );
    };
    const checkFullBoard = () => {
        for (let cell of board) {
            if (cell === ' ') {
                return false;
            }
        }
        return true;
    };

    return {
        board,
        updateBoard,
        displayBoard,
        resetBoard,
        checkWin,
        checkFullBoard,
    };
})();
/////

// Player Factory Function //
const player = (marker) => {
    let turn = false;

    return {
        marker,
        turn,
    };
};

// Implement GamePlay
const pvpGame = (() => {
    // Initialize players
    let player1 = player('X');
    let player2 = player('O');

    // Randomly choose who goes first
    const firstTurn = () => {
        let random = Math.floor(Math.random() * 2 + 1);
        console.log(`Player ${random} goes first`);
        random === 1 ? pvpGame.setTurn(player1, player2) : pvpGame.setTurn(player2, player1);
    };

    const setTurn = (active, other) => {
        active.turn = true;
        other.turn = false;
        console.log(`${active.marker}'s turn!`);
    };

    const play = () => {
        firstTurn();
        player1.turn
            ? gameBoard.displayBoard(player1.marker)
            : gameBoard.displayBoard(player2.marker);
    };

    return {
        player1,
        player2,
        firstTurn,
        setTurn,
        play,
    };
})();
