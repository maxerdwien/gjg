var Player = function(grid) {

	this.bb = new BoundingBox(WIDTH/2-32, HEIGHT/2-32, 64, 64);
	this.cells = [];
	this.cGrid = grid;
	
	this.healthy_speed = 8.5;
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
	
	this.needles = [];
	
	this.throwing = false;
	
	this.throwing_timer_max = 500;
	this.throwing_timer = 0;
	
	this.use_syringe_cooldown_max = 100;
	this.use_syringe_cooldown = 0;
	
	this.ready_to_use_syringe = true;
	
	this.invincible = false;
	
	this.invincible_timer_max = 1400;
	this.invincible_timer = 0;
	
	this.flash_timer_max = 100;
	this.flash_timer = 0;
	
	this.invisible = false;
}

Player.prototype = {
	render: function(ctx) {
		
		for (var i = 0; i < this.needles.length; i++) {
			this.needles[i].render(ctx);
		}
		
		ctx.save();
		if (!this.facing_right) {
			ctx.translate(WIDTH, 0);
			ctx.scale(-1, 1);
		}
		var pose = this.current_pose;
		if (this.throwing) {
			pose += 3;
		}
		if (!this.invisible) {
			ctx.drawImage(Resource.Image.samantha, pose*32, 0, 32, 32, this.bb.x - gx, this.bb.y - gy, 64, 64);
		}
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
						//ctx.fillText('hypoglycemic!', 10, 150);
						game.textbox.write(ctx, 'hypoglycemic! eat something!', 10, 140, 24);
					} else {
						game.textbox.write(ctx, 'hyperglycemic! take your insulin!', 10, 140, 24);
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
			var health_y = 80;
			var heart_size = 50;
			for (var i = 0; i < this.health; i++) {
				ctx.drawImage(Resource.Image.heart, health_x + i*(heart_size+10), health_y, heart_size, heart_size);
			}
			for (var i = this.health; i < 5; i++) {
				ctx.drawImage(Resource.Image.empty_heart, health_x + i*(heart_size+10), health_y, heart_size, heart_size);
			}
			// and syringes
			for (var i = 0; i < this.syringes; i++) {
				ctx.drawImage(Resource.Image.insulin_straight, health_x + (i+5)*(heart_size+10), health_y, heart_size, heart_size);
			}
		}
	},
	
	clamp: function(value, min, max){
		if(value <= min) return min;
		if(value >= max) return max;
		return value;
	},
	
	update: function(et) {
		if (this.invincible) {
			this.invincible_timer += et;
			this.flash_timer += et;
			if (this.flash_timer >= this.flash_timer_max) {
				this.flash_timer -= this.flash_timer_max;
				this.invisible = !this.invisible;
			}
			if (this.invincible_timer >= this.invincible_timer_max) {
				this.invincible_timer -= this.invincible_timer_max;
				this.invincible = false;
				this.invisible = false;
			}
		}
		if (!this.ready_to_use_syringe) {
			this.use_syringe_cooldown += et;
			if (this.use_syringe_cooldown >= this.use_syringe_cooldown_max) {
				this.use_syringe_cooldown = 0;
				this.ready_to_use_syringe = true;
			}
		}
		if (this.throwing) {
			this.throwing_timer += et;
			if (this.throwing_timer >= this.throwing_timer_max) {
				this.throwing = false;
				this.throwing_timer -= this.throwing_timer_max;
			}
		}
		for (var i = 0; i < this.needles.length; i++) {
			this.needles[i].update(et);
		}
		
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
			if (!this.invincible) {
				this.health--;
				this.invincible = true;
			}
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
				if (!this.invincible) {
					this.health -= 1;
					this.invincible = true;
				}
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
				this.bb.lasty = this.bb.y;
				this.bb.y -= speed;
				walking = true;
				this.facing_up = true;
			} else if (game.input.inputState.down) {
				this.bb.lasty = this.bb.y;
				this.bb.y += speed;
				walking = true;
				this.facing_up = false;
			}
			
			if (game.input.inputState.right) {
				this.bb.lastx = this.bb.x;
				this.bb.x += speed;
				walking = true;
				this.facing_right = true;
			} else if (game.input.inputState.left) {
				this.bb.lastx = this.bb.x;
				this.bb.x -= speed;
				walking = true;
				this.facing_right = false;
			}
			
			this.walking = walking;
		}
		
		if (this.walking) {
			this.current_pose = 1 + this.walking_step;
		} else {
			this.current_pose = 0;
		}
		
		//stop the player from going out of bounds
		this.bb.x = this.clamp(this.bb.x, 0, world_width);
		this.bb.y = this.clamp(this.bb.y, 0, world_height);
		
		gx = this.bb.x + this.bb.width/2 - WIDTH/2;
		gy = this.bb.y + this.bb.height/2 - HEIGHT/2;
		
		
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
			this.ready_to_use_syringe = false;
			this.glucose -= 15;
		}
	},
	
	throw_syringe: function() {
		if (this.syringes > 0) {
			this.throwing = true;
			this.ready_to_use_syringe = false;
			this.syringes--;
			var needle_vel = 10;
			var x_vel = 0;
			if (game.input.inputState.right) {
				x_vel = needle_vel;
			} else if (game.input.inputState.left) {
				x_vel = -needle_vel;
			}
			
			var y_vel = 0;
			if (game.input.inputState.down) {
				y_vel = needle_vel;
			} else if (game.input.inputState.up) {
				y_vel = -needle_vel;
			}
			if (x_vel == 0 && y_vel == 0) {
				if (this.facing_right) {
					x_vel = needle_vel;
				} else {
					x_vel = -needle_vel;
				}
			}
			this.needles.push(new Needle(this.bb.x, this.bb.y, x_vel, y_vel));
		}
	}
}