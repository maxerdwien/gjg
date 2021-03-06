'use strict';
var Input = function(screen, window) {
	this.mousex = 0;
	this.mousey = 0;
	
	this.screen = screen;
	var self = this;
	window.onkeydown = function (e) { self.keyDown(e); };
	window.onkeyup = function (e) { self.keyUp(e); };
	this.screen.onmousemove = function(e) { self.mousemove(e); };
	this.screen.onmousedown = function(e) { self.mousedown(e); };
	this.screen.onmouseup = function(e) { self.mouseup(e); };
	//this.screen.ondblclick = function(e) { self.dblclick(e); };
	
	// disable context menu
	this.screen.oncontextmenu = function(e) { return false; };
	
	this.inputState = {
		up: false,
		down: false,
		left: false,
		right: false
	};
	this.mousescroll = false;
	
	this.sb = null;
}
Input.prototype = {	
	keyDown: function(e) {
		switch(e.keyCode) {
			case 65: // a
			case 37: // left
			case 97:
				this.inputState.left = true;
				this.inputState.right = false;
				e.preventDefault();
				break;
			case 87: // w
			case 38: // up
			case 101:
				this.inputState.up = true;
				this.inputState.down = false;
				e.preventDefault();
				break;
			case 68: // d
			case 39: // right
			case 99:
				this.inputState.right = true;
				this.inputState.left = false;
				e.preventDefault();
				break;
			case 83: // s
			case 40: // down
			case 98:
				this.inputState.down = true;
				this.inputState.up = false;
				e.preventDefault();
				break;
				
			case 16:
				if (game.game_state == 'normal') game.player.use_syringe();
				//console.log(game.player.bb.x, game.player.bb.y);
				break;
				
			case 32:
			case 13:
				if (game.game_state == 'normal') game.player.throw_syringe();
				e.preventDefault();
				break;
		}
		
		if (game.game_state == 'cutscene') {
			if (game.cutscene.count >= 50) {
				game.cutscene.count = game.cutscene.scene_lengths[game.cutscene.current_scene];
			}
		}
		
	},
	
	keyUp: function(e) {
		switch(e.keyCode) {
			case 65: // a
			case 37: // left
			case 97:
				this.inputState.left = false;
				e.preventDefault();
				break;
			case 87: // w
			case 38: // up
			case 101:
				this.inputState.up = false;
				e.preventDefault();
				break;
			case 68: // d
			case 39: // right
			case 99:
				this.inputState.right = false;
				e.preventDefault();
				break;
			case 83: // s
			case 40: // down
			case 98:
				this.inputState.down = false;
				e.preventDefault();
				break;
		}
		e.preventDefault();
	},
	
	mousemove: function(e) {
		//console.log(e.clientX);
	},
	
	mousedown: function(e) {

	},
	
	mouseup: function(e) {

	},
}










