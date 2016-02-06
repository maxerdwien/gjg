// Screen Size
var WIDTH;
var HEIGHT;

var gx = 0;
var gy = 0;

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
	this.game_state = 'normal';
	
	this.input = new Input(this.screen, window);
	
	this.player = new Player();
	
	this.vampires = [];
	//this.vampires.push(new Vampire(200, 200));
	
	this.glucose_pickups = [];
	//for (var i = 0; i < 100; i++) {
	//	this.glucose_pickups.push(new GlucosePickup(100*i, 100));
	//}
	
	this.insulin_pickups = [];
	//for (var i = 0; i < 100; i++) {
	//	this.insulin_pickups.push(new InsulinPickup(100*i, 500));
	//}
	var x_max = 10000;
	var y_max = 10000;
	for (var i = 0; i < 500; i++) {
		this.vampires.push(new Vampire(Math.random()*x_max, Math.random()*y_max));
	}
	for (var i = 0; i < 500; i++) {
		this.glucose_pickups.push(new GlucosePickup(Math.random()*x_max, Math.random()*y_max));
	}
	for (var i = 0; i < 500; i++) {
		this.insulin_pickups.push(new InsulinPickup(Math.random()*x_max, Math.random()*y_max));
	}
}

Game.prototype = {
	update: function(elapsedTime) {
		if (this.player.health <= 0) {
			this.game_state = 'lost';
		}
		this.player.update(elapsedTime);
		
		for (var i = 0; i < this.vampires.length; i++) {
			this.vampires[i].update(elapsedTime);
			var v = this.vampires[i];
			var distance = (this.player.sidelength + v.sidelength)/2;
			if (Math.abs(v.x - this.player.x) <= distance && Math.abs(v.y - this.player.y) <= distance) {
				this.player.health -= 1;
				this.player.glucose -= v.glucose_amount;
				this.vampires.splice(i, 1);
				i--;
			}
		}
		
		for (var i = 0; i < this.glucose_pickups.length; i++) {
			
			var gp = this.glucose_pickups[i];
			var distance = (this.player.sidelength + gp.sidelength)/2;
			if (Math.abs(gp.x - this.player.x) <= distance && Math.abs(gp.y - this.player.y) <= distance) {
				this.player.latent_glucose += gp.glucose_amount;
				//this.player.health += gp.health_amount;
				this.player.fed += gp.feed_amount;
				if (this.player.fed > this.player.fed_max) {
					this.player.fed = this.player.fed_max;
				}
				
				this.glucose_pickups.splice(i, 1);
				i--;
			}
		}
		
		for (var i = 0; i < this.insulin_pickups.length; i++) {
			
			var ip = this.insulin_pickups[i];
			var distance = (this.player.sidelength + ip.sidelength)/2;
			if (Math.abs(ip.x - this.player.x) <= distance && Math.abs(ip.y - this.player.y) <= distance) {
				//this.player.glucose -= ip.insulin_amount;
				this.player.syringes += 1;
				
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
		
		if (this.game_state == 'normal') {
			self.update(elapsedTime);
			self.render();
		} else if (this.game_state == 'lost') {
			this.screenContext.fillStyle = 'black';
			this.screenContext.font = '50px Georgia';
			this.screenContext.fillText('you lost.', 100, 170);
			this.screenContext.font= '20px Georgia';
			this.screenContext.fillText('the vampires will knaw your corpse forever.', 100, 210);
		}
		
		window.requestAnimationFrame(
			function(time) {
				self.loop.call(self, time);
			}
		);
	},
}
var game = new Game();
game.start();