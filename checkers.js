/*
@Harris Christiansen (Harris@HarrisChristiansen.com)
@Mehak Vohra (watthemehak.com)
April 2016
Checkers - Javascript
*/

var board = [
[0,"w1",0,"w2",0,"w3",0,"w4"],
["w5",0,"w6",0,"w7",0,"w8",0],
[0,"w9",0,"w10",0,"w11",0,"w12"],
[0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0],
["r1",0,"r2",0,"r3",0,"r4",0],
[0,"r5",0,"r6",0,"r7",0,"r8"],
["r9",0,"r10",0,"r11",0,"r12",0],
];

var checkersStartHTML = $("#checkersTable").innerHTML;

var whiteScore = 0; // # Pieces White has taken from Red
var redScore = 0; // # Pieces Red has taken from White
var winnerString = ""; // Winning Color to display in UI

var pieceToRemove = 0;

var currentTurn = 0; // 0=White, 1=Red

$(function() {
	$(".redPiece").draggable( {
		revert: "invalid",
		create: function(){$(this).data('position',$(this).position())},
		cursor: "move",
	});
	$(".whitePiece").draggable( {
		revert: "invalid",
		create: function(){$(this).data('position',$(this).position())},
		cursor: "move",
	});

	$(".moveableSquare").droppable({
		accept: function(dropElem) {
			pieceToRemove = 0;
			return checkValidMove(dropElem,$(this));
		},
		drop: function(event, ui) {
			movePiece(ui.draggable,$(this));
		}
	});
});

function movePiece(piece, square) {
	updateBoard(piece.attr('id'), square.attr('id')[1], square.attr('id')[2]);
	updateTurnIfNecessary(piece, square.attr('id')[1], square.attr('id')[2]);
	removePieceIfNecessary();
	promoteToKingIfNecessary(piece, square.attr('id')[1]);
	snapToMiddle(piece, square);
	updateCheckersUI();
	checkForWinner();
}

function updateBoard(pieceID, newRow, newCol) {
	for(var r=0;r<board.length;r++) { // Remove all occurances of pieceID
		for(var c=0;c<board[r].length;c++) {
			if(board[r][c] == pieceID) {
				board[r][c] = 0;
			}
		}
	}

	board[newRow][newCol] = pieceID;
}

function updateTurnIfNecessary(piece, newRow, newCol) {
	if (pieceToRemove != 0) { // Jumped over piece, check if another jump available
		if (newRow <= 1 || newRow >= 6) { // Check outer board boundry
			return false;
		}
		
		var targetRow = -1;
		var targetCol = [parseInt(newCol)-2, parseInt(newCol)+2];
		
		if (currentTurn == 0) { // Whites turn, moving toward 7
			targetRow = newRow + 2;
		} else if (currentTurn == 1) { // Blacks turn, moving toward 0
			targetRow = newRow - 2;
		}
		// TODO: targetRow->array for king
		
		var targetSquare1, targetSquare2;
		if (targetRow>=0 && targetRow<8) { // Target withen inner board
			console.log("1: "+targetCol[0]);
			if (targetCol[0]>=0 && targetCol[0]<8) {
				console.log("2");
				targetSquare1 = getSquare(targetRow, targetCol[0]);
			}
			console.log("3: "+targetCol[1]);
			if (targetCol[1]>=0 && targetCol[1]<8) {
				console.log("4");
				targetSquare2 = getSquare(targetRow, targetCol[1]);
			}
		}
		
		console.log("targetSquare2: ("+newRow+","+newCol+") ("+piece+","+targetSquare2+") "+checkValidMoveKeepPieceToRemove(piece, targetSquare2));
		
		if (checkValidMoveKeepPieceToRemove(piece, targetSquare1) || checkValidMoveKeepPieceToRemove(piece, targetSquare2)) {
			return false;
		}
	}
	
	currentTurn = !currentTurn;
}

function removePieceIfNecessary() {
	if(pieceToRemove == 0) { return false; }

	// Update Score
	if(pieceToRemove.charAt(0) == "w") {
		redScore = redScore + 1;
	} else if(pieceToRemove.charAt(0) == "r") {
		whiteScore = whiteScore + 1;
	}

	for(var r=0;r<board.length;r++) { // Remove all occurances of pieceToRemove
		for(var c=0;c<board[r].length;c++) {
			if(board[r][c] == pieceToRemove) {
				board[r][c] = 0;
			}
		}
	}

	$("#"+pieceToRemove).remove();
}

function promoteToKingIfNecessary(piece, newRow) {
	if (newRow==0 || newRow==7) {
		piece.addClass("kingPiece");
	}
}

function snapToMiddle(dragger, target){
	var topMove = target.position().top - dragger.data('position').top + (target.outerHeight(true) - dragger.outerHeight(true)) / 2;
	var leftMove= target.position().left - dragger.data('position').left + (target.outerWidth(true) - dragger.outerWidth(true)) / 2;
	dragger.animate({top:topMove,left:leftMove},{duration:400,easing:'easeOutBack'});
}

function updateCheckersUI() {
	if(currentTurn == 0) {
		$("#currentTurn").text("White");
		$("#currentTurn").css("color", "white");
	} else if(currentTurn == 1) {
		$("#currentTurn").text("Black");
		$("#currentTurn").css("color", "#8C8C8C");
	}
	
	$("#whiteScore").text(whiteScore);
	$("#redScore").text(redScore);
	
	$("#winner").text(winnerString);
	if (winnerString == "") {
		$(".gameover").hide();
	}
}

function checkForWinner() {
	if (whiteScore == 12) {
		winnerString = "Winner: White";
		$("#winner").text(winnerString);
		$(".gameover").fadeIn();
		alert("White Won!");
		
	} else if (redScore == 12) {
		winnerString = "Winner: Black";
		$("#winner").text(winnerString);
		$(".gameover").fadeIn();
		alert("Black Won!");
	}
}

function startOver() {
	board = [
		[0,"w1",0,"w2",0,"w3",0,"w4"],
		["w5",0,"w6",0,"w7",0,"w8",0],
		[0,"w9",0,"w10",0,"w11",0,"w12"],
		[0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0],
		["r1",0,"r2",0,"r3",0,"r4",0],
		[0,"r5",0,"r6",0,"r7",0,"r8"],
		["r9",0,"r10",0,"r11",0,"r12",0],
		];
		
	$("#checkersTable").innerHTML = checkersStartHTML;
		
	whiteScore = 0;
	redScore = 0;
	winnerString = "";
	pieceToRemove = 0
	currentTurn = 0;
}

function checkValidMoveKeepPieceToRemove(piece, square) {
	var pieceToRemoveTemp = pieceToRemove;
	var validMove = checkValidMove(piece, square);
	pieceToRemove = pieceToRemoveTemp;
	return validMove;
}

function checkValidMove(piece, square) {
	currentRow = -1;
	currentCol = -1;

	pieceID = piece.attr('id');
	
	// No Piece or Target Square
	if (!piece || !square) {
		return false;
	}
	
	// Game Over
	if (winnerString != "") {
		return false;
	}

	 // Wrong Color Turn
	if(pieceID[0] == "w" && currentTurn != 0) {
		return false;
	} else if(pieceID[0] == "r" && currentTurn != 1) {
		return false;
	}

	// Get current row/col of piece being moved
	for(var r=0;r<board.length;r++) {
		for(var c=0;c<board[r].length;c++) {
			if(board[r][c] == pieceID) {
				currentRow = r;
				currentCol = c;
				break;
			}
		}
		if(currentRow != -1) { break; }
	}

	// Get new row/col
	newRow = parseInt(square.attr('id')[1]);
	newCol = parseInt(square.attr('id')[2]);

	// Check if newRow and newCol within board
	if(newRow<0 || newRow>7 || newCol<0 || newCol>7) {
		return false;
	}
	
	// Check if new space occupied
	if(board[newRow][newCol] != 0) {
		return false;
	}

	// Move Max 2 Spaces
	if(Math.abs(currentCol-newCol) > 2) {
		return false;
	}

	// Check If Can Move
	if(piece.hasClass('kingPiece')) { // Can move any direction
		if(Math.abs(newRow-currentRow)==2) {
			pieceToRemove = board[(newRow+currentRow)/2][(newCol+currentCol)/2];
			if(pieceToRemove == 0 || pieceToRemove[0] == pieceID[0]) {
				pieceToRemove = 0;
				return false;
			}
			return true;
		} else if(Math.abs(newRow-currentRow)==1) {
			pieceToRemove = 0;
			if(pieceToRemove[0] == pieceID[0]) {
				pieceToRemove = 0;
				return false;
			}
			return true;
		}
	} else if(piece.hasClass('whitePiece')) { // Can move 0->7
		if(newRow-currentRow==2) {
			pieceToRemove = board[(newRow+currentRow)/2][(newCol+currentCol)/2];
			if(pieceToRemove == 0 || pieceToRemove[0] == pieceID[0]) {
				pieceToRemove = 0;
				return false;
			}
			return true;
		} else if(newRow-currentRow==1) {
			pieceToRemove = 0;
			if(pieceToRemove[0] == pieceID[0]) {
				pieceToRemove = 0;
				return false;
			}
			return true;
		}
	} else if(piece.hasClass('redPiece')) { // Can move 7->0
		if(currentRow-newRow==2) {
			pieceToRemove = board[(newRow+currentRow)/2][(newCol+currentCol)/2];
			if(pieceToRemove == 0 || pieceToRemove[0] == pieceID[0]) {
				pieceToRemove = 0;
				return false;
			}
			return true;
		} else if(currentRow-newRow==1) {
			pieceToRemove = 0;
			return true;
		}
	} else {
		return false;
	}

	return false;
}

function getSquare(row, col) {
	//return $('#checkersTable tr:eq('+row+') td:eq('+col+')');
	var square = $('_'+row+col);
	console.log("Square: "+square);
	return square;
}