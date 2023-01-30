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
    gameBoard.displayBoard();
});

pvai.addEventListener('click', () => {
    toggleHidden(body);
    toggleHidden(gameDisplay);
    gameBoard.displayBoard();
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

/** Gameboard functionality */
const gameBoard = (() => {
    let board = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
    const displayBoard = () => {
        removeChildNodes();
        for (let cell of board) {
            addDiv(cell);
        }
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
        updateBoard,
        displayBoard,
        resetBoard,
        checkWin,
        checkFullBoard,
    };
})();
