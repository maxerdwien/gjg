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
				this.inputState.left = true;
				this.inputState.right = false;
				break;
			case 87: // w
			case 38: // up
				this.inputState.up = true;
				this.inputState.down = false;
				break;
			case 68: // d
			case 39: // right
				this.inputState.right = true;
				this.inputState.left = false;
				break;
			case 83: // s
			case 40: // down
				this.inputState.down = true;
				this.inputState.up = false;
				break;
			
		}
	},
	
	keyUp: function(e) {
		switch(e.keyCode) {
			case 65: // a
			case 37: // left
				this.inputState.left = false;
				break;
			case 87: // w
			case 38: // up
				this.inputState.up = false;
				break;
			case 68: // d
			case 39: // right
				this.inputState.right = false;
				break;
			case 83: // s
			case 40: // down
				this.inputState.down = false;
				break;
		}
	},
	
	mousemove: function(e) {

	},
	
	mousedown: function(e) {

	},
	
	mouseup: function(e) {

	},
}










