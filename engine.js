// Screen Size
var WIDTH;
var HEIGHT;

var gx = 0;
var gy = 0;

var world_width = 10000;
var world_height = 10000;

// Resources
Resource = {
	Image: {
		heart: new Image(),
		samantha: new Image(),
		empty_heart: new Image(),
		insulin: new Image(),
		fastfood: new Image(),
		vampire: new Image(),
		
		alphabet: new Image(),
	},
}

Resource.Image.samantha.src = 'Images/Samantha.png';
Resource.Image.heart.src = 'Images/Heart.gif';
Resource.Image.empty_heart.src = 'Images/EmptyHeart.gif';
Resource.Image.insulin.src = 'Images/Insulin.gif';
Resource.Image.fastfood.src = 'Images/fastfood.gif';
Resource.Image.vampire.src = 'Images/vampire.png';

Resource.Image.alphabet.src = 'Images/alphabet.png';


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
	
	this.cGrid = new CollisionGrid(world_width, world_height, 32);
	
	this.player = new Player(this.cGrid);
	this.cGrid.add(this.player);
	
	this.vampires = [];
	
	this.glucose_pickups = [];
	
	this.insulin_pickups = [];
	
	for (var i = 0; i < 500; i++) {
		this.vampires.push(new Vampire(Math.random()*(world_width-30), Math.random()*(world_height-30), this.cGrid, Math.random() * 2, Math.random() * 2));
		this.cGrid.add(this.vampires[i]);
	}
	for (var i = 0; i < 500; i++) {
		this.glucose_pickups.push(new GlucosePickup(Math.random()*(world_width-10), Math.random()*(world_height-10)));
		this.cGrid.add(this.glucose_pickups[i]);
	}
	for (var i = 0; i < 500; i++) {
		this.insulin_pickups.push(new InsulinPickup(Math.random()*(world_width-10), Math.random()*(world_height-10)));
		this.cGrid.add(this.insulin_pickups[i]);
	}
	
	this.textbox = new Textbox();
}

Game.prototype = {
	update: function(elapsedTime) {
		self = this;
		if (this.player.health <= 0) {
			this.game_state = 'lost';
		}
		this.player.update(elapsedTime);
		
		
		for (var i = 0; i < this.vampires.length; i++) {
			this.vampires[i].update(elapsedTime);
			var v = this.vampires[i];
			v.cells.forEach( function(cell, index, arr) {
				var stepper = cell.first.next;
				while(stepper != 0)
				{
					if(stepper.data === self.player && self.player.bb.touching(v.bb))
					{
						self.player.health -= 1;
						self.player.glucose -= v.glucose_amount;
						self.vampires.splice(i, 1);
						self.cGrid.remove(v);
						return;
					}
					stepper = stepper.next;
				}
			})
			for (var j = 0; j < v.bullets.length; j++) {
				var b = v.bullets[j];
				if (this.player.bb.touching(b.bb)) {
					this.player.health -= 1;
					v.bullets.splice(j, 1);
					j--;
				}
			}
		}
		
		for (var i = 0; i < this.glucose_pickups.length; i++) {
			
			var gp = this.glucose_pickups[i];
			gp.cells.forEach( function(cell, index, arr) {
				var stepper = cell.first.next;
				while(stepper != 0)
				{
					if(stepper.data === self.player && self.player.bb.touching(gp.bb))
					{
						self.player.latent_glucose += gp.glucose_amount;
						//this.player.health += gp.health_amount;
						self.player.fed += gp.feed_amount;
						if (self.player.fed > self.player.fed_max) {
							self.player.fed = self.player.fed_max;
						}
				
						self.glucose_pickups.splice(i, 1);
						self.cGrid.remove(gp);
						return;
					}
					stepper = stepper.next;
				}
			})
			/*if (this.player.bb.touching(gp.bb)) {
				this.player.latent_glucose += gp.glucose_amount;
				//this.player.health += gp.health_amount;
				this.player.fed += gp.feed_amount;
				if (this.player.fed > this.player.fed_max) {
					this.player.fed = this.player.fed_max;
				}
				
				this.glucose_pickups.splice(i, 1);
				i--;
			}*/
		}
		
		for (var i = 0; i < this.insulin_pickups.length; i++) {
			
			var ip = this.insulin_pickups[i];
			ip.cells.forEach( function(cell, index, arr) {
				var stepper = cell.first.next;
				while(stepper != 0)
				{
					if(stepper.data === self.player && self.player.bb.touching(ip.bb))
					{
						self.player.syringes += 1;
				
						self.insulin_pickups.splice(i, 1);
						i--;
						return;
					}
					stepper = stepper.next;
				}
			})
			/*if (this.player.bb.touching(ip.bb)) {
				this.player.syringes += 1;
				
				this.insulin_pickups.splice(i, 1);
				i--;
			}*/
		}
	},
	
	render: function() {
		this.screenContext.clearRect(0, 0, WIDTH, HEIGHT);
		
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
		
		this.player.render(this.screenContext);
		
		this.textbox.write(this.screenContext, "this is some text!");
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
			this.screenContext.fillText('the vampires will gnaw your corpse forever.', 100, 210);
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