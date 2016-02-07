// Screen Size
var WIDTH;
var HEIGHT;

var gx = 0;
var gy = 0;

var world_width = 2000;
var world_height = 2000;

// Resources
Resource = {
	Image: {
		heart: new Image(),
		samantha: new Image(),
		empty_heart: new Image(),
		insulin_diag: new Image(),
		insulin_straight: new Image(),
		fastfood: new Image(),
		vampire: new Image(),
		mspritesheet: new Image(),
		cardoor: new Image(),
		alphabet: new Image(),
		
		car_door: new Image(),
	},
}

Resource.Image.samantha.src = 'Images/Samantha.png';
Resource.Image.heart.src = 'Images/Heart.gif';
Resource.Image.empty_heart.src = 'Images/EmptyHeart.gif';
Resource.Image.insulin_diag.src = 'Images/insulin-diag.png';
Resource.Image.insulin_straight.src = 'Images/insulin-straight.png';
Resource.Image.fastfood.src = 'Images/fastfood.gif';
Resource.Image.vampire.src = 'Images/vampire.png';

Resource.Image.alphabet.src = 'Images/alphabet.png';

Resource.Image.car_door.src = 'Images/cardoor.png';


var Game = function() {
	var self = this;
	
	// Rendering variables
	this.screen = document.getElementById('screen');
	this.screenContext = this.screen.getContext('2d');
	this.backBuffer = document.createElement('canvas');
	this.backBuffer.width = this.screen.width;
	this.backBuffer.height = this.screen.height;
	this.backBufferContext = this.backBuffer.getContext('2d');
	this.tilemap = new TileManager();
	
	//this.input = new Input(this.screen, window);
	
	WIDTH = this.screen.width;
	HEIGHT = this.screen.height;
	
	
	// Game variables
	this.game_state = 'normal';
	
	this.input = new Input(this.screen, window);
	
	this.cGrid = new CollisionGrid(world_width, world_height, 32);
	
	this.player = new Player(this.cGrid);
	this.cGrid.add(this.player);
	
	this.vampires = [];
	
	this.glucose_pickups = [];
	
	this.insulin_pickups = [];
	
	this.carparts = [];
	
	for (var i = 0; i < 20; i++) {
		this.vampires.push(new Vampire(Math.random()*(world_width-30), Math.random()*(world_height-30), this.cGrid, Math.random() * 2, Math.random() * 2));
		this.cGrid.add(this.vampires[i]);
	}
	for (var i = 0; i < 50; i++) {
		this.glucose_pickups.push(new GlucosePickup(Math.random()*(world_width-10), Math.random()*(world_height-10)));
		this.cGrid.add(this.glucose_pickups[i]);
	}
	for (var i = 0; i < 50; i++) {
		this.insulin_pickups.push(new InsulinPickup(Math.random()*(world_width-10), Math.random()*(world_height-10)));
		this.cGrid.add(this.insulin_pickups[i]);
	}
	
	var newcar = new CarPart(Math.random()*(world_width-10), Math.random()*(world_height-10), 'car door', Resource.Image.car_door);
	this.carparts.push(newcar);
	this.cGrid.add(newcar);
	
	var newcar = new CarPart(Math.random()*(world_width-10), Math.random()*(world_height-10), 'wheel', Resource.Image.car_door);
	this.carparts.push(newcar);
	this.cGrid.add(newcar);
	
	var newcar = new CarPart(Math.random()*(world_width-10), Math.random()*(world_height-10), 'engine', Resource.Image.car_door);
	this.carparts.push(newcar);
	this.cGrid.add(newcar);
	
	var newcar = new CarPart(Math.random()*(world_width-10), Math.random()*(world_height-10), 'key', Resource.Image.car_door);
	this.carparts.push(newcar);
	this.cGrid.add(newcar);
	
	this.textbox = new Textbox();
	
	this.do_darken = true;
	
	this.car_parts_found = 0;
}

Game.prototype = {
	update: function(elapsedTime) {
		self = this;
		if (this.player.health <= 0) {
			this.game_state = 'lost';
		}
		this.player.update(elapsedTime);
		
		for (var i = 0; i < this.carparts.length; i++) {
			this.carparts[i].update(elapsedTime);
			if (this.carparts[i].bb.touching(this.player.bb) && !this.carparts[i].picked_up) {
				this.carparts[i].picked_up = true;
				this.car_parts_found++;
				if (this.car_parts_found == 4) {
					this.game_state = 'won';
				}
				break;
			}
		}
		
		for (var i = 0; i < this.vampires.length; i++) {
			this.vampires[i].update(elapsedTime);
			var v = this.vampires[i];
			
			if (this.player.bb.touching(v.bb)) {
				this.player.health--;
				this.player.glucose -= this.vampires[i].glucose_amount;
				this.vampires.splice(i, 1);
			}
			for (var j = 0; j < v.bullets.length; j++) {
				var b = v.bullets[j];
				if (this.player.bb.touching(b.bb)) {
					this.player.health -= 1;
					v.bullets.splice(j, 1);
					j--;
				}
			}
			
			for (var j = 0; j < this.player.needles.length; j++) {
				if (this.player.needles[j].bb.touching(v.bb)) {
					this.vampires.splice(i, 1);
					i--;
					this.player.needles.splice(j, 1);
					break;
				}
			}
		}
		
		for (var i = 0; i < this.glucose_pickups.length; i++) {
			
			var gp = this.glucose_pickups[i];
			
			if (this.player.bb.touching(gp.bb)) {
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
			if (this.player.bb.touching(ip.bb)) {
				this.player.syringes += 1;
				
				this.insulin_pickups.splice(i, 1);
				i--;
			}
		}
	},
	
	render: function() {
		this.screenContext.clearRect(0, 0, WIDTH, HEIGHT);
		
		this.tilemap.render(this.screenContext);
		this.cGrid.render();
		
		for (var i = 0; i < this.glucose_pickups.length; i++) {
			this.glucose_pickups[i].render(this.screenContext);
		}
		
		for (var i = 0; i < this.insulin_pickups.length; i++) {
			this.insulin_pickups[i].render(this.screenContext);
		}
		
		for (var i = 0; i < this.vampires.length; i++) {
			this.vampires[i].render(this.screenContext);
		}
		
		for (var i = 0; i < this.carparts.length; i++) {
			this.carparts[i].render(this.screenContext);
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
			
			if (this.do_darken) {
				this.screenContext.save();
				this.screenContext.beginPath();
				this.screenContext.rect(0, 0, WIDTH, HEIGHT);
				this.screenContext.fillStyle = '#000000';
				this.screenContext.globalAlpha = 0.5;
				this.screenContext.fill();
				this.screenContext.restore();
				this.do_darken = false;
			}
			this.textbox.write(this.screenContext, 'you lost.', 100, 170, 32);
			this.textbox.write(this.screenContext, 'the vampires will gnaw your corpse\nforever.', 100, 208, 24);
		} else if (this.game_state == 'won') {
			
			if (this.do_darken) {
				this.screenContext.save();
				this.screenContext.beginPath();
				this.screenContext.rect(0, 0, WIDTH, HEIGHT);
				this.screenContext.fillStyle = '#000000';
				this.screenContext.globalAlpha = 0.5;
				this.screenContext.fill();
				this.screenContext.restore();
				this.do_darken = false;
			}
			this.textbox.write(this.screenContext, 'you won!', 100, 170, 32);
			this.textbox.write(this.screenContext, 'the vampires will gnaw on their\nown fingers in frustration.', 100, 208, 24);
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