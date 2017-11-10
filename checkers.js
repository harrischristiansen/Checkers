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

// =============== Process Move =============== //

function movePiece(piece, square) {
	updateBoard(piece.attr('id'), square.attr('id')[1], square.attr('id')[2]);
	updateTurnIfNecessary(piece);
	removePieceIfNecessary();
	promoteToKingIfNecessary(piece, square.attr('id')[1]);
	snapToMiddle(piece, square);
	updateCheckersUI();
	checkForWinner();
}

function updateBoard(pieceID, newRow, newCol) {
	removePieceFromBoard(pieceID);
	board[newRow][newCol] = pieceID;
}

function updateTurnIfNecessary(piece) {
	pieceID = piece.attr('id');
	if (pieceToRemove != 0) { // Jumped over piece, check if another jump available
		console.log("Checking if available jump");
		if (doesPieceHaveAvailableJump(pieceID)) {
			console.log("Jump available, dont update turn");
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

	removePieceFromBoard(pieceToRemove);
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
	if (pieceToRemove == pieceToRemoveTemp) {
		return false;
	}
	pieceToRemove = pieceToRemoveTemp;
	return validMove;
}

function checkValidMove(piece, square) {
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
	if (pieceID[0] == "w" && currentTurn != 0) {
		return false;
	} else if (pieceID[0] == "r" && currentTurn != 1) {
		return false;
	}

	// Get current row/col of piece being moved
	var position = getPiecePosition(pieceID);

	// Get new row/col
	newRow = parseInt(square.attr('id')[1]);
	newCol = parseInt(square.attr('id')[2]);

	// Check if newRow and newCol within board
	if (newRow<0 || newRow>7 || newCol<0 || newCol>7) {
		return false;
	}
	
	// Check if new space occupied
	if (board[newRow][newCol] != 0) {
		return false;
	}

	// Move Max 2 Spaces
	if (Math.abs(position.col-newCol) > 2) {
		return false;
	}

	// Check If Can Move
	if (piece.hasClass('kingPiece')) { // Can move any direction
		if (Math.abs(newRow-position.row) == 2) {
			pieceToRemove = board[(newRow+position.row)/2][(newCol+position.col)/2];
			if(pieceToRemove == 0 || pieceToRemove[0] == pieceID[0]) {
				pieceToRemove = 0;
				return false;
			}
			return true;
		} else if (Math.abs(newRow-position.row) == 1) {
			pieceToRemove = 0;
			if(pieceToRemove[0] == pieceID[0]) {
				pieceToRemove = 0;
				return false;
			}
			return true;
		}
	} else if (piece.hasClass('whitePiece')) { // Can move 0->7
		if (newRow-position.row == 2) {
			pieceToRemove = board[(newRow+position.row)/2][(newCol+position.col)/2];
			if(pieceToRemove == 0 || pieceToRemove[0] == pieceID[0]) {
				pieceToRemove = 0;
				return false;
			}
			return true;
		} else if (newRow-position.row==1) {
			pieceToRemove = 0;
			if (pieceToRemove[0] == pieceID[0]) {
				pieceToRemove = 0;
				return false;
			}
			return true;
		}
	} else if (piece.hasClass('redPiece')) { // Can move 7->0
		if (position.row-newRow == 2) {
			pieceToRemove = board[(newRow+position.row)/2][(newCol+position.col)/2];
			if (pieceToRemove == 0 || pieceToRemove[0] == pieceID[0]) {
				pieceToRemove = 0;
				return false;
			}
			return true;
		} else if (position.row-newRow == 1) {
			pieceToRemove = 0;
			return true;
		}
	} else {
		return false;
	}

	return false;
}

// =============== HTML Element Manipulation =============== //

function getSquare(row, col) {
	return $('#_'+row+col);
}

function getPieceByID(pieceID) {
	return $('#'+pieceID);
}

// =============== Board State Updates/Validation =============== //

function getPiecePosition(pieceID) {
	row = -1;
	col = -1;
	
	for (var r = 0; r < board.length; r++) {
		for (var c = 0; c < board[r].length; c++) {
			if (board[r][c] == pieceID) {
				row = r;
				col = c;
				break;
			}
		}
		if (row != -1) { break; }
	}
	
	return {
        row: row,
        col: col
    };
}

function getPieceTargetRows(pieceID, includeSingle=true, includeDouble=true) {
	var piece = getPieceByID(pieceID);
	var position = getPiecePosition(pieceID);
	var targetRows = [];
	
	if (includeDouble && position.row > 1 && (piece.hasClass('kingPiece') || piece.hasClass('redPiece'))) { // Can move 7->0
		targetRows.push(position.row - 2);
	}
	if (includeSingle && position.row > 0 && (piece.hasClass('kingPiece') || piece.hasClass('redPiece'))) { // Can move 7->0
		targetRows.push(position.row - 1);
	}
	if (includeSingle && position.row < 7 && (piece.hasClass('kingPiece') || piece.hasClass('whitePiece'))) { // Can move 0->7
		targetRows.push(position.row + 1);
	}
	if (includeDouble && position.row < 6 && (piece.hasClass('kingPiece') || piece.hasClass('whitePiece'))) { // Can move 0->7
		targetRows.push(position.row + 2);
	}
	
	return targetRows;
}

function getPieceTargetCols(pieceID, includeSingle=true, includeDouble=true) {
	var position = getPiecePosition(pieceID);
	var targetCols = [];
	
	if (includeDouble && position.col > 1) {
		targetCols.push(position.col - 2);
	}
	if (includeSingle && position.col > 0) {
		targetCols.push(position.col - 1);
	}
	if (includeSingle && position.col < 7) {
		targetCols.push(position.col + 1);
	}
	if (includeDouble && position.col < 6) {
		targetCols.push(position.col + 2);
	}
	
	return targetCols;
}

function removePieceFromBoard(pieceID) {
	for (var r=0; r<board.length; r++) { // Remove all occurances of pieceID
		for (var c=0; c<board[r].length; c++) {
			if (board[r][c] == pieceID) {
				board[r][c] = 0;
			}
		}
	}
}

function doesPieceHaveAvailableJump(pieceID) {
	var piece = getPieceByID(pieceID);
	var position = getPiecePosition(pieceID);
	
	var targetRows = getPieceTargetRows(pieceID, includeSingle=false);
	var targetCols = getPieceTargetCols(pieceID, includeSingle=false);
	
	for (var r in targetRows) {
		for (var c in targetCols) {
			target = getSquare(targetRows[r], targetCols[c]);
			if (checkValidMoveKeepPieceToRemove(piece, target)) {
				return true;
			}
		}
	}
	return false;
}