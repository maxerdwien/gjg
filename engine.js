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

// Collision Detection Stuff
var BoundingBox = function(x, y, width, height)
{
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}

BoundingBox.prototype =
{
	min: function()
	{
		return { x:this.x, y:this.y};
	},
	max: function()
	{
		return { x:(this.x + this.width), y:(this.y + this.height)};
	},
	touching: function(bb)
	{
		if(this.x < bb.x + bb.width && this.y < bb.y + bb.height && this.x + this.width > bb.x && this.y + this.height > bb.y) return true;
		return false;
	}
}

var LLCell = function(data, next, list)
{
	this.data = data;
	this.next = next;
	this.list = list;
}

var LList = function()
{
	this.count = 0;
	this.first = new LLCell(0, 0, this);
}

LList.prototype = {

	add: function(data)
	{
		stepper = this.first;
		while(stepper != 0)
		{
			if(stepper.data === data)
			{
				return false;
			}
			stepper = stepper.next;
		}
		this.first.next = new LLCell(data, this.first.next, this);
		this.count++;
	},
	
	remove: function(data)
	{
		stepper = this.first;
		while(stepper.next != 0)
		{
			if(stepper.next.data === data)
			{
				stepper.next = stepper.next.next;
				this.count--;
				return true;
			}
			if(stepper.next != 0) stepper = stepper.next;
		}
		return false;
	},
	
	detectCollision: function(object)
	{
		var stepper = this.first.next;
		while(stepper != 0)
		{
			if(stepper != object)
			{
				if(object.bb.touching(stepper.data.bb)) return stepper.data;
				stepper = stepper.next;
			}
		}
		return null;
	}
}

var CollisionGrid = function(width, height, granularity)
{
	this.width = Math.floor(WIDTH/granularity);
	this.height = Math.ceil(HEIGHT/granularity);
	this.granularity = granularity;
	this.cells = [];
	
	for(i = 0; i < this.width; i++)
	{
		this.cells[i] = [];
		for(j = 0; j < this.height; j++)
		{
			this.cells[i][j] = new LList();
		}
	}
}

CollisionGrid.prototype = {

	add: function(asteroid)
	{
		asteroid.arrx = Math.floor(asteroid.x / this.width);
		asteroid.arry = Math.floor(asteroid.y / this.height);
		var arrPos = (asteroid.arry * this.width) + asteroid.arrx;
		this.cells[arrPos].add(asteroid);
	},
	
	remove: function(asteroid, x, y)
	{
		var arrPos = (y * this.width) + x;
		this.cells[arrPos].remove(asteroid);
	},
	
	move: function(asteroid)
	{
	},
	
	checkIfClose: function()
	{
		for(i = 0; i < this.cells.length; i++)
		{
			if(this.cells[i].count >= 2)
			{
				this.cells[i].detectCollision();
			}
		}
	},
	
	render: function(context)
	{
		for(i = 0; i < this.cells.length; i++)
		{
			if(this.cells[i].count > 0)
			{
				var y = i / this.width;
				var x = i % this.width;
				context.rect(x * this.width, y * this.height, this.width, this.height);
				context.fillStyle = "rgba(255,0,0,.01)";
				context.fill();
			}
		}
	}
}


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
			if (this.player.bb.touching(v.bb)) {
				this.player.health -= 1;
				this.player.glucose -= v.glucose_amount;
				this.vampires.splice(i, 1);
				i--;
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