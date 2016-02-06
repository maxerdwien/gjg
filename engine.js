// Screen Size
var WIDTH;
var HEIGHT;

// Resources
Resource = {
	Image: {
		heart: new Image(),
	},
}

Resource.Image.heart.src = "Images/Heart.gif";

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
	
	this.vampires = [];
	this.vampires.push(new Vampire(200, 200));
	
	this.glucose_pickups = [];
	for (var i = 0; i < 100; i++) {
		this.glucose_pickups.push(new GlucosePickup(100*i, 100));
	}
	
	this.insulin_pickups = [];
	for (var i = 0; i < 100; i++) {
		this.insulin_pickups.push(new InsulinPickup(100*i, 500));
	}
}

Game.prototype = {
	update: function(elapsedTime) {
		this.player.update(elapsedTime);
		
		for (var i = 0; i < this.vampires.length; i++) {
			this.vampires[i].update(elapsedTime);
			var v = this.vampires[i];
			var distance = (this.player.sidelength + v.sidelength)/2;
			if (Math.abs(v.x - this.player.x) <= distance && Math.abs(v.y - this.player.y) <= distance) {
				this.player.health -= 1;
				
				this.vampires.splice(i, 1);
				i--;
			}
		}
		
		
		for (var i = 0; i < this.glucose_pickups.length; i++) {
			
			var gp = this.glucose_pickups[i];
			var distance = (this.player.sidelength + gp.sidelength)/2;
			if (Math.abs(gp.x - this.player.x) <= distance && Math.abs(gp.y - this.player.y) <= distance) {
				this.player.glucose += gp.glucose_amount;
				this.player.health += gp.health_amount;
				
				this.glucose_pickups.splice(i, 1);
				i--;
			}
		}
		
		for (var i = 0; i < this.insulin_pickups.length; i++) {
			
			var ip = this.insulin_pickups[i];
			var distance = (this.player.sidelength + ip.sidelength)/2;
			if (Math.abs(ip.x - this.player.x) <= distance && Math.abs(ip.y - this.player.y) <= distance) {
				this.player.glucose -= ip.insulin_amount;
				
				this.insulin_pickups.splice(i, 1);
				i--;
			}
		}
	},
	
	render: function() {
		this.screenContext.clearRect(0, 0, WIDTH, HEIGHT);
		
		
		
		for (var i = 0; i < this.glucose_pickups.length; i++) {
			this.glucose_pickups[i].render(this.screenContext);
		}
		
		for (var i = 0; i < this.insulin_pickups.length; i++) {
			this.insulin_pickups[i].render(this.screenContext);
		}
		
		for (var i = 0; i < this.vampires.length; i++) {
			this.vampires[i].render(this.screenContext);
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
	},
}
var game = new Game();
game.start();