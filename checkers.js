/*
@Harris Christiansen (Harris@HarrisChristiansen.com)
@Mehak Vohra (watthemehak.com)
April 2016
Checkers - Javascript
*/

var board = [
[0,1,0,1,0,1,0,1],
[1,0,1,0,1,0,1,0],
[0,1,0,1,0,1,0,1],
[0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0],
[2,0,2,0,2,0,2,0],
[0,2,0,2,0,2,0,2],
[2,0,2,0,2,0,2,0],
];

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

	$(".blackSquare").droppable({
		activeClass: "blackSquare",
		drop: function( event, ui ) {
			movePiece(ui.draggable,$(this));
		}
	});
});

function movePiece(piece, square) {
	checkValidMove(piece, square);
	snapToMiddle(piece, square);
}

function checkValidMove(piece, square) {

}

function snapToMiddle(dragger, target){
	var topMove = target.position().top - dragger.data('position').top + (target.outerHeight(true) - dragger.outerHeight(true)) / 2;
	var leftMove= target.position().left - dragger.data('position').left + (target.outerWidth(true) - dragger.outerWidth(true)) / 2;
	dragger.animate({top:topMove,left:leftMove},{duration:400,easing:'easeOutBack'});
}