// Screen Size
var WIDTH;
var HEIGHT;

var Game = function() {
	var self = this;
	
	// Rendering variables
	this.screen = document.getElementById('screen');
	this.screenContext = this.screen.getContext('2d');
	this.backBuffer = document.createElement('canvas');
	this.backBuffer.width = this.screen.width;
	this.backBuffer.height = this.screen.height;
	this.backBufferContext = this.backBuffer.getContext('2d');
	
	//this.input = new Input(this.screen, window);
	
	WIDTH = this.screen.width;
	HEIGHT = this.screen.height;
	
	// Game variables
	
}

Game.prototype = {
	update: function(elapsedTime) {

	},
	
	render: function() {
		this.screenContext.clearRect(0, 0, WIDTH, HEIGHT);
	},
	
	start: function() {
		var self = this;
		
		// Timing variables
		this.lastTime = 0;
		
		window.requestAnimationFrame(
			function(time) {
				self.loop.call(self, time);
			}
		);
	},
	
	loop: function(time) {
		var self = this;
		
		var elapsedTime = (time - this.lastTime);
		this.lastTime = time;
		
		self.update(elapsedTime);
		self.render();
		
		window.requestAnimationFrame(
			function(time) {
				self.loop.call(self, time);
			}
		);
	}
}
var game = new Game();
game.start();