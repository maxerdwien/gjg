var Player = function() {

	this.bb = new BoundingBox(WIDTH/2, HEIGHT/2, 64, 64);
	
	this.healthy_speed = 10;
	this.slow_speed = 5;
	
	this.sidelength = 30;
	
	this.min_glucose = 80;
	this.max_glucose = 130;
	
	this.glucose = 105;
	
	this.latent_glucose = 0;
	this.max_absorption_per_second = 7;
	
	//this.glucose_move_cost = 0.05;
	//this.glucose_idle_cost = 0.005;
	this.glucose_move_cost = 0;
	this.glucose_idle_cost = 0;
	
	this.max_timer = 5000;
	this.timer = 0;
	
	this.health = 5;
	
	this.fed_max = 100;
	this.fed_reset_level = 30;
	this.fed = this.fed_max;
	
	this.syringes = 0;
	
	this.bar_flash_max_1 = 1200;
	this.bar_flash_max_2 = 500;
	this.bar_flash = this.bar_flash_max_1;
	
	this.alarm_bar_state = 0;
}

Player.prototype = {
	render: function(ctx) {
		ctx.save();
		ctx.drawImage(Resource.Image.samantha, this.bb.x - gx, this.bb.y - gy, 64, 64);
		
		// render glucose bar
		{
			var bar_x = 10;
			var bar_y = 10;
			var bar_height = 30;
			
			// outline
			ctx.clearRect(bar_x, bar_y, WIDTH - bar_x*2, bar_height);
			ctx.beginPath();
			ctx.rect(bar_x, bar_y, WIDTH - bar_x*2, bar_height);
			ctx.stroke();
			
			// current amount
			if (this.glucose > this.max_glucose || this.glucose < this.min_glucose) {
				if (this.alarm_bar_state == 0) {
					ctx.font = '20px Georgia';
					ctx.fillStyle = 'black';
					if (this.glucose < this.min_glucose) {
						ctx.fillText('hypoglycemic!', 10, 150);
					} else {
						ctx.fillText('hyperglycemic!', 10, 150);
					}
					ctx.fillStyle = 'red';
				} else {
					ctx.fillStyle = 'green';
				}
			} else {
				ctx.fillStyle = 'green';
			}
			ctx.beginPath();
			ctx.rect(bar_x, bar_y, this.glucose*4, bar_height);
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
		}
		
		// render fed bar
		{
			var bar_x = 10;
			var bar_y = 50;
			var bar_height = 30;
			ctx.clearRect(bar_x, bar_y, this.fed_max*4, bar_height);
			ctx.beginPath();
			ctx.rect(bar_x, bar_y, this.fed*4, 30);
			ctx.fillStyle = 'purple';
			ctx.fill();
			ctx.beginPath();
			ctx.rect(bar_x, bar_y, this.fed_max*4, 30);
			ctx.stroke();
		}
		
		// render health
		{
			var health_x = 10;
			var health_y = 90;
			var heart_size = 30;
			for (var i = 0; i < this.health; i++) {
				var heart_size = 30;
				ctx.drawImage(Resource.Image.heart, health_x + i*(heart_size+10), health_y);
			}
			// and syringes
			for (var i = 0; i < this.syringes; i++) {
				ctx.drawImage(Resource.Image.insulin, health_x + (i+this.health)*(heart_size+10), health_y);
			}
		}
		
		ctx.restore();
	},
	
	update: function(et) {
		this.bar_flash -= et;
		if (this.bar_flash < 0) {
			if (this.alarm_bar_state == 0) {
				this.bar_flash += this.bar_flash_max_2;
			} else {
				this.bar_flash += this.bar_flash_max_1;
			}
			this.alarm_bar_state = (this.alarm_bar_state+1)%2;
		}
		
		this.fed -= 0.1;
		if (this.fed <= 0) {
			this.health--;
			if (this.health > 0) {
				this.fed = this.fed_reset_level;
			}
		}
		if (this.latent_glucose > 0) {
			var abs = this.max_absorption_per_second * (et/1000);
			if (this.latent_glucose > abs) {
				this.latent_glucose -= abs;
				this.glucose += abs;
			} else {
				this.glucose += this.latent_glucose;
				this.latent_glucose = 0;
			}
		}
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
				this.bb.y -= speed;
				gy -= speed;
				this.glucose -= this.glucose_move_cost;
			} else if (game.input.inputState.down) {
				this.bb.y += speed;
				gy += speed;
				this.glucose -= this.glucose_move_cost;
			}
			
			if (game.input.inputState.right) {
				this.bb.x += speed;
				gx += speed;
				this.glucose -= this.glucose_move_cost;
			} else if (game.input.inputState.left) {
				this.bb.x -= speed;
				gx -= speed;
				this.glucose -= this.glucose_move_cost;
			}
		}
		
		this.glucose -= this.glucose_idle_cost;
	},
	
	use_syringe: function() {
		if (this.syringes > 0) {
			this.syringes--;
			this.glucose -= 15;
		}
	}
}