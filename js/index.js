var board;
let player = "X";
let comPlayer = "O";
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

const cells = document.querySelectorAll(".cell");
startGame();

function startGame(){
    document.querySelector(".endgame").style.visiblity = "visible";
    board = Array.from(Array(9).keys());
    for (var i = 0; i < cells.length; i++){
        cells[i].textContent = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square){
    if(typeof board[square.target.id] == 'number'){
        turn(square.target.id, player);
        if(!checkTie()){
            turn(bestSpot(), comPlayer);
        }
    }
}

function turn(squareId, player){
    board[squareId] = player;
    document.getElementById(squareId).innerHTML = player;
    let gameWon = checkWin(board, player);
    if(gameWon) gameOver(gameWon);
}

function checkWin(board, player){
    let plays = board.reduce((a,e,i) => (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for(let [index, win] of winConditions.entries()){
        if(win.every(el => plays.indexOf(el) > -1)) {
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon
}

function gameOver(gameWon){
    for(let index of winConditions[gameWon.index]){
        document.getElementById(index).style.backgroundColor = gameWon.player == player ? "blue" : "red";
    }

    for(var i = 0; i < cells.length; i++){
        cells[i].removeEventListener("click", turnClick, false);
    }
    delcareWinner(gameWon.player == player ? "You Win" : "You lose");
}

function delcareWinner(who){
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
	return board.filter(s => typeof s == 'number');
}


function bestSpot() {
	return minimax(board, comPlayer).index;
}

function checkTie(){
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

function minimax(newBoard, huPlayer) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, player)) {
		return {score: -10};
	} else if (checkWin(newBoard, comPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = huPlayer;

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
	if(huPlayer === comPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
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

	return moves[bestMove];
}