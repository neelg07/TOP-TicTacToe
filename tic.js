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
const scoreboard = document.querySelector('.scoreboard');
const p2ScoreDisplay = document.getElementById('pvp');
const compScoreDisplay = document.getElementById('comp');

// Choose opponent onclick funcs
pvp.addEventListener('click', () => {
    toggleHidden(body);
    toggleHidden(gameDisplay);
    toggleHidden(scoreboard);
    toggleHidden(p2ScoreDisplay);
    toggleHidden(compScore);
    toggleHidden(goBack);
    pvpGame.play();
});

pvai.addEventListener('click', () => {
    toggleHidden(body);
    toggleHidden(gameDisplay);
    toggleHidden(scoreboard);
    toggleHidden(compScoreDisplay);
    toggleHidden(goBack);
    toggleHidden(chip1);
    toggleHidden(chip2);
    pvaiGame.playAI();
});

const boardDiv = document.querySelector('.board');

/** Dom manipulation functions (used in gameBoard module/object) */
function removeChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
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
function addBoardEventListeners(marker, board) {
    for (let i = 0; i < cells.length; i++) {
        cells[i].onclick = () => {
            board.updateBoard(marker, i);
        };
    }
}

// Remove onclick event at endgame
function removeBoardEventListeners() {
    for (let i = 0; i < cells.length; i++) {
        cells[i].onclick = () => false;
    }
}

/** Gameboard functionality */
const gameBoard = (() => {
    const createBoard = () => [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];

    let board = createBoard();

    const displayBoard = (marker) => {
        removeChildNodes(boardDiv);
        for (let cell of gameBoard.board) {
            addDiv(cell);
        }
        if (marker === pvpGame.player1.marker) {
            chip1.classList.remove('hidden');
            chip2.classList.add('hidden');
        } else {
            chip2.classList.remove('hidden');
            chip1.classList.add('hidden');
        }
        addBoardEventListeners(marker, gameBoard);
    };

    const updateBoard = (marker, position) => {
        // Update board only if marker placed in empty spot
        if (gameBoard.board[position] === ' ') {
            gameBoard.board[position] = marker;
        } else {
            displayBoard(marker);
            return;
        }

        // Remove the first turn statement after first move is played
        removeChildNodes(turnDisplay);

        // Check for win or tie (end the game)
        if (checkWin(marker)) {
            // add last mark to board without calling displayboard method
            removeChildNodes(boardDiv);
            for (let cell of gameBoard.board) {
                addDiv(cell);
            }
            // end game
            pvpGame.end(marker);
            return;
        }
        if (checkFullBoard()) {
            removeChildNodes(boardDiv);
            for (let cell of gameBoard.board) {
                addDiv(cell);
            }
            pvpGame.endDraw();
            return;
        }

        // Rerun entire loop alternating player's turns
        marker === pvpGame.player1.marker
            ? displayBoard(pvpGame.player2.marker)
            : displayBoard(pvpGame.player1.marker);
    };

    const checkWin = (marker) => {
        return (
            (gameBoard.board[0] === marker &&
                gameBoard.board[1] === marker &&
                gameBoard.board[2] === marker) ||
            (gameBoard.board[3] === marker &&
                gameBoard.board[4] === marker &&
                gameBoard.board[5] === marker) ||
            (gameBoard.board[6] === marker &&
                gameBoard.board[7] === marker &&
                gameBoard.board[8] === marker) ||
            (gameBoard.board[0] === marker &&
                gameBoard.board[3] === marker &&
                gameBoard.board[6] === marker) ||
            (gameBoard.board[1] === marker &&
                gameBoard.board[4] === marker &&
                gameBoard.board[7] === marker) ||
            (gameBoard.board[2] === marker &&
                gameBoard.board[5] === marker &&
                gameBoard.board[8] === marker) ||
            (gameBoard.board[0] === marker &&
                gameBoard.board[4] === marker &&
                gameBoard.board[8] === marker) ||
            (gameBoard.board[2] === marker &&
                gameBoard.board[4] === marker &&
                gameBoard.board[6] === marker)
        );
    };
    const checkFullBoard = () => {
        for (let cell of gameBoard.board) {
            if (cell === ' ') {
                return false;
            }
        }
        return true;
    };

    return {
        board,
        createBoard,
        updateBoard,
        displayBoard,
        checkWin,
        checkFullBoard,
    };
})();

// Player 1 and Player 2 Chips //
const chip1 = document.querySelector('.p1-chip');
const chip2 = document.querySelector('.p2-chip');

// Player Factory Function //
const player = (marker) => {
    let wins = 0;
    let draws = 0;

    return {
        marker,
        wins,
        draws,
    };
};

// Score displays //
const p1Score = document.getElementById('p1-score');
const p2Score = document.getElementById('p2-score');
const compScore = document.getElementById('comp-score');
const drawScore = document.getElementById('draw-score');

// Player Turn Display //
const turnDisplay = document.querySelector('.turn-display h1');

// Play Again & Go Back Btn
const playAgain = document.getElementById('play-again');
const playAgainAI = document.querySelector('.play-AI');
const goBack = document.querySelector('.back-btn');
const backBtn = document.getElementById('back-btn');

playAgain.addEventListener('click', () => {
    playAgain.classList.add('hidden');
    gameBoard.board = gameBoard.createBoard();
    pvpGame.play();
});

playAgainAI.addEventListener('click', () => {
    playAgainAI.classList.add('hidden');
    computerBoard.board = computerBoard.createBoard();
    pvaiGame.playAI();
});

backBtn.addEventListener('click', () => window.location.reload());

// Implement GamePlay Module
const pvpGame = (() => {
    // Initialize players
    let player1 = player('X');
    let player2 = player('O');

    // Randomly choose who goes first
    const firstTurn = () => {
        let random = Math.floor(Math.random() * 2 + 1);
        turnDisplay.innerHTML = `Player ${random} goes first`;
        return random;
    };

    const play = () => {
        // Update/Display current score
        p1Score.innerHTML = player1.wins;
        p2Score.innerHTML = player2.wins;
        drawScore.innerHTML = player1.draws;

        // who goes first
        let first = firstTurn();
        // start game
        if (first === 1) {
            gameBoard.displayBoard(player1.marker);
        } else {
            gameBoard.displayBoard(player2.marker);
        }
    };

    const end = (marker) => {
        removeBoardEventListeners();

        if (marker === player1.marker) {
            turnDisplay.innerHTML = `Player 1 Wins !`;
            player1.wins++;
        } else {
            turnDisplay.innerHTML = `Player 2 Wins !`;
            player2.wins++;
        }

        toggleHidden(playAgain);
    };

    const endDraw = () => {
        turnDisplay.innerHTML = 'Tie Game !';
        player1.draws++;
        player2.draws++;

        toggleHidden(playAgain);
    };

    return {
        player1,
        player2,
        firstTurn,
        play,
        end,
        endDraw,
    };
})();

// Player vs AI Gameboard
const computerBoard = (() => {
    const createBoard = () => [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];

    let board = createBoard();

    const displayBoard = () => {
        removeChildNodes(boardDiv);
        for (let cell of computerBoard.board) {
            addDiv(cell);
        }
        addBoardEventListeners('X', computerBoard);
    };

    const updateBoard = (marker, position) => {
        if (computerBoard.board[position] === ' ') {
            computerBoard.board[position] = marker;
        } else {
            if (marker === 'X') {
                // if players turn, repeat display board
                computerBoard.displayBoard(marker); // else if computers turn, call computerTurn();
                return;
            } else {
                computerTurn();
                return;
            }
        }

        removeChildNodes(turnDisplay);

        if (checkWin(marker)) {
            removeChildNodes(boardDiv);
            for (let cell of computerBoard.board) {
                addDiv(cell);
            }
            pvaiGame.end(marker);
            return;
        }
        if (checkFullBoard()) {
            removeChildNodes(boardDiv);
            for (let cell of computerBoard.board) {
                addDiv(cell);
            }
            pvaiGame.endDraw();
            return;
        }

        marker === 'X'
            ? computerBoard.computerTurn()
            : computerBoard.displayBoard('X');
    };

    // Function for computer's turn
    const computerTurn = () => {
        let random = Math.floor(Math.random() * 9);
        computerBoard.updateBoard('O', random);
    };

    const checkWin = (marker) => {
        return (
            (computerBoard.board[0] === marker &&
                computerBoard.board[1] === marker &&
                computerBoard.board[2] === marker) ||
            (computerBoard.board[3] === marker &&
                computerBoard.board[4] === marker &&
                computerBoard.board[5] === marker) ||
            (computerBoard.board[6] === marker &&
                computerBoard.board[7] === marker &&
                computerBoard.board[8] === marker) ||
            (computerBoard.board[0] === marker &&
                computerBoard.board[3] === marker &&
                computerBoard.board[6] === marker) ||
            (computerBoard.board[1] === marker &&
                computerBoard.board[4] === marker &&
                computerBoard.board[7] === marker) ||
            (computerBoard.board[2] === marker &&
                computerBoard.board[5] === marker &&
                computerBoard.board[8] === marker) ||
            (computerBoard.board[0] === marker &&
                computerBoard.board[4] === marker &&
                computerBoard.board[8] === marker) ||
            (computerBoard.board[2] === marker &&
                computerBoard.board[4] === marker &&
                computerBoard.board[6] === marker)
        );
    };

    const checkFullBoard = () => {
        for (let cell of computerBoard.board) {
            if (cell === ' ') {
                return false;
            }
        }
        return true;
    };

    return {
        board,
        createBoard,
        updateBoard,
        displayBoard,
        checkWin,
        checkFullBoard,
        computerTurn,
    };
})();

//Player vs AI game logic
const pvaiGame = (() => {
    let player1 = player('X');
    let computer = player('O');

    const firstTurn = () => {
        let random = Math.floor(Math.random() * 2 + 1);
        turnDisplay.innerHTML = `Player ${random} goes first`;
        return random;
    };

    const playAI = () => {
        p1Score.innerHTML = player1.wins;
        compScore.innerHTML = computer.wins;
        drawScore.innerHTML = player1.draws;

        let first = firstTurn();

        if (first === 1) {
            computerBoard.displayBoard(player1.marker);
        } else {
            computerBoard.computerTurn();
        }
    };

    const end = (marker) => {
        removeBoardEventListeners();

        if (marker === player1.marker) {
            turnDisplay.innerHTML = `Player 1 Wins !`;
            player1.wins++;
        } else {
            turnDisplay.innerHTML = `Computer Wins!`;
            computer.wins++;
        }

        toggleHidden(playAgainAI);
    };

    const endDraw = () => {
        turnDisplay.innerHTML = 'Tie Game !';
        player1.draws++;
        computer.draws++;

        toggleHidden(playAgainAI);
    };

    return {
        player1,
        computer,
        playAI,
        end,
        endDraw,
    };
})();
