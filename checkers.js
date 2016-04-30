/*
@Harris Christiansen (Harris@HarrisChristiansen.com)
@Mehak Vohra (watthemehak.com)
April 2016
Checkers - Javascript
*/

$(function() {
	$(".redPiece").draggable({ revert: "invalid" });
	$(".whitePiece").draggable({ revert: "invalid" });

	$(".blackSquare").droppable({
		activeClass: "blackSquare",
		drop: function( event, ui ) {
			$(this)
			.addClass( "ui-state-highlight" )
			.find( "p" )
			.html( "Dropped!" );
		}
	});
});