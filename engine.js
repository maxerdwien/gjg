// Screen Size
var WIDTH;
var HEIGHT;

var gx = 0;
var gy = 0;

var world_width = 13312;
var world_height = 13312;

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
		
		alphabet: new Image(),
		
		car: new Image(),
		broken_car: new Image(),
		
		car_door: new Image(),
		key: new Image(),
		wheel: new Image(),
		engine: new Image(),
		
		steak: new Image(),
		
		forest: new Image(),
		cabin: new Image(),
		sawmill: new Image(),
		cabin_corners: new Image(),
		beach: new Image(),
		barn: new Image(),
		graveyard: new Image(),
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

Resource.Image.car.src = 'Images/car.png';
Resource.Image.broken_car.src = 'Images/broken_car.png';

Resource.Image.car_door.src = 'Images/cardoor.png';
Resource.Image.key.src = 'Images/key.png';
Resource.Image.wheel.src = 'Images/wheel.png';
Resource.Image.engine.src = 'Images/DehEnjin.png';

Resource.Image.steak.src = 'Images/steak.png';

Resource.Image.forest.src = 'Images/forestterrains.png';
Resource.Image.cabin.src = 'Images/cabin.png';
Resource.Image.sawmill.src = 'Images/saw mill.png';
Resource.Image.cabin_corners.src = 'Images/cabin corners.png';
Resource.Image.beach.src = 'Images/lifes a beach (2).png';
Resource.Image.barn.src = 'Images/Barn.png';
Resource.Image.graveyard.src = 'Images/graveyard 2.png';


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
	
	this.walls = this.tilemap.initwalls(this.cGrid);
	
	this.vampires = [];
	
	this.glucose_pickups = [];
	
	this.insulin_pickups = [];
	
	this.carparts = [];
	
	for (var i = 0; i < 100; i++) {
		this.vampires.push(new Vampire(Math.random()*(world_width-30), Math.random()*(world_height-30), this.cGrid, Math.random() * 2, Math.random() * 2));
		this.cGrid.add(this.vampires[i]);
	}
	for (var i = 0; i < 100; i++) {
		this.glucose_pickups.push(new GlucosePickup(Math.random()*(world_width-10), Math.random()*(world_height-10)));
		this.cGrid.add(this.glucose_pickups[i]);
	}
	for (var i = 0; i < 100; i++) {
		this.insulin_pickups.push(new InsulinPickup(Math.random()*(world_width-10), Math.random()*(world_height-10)));
		this.cGrid.add(this.insulin_pickups[i]);
	}
	var ip = new InsulinPickup(942, 9361);
	this.insulin_pickups.push(ip);
	this.cGrid.add(ip);
	var ip = new InsulinPickup(942, 9391);
	this.insulin_pickups.push(ip);
	this.cGrid.add(ip);
	var ip = new InsulinPickup(972, 9391);
	this.insulin_pickups.push(ip);
	this.cGrid.add(ip);
	var ip = new InsulinPickup(972, 9361);
	this.insulin_pickups.push(ip);
	this.cGrid.add(ip);
	
	// in the sawmill
	var newcar = new CarPart(9831, 1123, 'car door', Resource.Image.car_door);
	this.carparts.push(newcar);
	this.cGrid.add(newcar);
	
	// in the barn
	var newcar = new CarPart(10858, 10808, 'wheel', Resource.Image.wheel);
	this.carparts.push(newcar);
	this.cGrid.add(newcar);
	
	var newcar = new CarPart(2202, 10752, 'engine', Resource.Image.engine);
	this.carparts.push(newcar);
	this.cGrid.add(newcar);
	
	var newcar = new CarPart(1176, 1628, 'key', Resource.Image.key);
	this.carparts.push(newcar);
	this.cGrid.add(newcar);
	
	this.textbox = new Textbox();
	
	this.do_darken = true;
	
	this.car_parts_found = 0;
	
	this.text_triggers = [];
	
	this.text_triggers.push(new TextTrigger(6095, 7395.5, Resource.Image.broken_car, 2, 128));
	this.text_triggers.push(new TextTrigger(7471, 4602.5, Resource.Image.steak, 4, 64, true)); // steak
	
	this.cutscene = new Cutscene();
}

Game.prototype = {
	update: function(elapsedTime) {
		if (this.game_state == 'normal') {
			self = this;
			if (this.player.health <= 0) {
				this.game_state = 'lost';
			}
			this.player.update(elapsedTime);
		

			this.player.cells.forEach( function(cell, index, arr) {
				var stepper = cell.first.next;
				while(stepper != 0)
				{
					if(stepper.data instanceof Wall && self.player.bb.touching(stepper.data.bb))
					{
						self.player.bb.wallcollide(stepper.data);
					}
					stepper = stepper.next;
				}
			});

			for (var i = 0; i < this.text_triggers.length; i++) {
				if (!this.text_triggers[i].triggered && this.text_triggers[i].bb.touching(this.player.bb)) {
					this.text_triggers[i].triggered = true;
					
					this.game_state = 'cutscene';
					this.cutscene.current_scene = this.text_triggers[i].trigger_scene;
					if (this.text_triggers[i].heal) {
						this.player.health = 5;
						this.text_triggers.splice(i, 1);
					}
				}
			}
		
			for (var i = 0; i < this.carparts.length; i++) {
				this.carparts[i].update(elapsedTime);
				if (this.carparts[i].bb.touching(this.player.bb) && !this.carparts[i].picked_up) {
					this.carparts[i].picked_up = true;
					this.car_parts_found++;
					break;
				}
			}
			
			if (this.car_parts_found == 4) {
				this.text_triggers = [];
				this.text_triggers.push(new TextTrigger(6095, 7395.5, Resource.Image.car, 3, 128));
			}
			
			for (var i = 0; i < this.vampires.length; i++) {
				this.vampires[i].update(elapsedTime);
				var v = this.vampires[i];
				
				if (this.player.bb.touching(v.bb)) {
					if (!this.player.invincible) {
						this.player.health--;
						this.player.invincible = true;
					}
					this.player.glucose -= this.vampires[i].glucose_amount;
					this.vampires.splice(i, 1);
				}
				for (var j = 0; j < v.bullets.length; j++) {
					var b = v.bullets[j];
					if (this.player.bb.touching(b.bb)) {
						if (!this.player.invincible) {
							this.player.health -= 1;
							this.player.invincible = true;
						}
						v.bullets.splice(j, 1);
						j--;
					}
				}
				
				for (var j = 0; j < this.player.needles.length; j++) {
					if (this.player.needles[j].bb.touching(v.bb)) {
						this.vampires.splice(i, 1);
						i--;
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
		}
		else if (this.game_state == 'cutscene') {
			this.cutscene.update(elapsedTime);
		}
	},
	
	render: function() {
		if (this.game_state == 'normal') {
			this.screenContext.clearRect(0, 0, WIDTH, HEIGHT);
			
			this.tilemap.render(this.screenContext);
			this.cGrid.render();
			
			for (var i = 0; i < this.text_triggers.length; i++) {
				this.text_triggers[i].render(this.screenContext);
			}
			
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
		}
		else if (this.game_state == 'lost') {
			
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
			this.screenContext.fillStyle="white";
			this.screenContext.fillRect(0, 500, WIDTH, HEIGHT);
			this.textbox.write(this.screenContext, 'you lost.', 100, 520, 32);
			this.textbox.write(this.screenContext, 'the vampires will gnaw your corpse\nforever.', 100, 560, 24);
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
			this.screenContext.fillStyle="white";
			this.screenContext.fillRect(0, 500, WIDTH, HEIGHT);
			this.textbox.write(this.screenContext, 'you won!', 100, 520, 32);
			this.textbox.write(this.screenContext, 'the vampires will gnaw on their\nown fingers in frustration.', 100, 560, 24);
		}
		else if (this.game_state == 'cutscene') {
			this.cutscene.render(this.screenContext);
		}
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