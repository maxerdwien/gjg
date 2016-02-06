var Player = function() {
	this.x = WIDTH/2;
	this.y = HEIGHT/2;
	
	this.speed = 10;
	
	this.sidelength = 30;
	
	this.min_glucose = 80;
	this.max_glucose = 130;
	
	this.glucose = 105;
	
	this.health = 5;
}

Player.prototype = {
	render: function(ctx) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.sidelength, this.sidelength);
		ctx.fillStyle = 'red';
		
		ctx.fill();
		ctx.stroke();
		ctx.restore();
		
		// render health
		var health_x = 10;
		var health_y = 50;
		for (var i = 0; i < this.health; i++) {
			ctx.beginPath();
			var heart_size = 30;
			ctx.rect(health_x + i*(heart_size+10), health_y, heart_size, heart_size);
			ctx.fill();
			ctx.stroke();
		}
		
		// render glucose bar
		{
			// outline
			ctx.beginPath();
			ctx.rect(bar_x, bar_y, WIDTH - bar_x*2, bar_height);
			ctx.stroke();
			
			// current amount
			var bar_x = 10;
			var bar_y = 10;
			var bar_height = 30;
			ctx.save();
			ctx.beginPath();
			ctx.rect(bar_x, bar_y, this.glucose*4, bar_height);
			ctx.fillStyle = 'green';
			ctx.fill();
			
			// min level
			var warning_bar_width = 6;
			ctx.beginPath();
			ctx.rect(bar_x + this.min_glucose*4 - warning_bar_width/2, bar_y, warning_bar_width, bar_height);
			ctx.fillStyle = 'orange';
			ctx.fill();
			
			// max level
			ctx.beginPath();
			ctx.rect(bar_x + this.max_glucose*4 - warning_bar_width/2, bar_y, warning_bar_width, bar_height);
			ctx.fillStyle = 'orange';
			ctx.fill();
			ctx.restore();
		}
	},
	
	update: function() {
		if (game.input.inputState.up) {
			this.y -= this.speed;
		} else if (game.input.inputState.down) {
			this.y += this.speed;
		}
		
		if (game.input.inputState.right) {
			this.x += this.speed;
		} else if (game.input.inputState.left) {
			this.x -= this.speed;
		}
	},
}