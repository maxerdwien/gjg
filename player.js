var Player = function() {
	this.x = WIDTH/2;
	this.y = HEIGHT/2;
	
	this.healthy_speed = 10;
	this.slow_speed = 5;
	
	this.sidelength = 30;
	
	this.min_glucose = 80;
	this.max_glucose = 130;
	
	this.glucose = 105;
	
	this.glucose_move_cost = 0.1;
	this.glucose_idle_cost = 0.01;
	
	this.max_timer = 5000;
	this.timer = 0;
	
	this.health = 5;
	this.healthimg = Resource.Image.heart;
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
			var heart_size = 30;
			ctx.drawImage(this.healthimg, health_x + i*(heart_size+10), health_y);
			//ctx.beginPath();
			//ctx.rect(health_x + i*(heart_size+10), health_y, heart_size, heart_size);
			//ctx.fill();
			//ctx.stroke();
		}
		
		// render glucose bar
		{
			var bar_x = 10;
			var bar_y = 10;
			var bar_height = 30;
			// outline
			ctx.beginPath();
			ctx.rect(bar_x, bar_y, WIDTH - bar_x*2, bar_height);
			ctx.stroke();
			
			// current amount
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
	
	update: function(et) {
		if (this.glucose >= this.max_glucose) {
			if (this.timer <= 0) {
				this.health -= 1;
				this.timer = this.max_timer;
			}
		}
		if (this.timer > 0) {
			this.timer -= et;
		}
		// movement
		{
			var speed;
			if (this.glucose > this.min_glucose) {
				speed = this.healthy_speed;
			} else {
				speed = this.slow_speed;
			}
			if (game.input.inputState.up) {
				this.y -= speed;
				this.glucose -= this.glucose_move_cost;
			} else if (game.input.inputState.down) {
				this.y += speed;
				this.glucose -= this.glucose_move_cost;
			}
			
			if (game.input.inputState.right) {
				this.x += speed;
				this.glucose -= this.glucose_move_cost;
			} else if (game.input.inputState.left) {
				this.x -= speed;
				this.glucose -= this.glucose_move_cost;
			}
		}
		
		this.glucose -= this.glucose_idle_cost;
	},
}