var Player = function(grid) {

	this.bb = new BoundingBox(WIDTH/2, HEIGHT/2, 64, 64);
	this.cells = [];
	this.cGrid = grid;
	
	this.healthy_speed = 10;
	this.slow_speed = 5;
	
	this.sidelength = 30;
	
	this.min_glucose = 80;
	this.max_glucose = 130;
	
	this.glucose = 105;
	
	this.latent_glucose = 0;
	this.max_absorption_per_second = 7;
	
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

	this.alarm_bar_state = 0;
	
	this.current_pose = 0;
	
	this.walking_timer_max = 200;
	this.walking_timer = 0;
	
	this.walking_step = 0;
	
	this.walking = false;
	
	this.facing_right = true;
}

Player.prototype = {
	render: function(ctx) {
		ctx.save();
		if (!this.facing_right) {
			ctx.translate(WIDTH + this.bb.width, 0);
			ctx.scale(-1, 1);
		}
		ctx.drawImage(Resource.Image.samantha, this.current_pose*32, 0, 32, 32, this.bb.x - gx, this.bb.y - gy, 64, 64);
		ctx.restore();

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
	},
	
	clamp: function(value, min, max){
		if(value <= min) return min;
		if(value >= max) return max;
		return value;
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
			
			var walking = false;
			if (game.input.inputState.up) {
				this.bb.lasty = this.y;
				this.bb.y -= speed;
				gy -= speed;
				walking = true;
			} else if (game.input.inputState.down) {
				this.bb.lasty = this.y;
				this.bb.y += speed;
				gy += speed;
				walking = true;
			}
			
			if (game.input.inputState.right) {
				this.bb.lastx = this.x;
				this.bb.x += speed;
				gx += speed;
				walking = true;
				this.facing_right = true;
			} else if (game.input.inputState.left) {
				this.bb.lastx = this.x;
				this.bb.x -= speed;
				gx -= speed;
				walking = true;
				this.facing_right = false;
			}
			
			this.walking = walking;
		}
		
		if (this.walking) {
			this.current_pose = 2 + this.walking_step;
		} else {
			this.current_pose = 0;
		}
		
		//stop the player from going out of bounds, yes I know I'm using magic numbers
		//fite me.
		this.bb.x = this.clamp(this.bb.x, 0, 10000);
		this.bb.y = this.clamp(this.bb.y, 0, 10000);
		
		if(Math.floor(this.bb.lastx) != Math.floor(this.bb.x) || Math.floor(this.bb.lasty) != Math.floor(this.bb.y))
		{
			this.cGrid.move(this);
		}

		
		this.walking_timer += et;
		if (this.walking_timer > this.walking_timer_max) {
			this.walking_timer -= this.walking_timer_max;
			if (this.walking_step == 0) {
				this.walking_step = 1;
			} else {
				this.walking_step = 0;
			}
		}

	},
	
	use_syringe: function() {
		if (this.syringes > 0) {
			this.syringes--;
			this.glucose -= 15;
		}
	}
}