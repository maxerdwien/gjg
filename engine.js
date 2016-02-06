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
	
	this.input = new Input(this.screen, window);
	
	this.player = new Player();
	
	this.glucose_pickups = [];
	this.glucose_pickups.push(new GlucosePickup(100, 100));
}

Game.prototype = {
	update: function(elapsedTime) {
		this.player.update();
		
		
		for (var i = 0; i < this.glucose_pickups.length; i++) {
			
			var gp = this.glucose_pickups[i];
			var distance = this.player.sidelength + gp.sidelength;
			if (Math.abs(gp.x - this.player.x) <= distance && Math.abs(gp.y - this.player.y) <= distance) {
				this.player.glucose += gp.glucose_amount;
				this.player.health += gp.health_amount;
				
				this.glucose_pickups.splice(i, 1);
				i--;
			}
		}
	},
	
	render: function() {
		this.screenContext.clearRect(0, 0, WIDTH, HEIGHT);
		
		
		
		for (var i = 0; i < this.glucose_pickups.length; i++) {
			this.glucose_pickups[i].render(this.screenContext);
		}
		
		this.player.render(this.screenContext);
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