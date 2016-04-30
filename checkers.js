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

var whiteScore = 0; // # Pieces White has taken from Red
var redScore = 0; // # Pieces Red has taken from White

var pieceToRemove = 0;

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
			if(pieceToRemove != 0) {
				removePiece(pieceToRemove);
			}
		}
	});
});

function movePiece(piece, square) {
	updateBoard(piece.attr('id'), square.attr('id').charAt(1), square.attr('id').charAt(2));
	snapToMiddle(piece, square);
	updateCheckersUI();
}

function checkValidMove(piece, square) {
	currentRow = -1;
	currentCol = -1;

	pieceID = piece.attr('id');

	for(var r=0;r<board.length;r++) { // Get Current Row/Col
		for(var c=0;c<board[r].length;c++) {
			if(board[r][c] == pieceID) {
				currentRow = r;
				currentCol = c;
				break;
			}
		}
		if(currentRow != -1) { break; }
	}

	// Get New Row/Col
	newRow = parseInt(square.attr('id').charAt(1));
	newCol = parseInt(square.attr('id').charAt(2));

	console.log(currentRow+", "+currentCol+", "+newRow+", "+newCol);

	// Check If New Space Occupied
	if(board[newRow][newCol] != 0) {
		return false;
	}

	// Check If newRow and newCol withen board
	if(newRow<0 || newRow>7 || newCol<0 || newCol>7) {
		return false;
	}

	// Check If Can Move
	if(piece.hasClass('kingPiece')) { // Can move any direction
		return true;
	} else if(piece.hasClass('whitePiece')) { // Can move 1->8
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
	} else if(piece.hasClass('redPiece')) { // Can move 8->1
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

function removePiece(pieceID) {
	console.log("here");
	// Update Score
	if(pieceID.charAt(0) == "w") {
		redScore++;
	} else if(pieceID.charAt(0) == "r") {
		whiteScore++;
	}

	for(var r=0;r<board.length;r++) { // Remove all occurances of pieceID
		for(var c=0;c<board[r].length;c++) {
			if(board[r][c] == pieceID) {
				board[r][c] = 0;
			}
		}
	}

	$("#"+pieceID).remove();
}

function updateCheckersUI() {
	$("#whiteScore").val(whiteScore);
	$("#redScore").val(redScore);
}

function snapToMiddle(dragger, target){
	var topMove = target.position().top - dragger.data('position').top + (target.outerHeight(true) - dragger.outerHeight(true)) / 2;
	var leftMove= target.position().left - dragger.data('position').left + (target.outerWidth(true) - dragger.outerWidth(true)) / 2;
	dragger.animate({top:topMove,left:leftMove},{duration:400,easing:'easeOutBack'});
}