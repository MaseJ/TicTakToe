// Variables 

// Board will keep track of used cells to test if game is over
var board;
let player = "X";
let comPlayer = "O";

// All possible win conditions
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// All cells on board
const cells = document.querySelectorAll(".cell");
startGame();

// Hide "endgame" text and reset all cell values
// Readd event listeners to each cell
function startGame(){
    document.querySelector(".endgame").style.visiblity = "visible";
    board = Array.from(Array(9).keys());
    for (var i = 0; i < cells.length; i++){
        cells[i].textContent = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

// Function added to each cell 
// Sqauare allows for access to id of cell clicked
function turnClick(square){
    // Check if cell id is a number
    if(typeof board[square.target.id] == 'number'){
        // Call turn and pass id of cell clicked and the player (you) variable
        turn(square.target.id, player);
        // Make sure there is not a tie
        if(!checkTie()){
            // Call turn for computer turn
            turn(bestSpot(), comPlayer);
        }
    }
}


function turn(squareId, player){
    board[squareId] = player;
    // Update display to show where we clicked
    document.getElementById(squareId).innerHTML = player;
    // Check if game has been won
    let gameWon = checkWin(board, player);
    // If so then game is over
    if(gameWon) gameOver(gameWon);
}


function checkWin(board, player){
    // Check for what cells have not played using reduce
    let plays = board.reduce((a,e,i) => (e === player) ? a.concat(i) : a, []);
    // gameWon is our returning variable (true/false)
    let gameWon = null;

    // Test our plays array (current spots being used)
    // against our win conditions array to see if there is a winner
    for(let [index, win] of winConditions.entries()){
        if(win.every(el => plays.indexOf(el) > -1)) {
            gameWon = {index: index, player: player};
            // If there is a winner we will break to speed up process
            break;
        }
    }
    // Return our variable (true or false)
    return gameWon
}

// Function to display and show winner
function gameOver(gameWon){
    // Highlight winning cells
    for(let index of winConditions[gameWon.index]){
        document.getElementById(index).style.backgroundColor = gameWon.player == player ? "blue" : "red";
    }

    // Remove clickability
    for(var i = 0; i < cells.length; i++){
        cells[i].removeEventListener("click", turnClick, false);
    }
    // Determine what player won and call function
    delcareWinner(gameWon.player == player ? "You Win" : "You lose");
}

// Show hidden winning text
function delcareWinner(who){
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

// Returns all available spots
// Cells being used will return 'number'
function emptySquares() {
	return board.filter(s => typeof s == 'number');
}

// AI to find best possible spot
// Using minimax
// Passing the board(Current cells being used)
// We will return the index that the minimax()
// function returns to declare what spot 
// the AI determined was best
function bestSpot() {
	return minimax(board, comPlayer).index;
}

function checkTie(){
    // If no cells are left and there is no winner
    // It is a tie
    if(emptySquares().length == 0) {
        for(var i = 0; i < cells.length; i++){
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener('click', turnClick, false);
        }
        delcareWinner("Tie Game!");
        return true;
    }
    return false;
}

// Minimax algoritmhm to determine best spot (recursion)
function minimax(newBoard, huPlayer) {
    
	var availSpots = emptySquares();

    // Check for win (terminal state)
    // Function will keep calling itself 
    // till this if/else block catches somthing
    // +10 is best spot
    // -10 not a good spot
    // 0 is all spots are used (tie)
	if (checkWin(newBoard, player)) {
		return {score: -10};
	} else if (checkWin(newBoard, comPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
    
    // Array to keep track of all possible solutions
	var moves = [];

    // Loop through all available spots
    // And test its score
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = huPlayer;

        // Will keep calling this function untill a terminal state is found
		if (huPlayer == comPlayer) {
			var result = minimax(newBoard, player);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, comPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
    // Check if AI is playing and 
    // if so choose best score
    // and lowest if human is playing
	if(huPlayer === comPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
            // If mulitple winning solutions
            // for AI, it will just pick the first one
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}
    // Returning best most for AI
	return moves[bestMove];
}