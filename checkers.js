/*
@Harris Christiansen (Harris@HarrisChristiansen.com)
@Mehak Vohra (watthemehak.com)
April 2016
Checkers - Javascript
*/

$(function() {
	$(".redPiece").draggable( {
		revert: "invalid",
        create: function(){$(this).data('position',$(this).position())},
	});
	$(".whitePiece").draggable( {
		revert: "invalid",
        create: function(){$(this).data('position',$(this).position())},
	});

	$(".blackSquare").droppable({
		activeClass: "blackSquare",
		drop: function( event, ui ) {
			snapToMiddle(ui.draggable,$(this));
		}
	});
});

function snapToMiddle(dragger, target){
    var topMove = target.position().top - dragger.data('position').top + (target.outerHeight(true) - dragger.outerHeight(true)) / 2;
    var leftMove= target.position().left - dragger.data('position').left + (target.outerWidth(true) - dragger.outerWidth(true)) / 2;
    dragger.animate({top:topMove,left:leftMove},{duration:600,easing:'easeOutBack'});
}