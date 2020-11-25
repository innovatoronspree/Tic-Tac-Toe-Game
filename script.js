//Basic Setup
//Determine winner
//Basic AI and winner notification
//Minimax algorithm

var board; //array keeps track of what is there in cells
const humanPlayer = 'O';
const aiPlayer = 'X';
const winningComb = [
[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]
];

//cells wills store reference to all cells in the table, cells is kind of an array
const cells = document.querySelectorAll('.cell');

initiateGame(); //function to start the game, also pressing replay calls this function, to set everything to default

function initiateGame(){
	//when we wish to replay, the endgame would be set to display visible, we again need to set it to none

	document.querySelector(".endgame").style.display = "none"; 
	//way to initialize array board with every number from 0 to 9
	board = Array.from(Array(9).keys());
	//console.log(board);
	for(var i=0;i<cells.length;i++)
	{	
		//after ending game we need to clear all cells of Xs and 0s
		cells[i].innerText = '';
		//after winning game we would have highlighted the winning combination, so we clear the highlighted part
		cells[i].style.removeProperty('background-color');
		//event listener for onclick event
		cells[i].addEventListener('click',turnClick,false);
	}
}

function turnClick(square){
	//we also need to check if a square is already clicked it should be disabled
	//initially the board is {0..9} and with passage of game it is being converted into 0s and Xs
	if(typeof board[square.target.id] == 'number'){
		//logging id of whatever square is clicked
		//console.log(square.target.id);
		//we will call turn function and pass id of cell being clicked 
		turn(square.target.id,humanPlayer);
		//after human player takes a turn, AI will take a turn
		//before ai player takes turn, let us check if it is a tie and whole board is full
		if(!TieChecker()){
			//bestSpot() returns id of ai player
			turn(bestSpot(),aiPlayer);
		}
	}
	
}

function turn(squareId,player)
{
	//we will set that cell on board to player who took turn
	board[squareId] = player;
	//now we display the change
	document.getElementById(squareId).innerText = player;
	//after every turn we need to check if any player has won
	let gameWonOrNot = checkWinner(board,player); 
	//if true we call gameOver
	if(gameWonOrNot){
		gameOver(gameWonOrNot);
	}
}

function checkWinner(boardLocal,player)
{
	//plays store all places on the board that have been played 
	//reduce method will go through every element of the array and will return the accumulator
	//e is the element on the board or array we are going through and i is index
	//hence this reduce method finds all index the player has played in
	let plays = boardLocal.reduce((a,e,i) => (e === player) ? a.concat(i) : a,[]);
	let gameWonOrNot = null;

	//now we will check if our accumulator is a winning combination by matching it with all winning combination
	for(let [index,win] of winningComb.entries()) //we get the index of the win combination and the win combination
	{	
		//traversing the winning combination elements and check if indexes are matching our accumulator
		if(win.every(element => plays.indexOf(element) > -1)){
			//this gives the index at which the player won and which player has won
			gameWonOrNot = {index: index, player: player};
			break; //break from function
		}
	}
	return gameWonOrNot; //if no one wins it contains null else the index and the player
}

//Highlighting the winning combination and displaying the result 
function gameOver(gameWonOrNot){
	for(let index of winningComb[gameWonOrNot.index])
	{	
		//traversing winning combiation like [0,1,2] and highlighting it
		document.getElementById(index).style.backgroundColor = (gameWonOrNot.player == 
		humanPlayer) ? "green" : "yellow";
	}
	//making cells unclickable 
	for(var i=0;i<cells.length;i++)
	{
		cells[i].removeEventListener('click',turnClick,false);
	}
	//declaring winner
	declareWinner(gameWonOrNot.player == humanPlayer ? "You win!" : "You lose");
}

//method for declaring winner
function declareWinner(personWhoWon){
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = personWhoWon;
}

//tracking all empty squares
function emptySquares(){
	//returning all empty squares
	return board.filter(x => typeof x == 'number');
}
	
//bestSpot fucntion will return id for ai player
function bestSpot(){
	return minimax(board,aiPlayer).index;
}

//function for checking tie
function TieChecker()
{	
	//if no square is empty and no player has won
	if(emptySquares().length == 0)
	{	
		//traversing through the board
		for(var i=0;i<cells.length;i++)
		{	
			//changing background color
			cells[i].style.backgroundColor = "orange";
			// making the cells unclickable
			cells[i].removeEventListener('click',turnClick,false);
		}
		declareWinner("Tie Game!");
		return true;
	}
	return false;
}



/* 1. Return a value if a terminal state has been found (+10, 0 ,-10)
   2. Go through available spots
   3. Call the minimax function for each available spots on board
   4. evaluate returning values from method calls
   5. and return best value */
function minimax(newBoard,player){
	var availableSpots = emptySquares();
  // console.log("Hello");

	//1. check for terminal state 
	if(checkWinner(newBoard, humanPlayer))
	{
		//if '0' wins it is negative for ai player because we want it to win
		//else if 'X' i.e AI player wins it is +10
		return {score: -10};
	}
	else if(checkWinner(newBoard,aiPlayer))
	{
		return {score: 10};
	}
	else if(availableSpots.length === 0)
	{
		//tied game
		return {score: 0};
	}

	var moves = [];
	//2. Collecting score from each of the empty spots
	for(var i=0; i<availableSpots.length; i++)
	{
		var move = {};
		move.index = newBoard[availableSpots[i]];
		newBoard[availableSpots[i]] = player;

		if(player == aiPlayer){
			var result = minimax(newBoard, humanPlayer);
			move.score = result.score;
		}
		else
		{
			var result = minimax(newBoard,aiPlayer);
			move.score = result.score;
		}
		newBoard[availableSpots[i]] = move.index;
		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer)
	{
		var topScore = -100000;
		for(var i=0;i<moves.length;i++)
		{
			if(moves[i].score > topScore)
			{
				topScore = moves[i].score;
				bestMove = i;
			}
		}
	}
	else
	{
		var topScore = 100000;
		for(var i=0;i<moves.length;i++)
		{
			if(moves[i].score < topScore)
			{
				topScore = moves[i].score;
				bestMove = i;
			}
		}
	}
	return moves[bestMove];
}