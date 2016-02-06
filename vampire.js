var Vampire = function(x, y, can_shoot, can_charge) {
	
	this.bb = new BoundingBox(x, y, 64, 64);
	
	this.normal_speed = 3;
	this.charge_speed = 6;
	this.speed = this.normal_speed;
	
	this.glucose_amount = 10;
	
	this.aggro_radius = 300;
	
	this.aggro = false;
	
	this.current_pose = 0;
	
	this.flap_timer_max = 100;
	this.flap_timer = 0;
	
	this.can_shoot = can_shoot;
	
	this.shoot_timer_max = 1000;
	this.shoot_timer = 0;
	
	this.bullets = [];
	
	this.can_charge = can_charge;
	
	this.charge_timer_max = 1700;
	this.charge_timer_active = 1000;
	this.charge_timer = 0;
}

Vampire.prototype = {
	render: function(ctx) {
		ctx.save();
		var pose = this.current_pose;
		if (this.aggro) {
			pose += 5;
		}
		ctx.drawImage(Resource.Image.vampire, pose*32, 0, 32, 32, this.bb.x - gx - this.bb.width/2, this.bb.y - gy - this.bb.height/2, 64, 64);
		
		// render aggro range for playtesting
		ctx.beginPath();
		ctx.arc(this.bb.x-gx, this.bb.y-gy, this.aggro_radius, 0, 6.29);
		ctx.stroke();
		
		ctx.restore();
		
		for (var i = 0; i < this.bullets.length; i++) {
			this.bullets[i].render(ctx);
		}
	},
	
	update: function(et) {
		// sprite swap
		this.flap_timer += et;
		if (this.flap_timer > this.flap_timer_max) {
			this.flap_timer -= this.flap_timer_max;
			this.current_pose = (this.current_pose+1) % 4;
		}

		var dist = Math.sqrt(Math.pow(this.bb.x-game.player.bb.x, 2) + Math.pow(this.bb.y-game.player.bb.y, 2));
		this.aggro = (dist < this.aggro_radius);
		if (this.aggro) {
			// move
			var delta_x = this.bb.x - game.player.bb.x;
			var delta_y = this.bb.y - game.player.bb.y;
			
			var angle = Math.atan2(delta_y, delta_x) + 3.14159;
			
			var x_vel = this.speed * Math.cos(angle);
			var y_vel = this.speed * Math.sin(angle);
			
			this.bb.x += x_vel;
			this.bb.y += y_vel;
			
			// shoot
			if (this.can_shoot) {
				this.shoot_timer += et;
				if (this.shoot_timer > this.shoot_timer_max) {
					this.shoot_timer -= this.shoot_timer_max;
					var bullet_speed = 10;
					this.bullets.push(new Bullet(this.bb.x-this.bb.width/2, this.bb.y-this.bb.height/2, bullet_speed * Math.cos(angle), bullet_speed * Math.sin(angle)));
				}
			}
			
			if (this.can_charge) {
				this.charge_timer += et;
				if (this.charge_timer > this.charge_timer_active) {
					this.speed = this.charge_speed;
					// double flap speed
					this.flap_timer += et;
				}
				if (this.charge_timer > this.charge_timer_max) {
					this.charge_timer -= this.charge_timer_max;
					this.speed = this.normal_speed;
				}
			}
		}
		
		for (var i = 0; i < this.bullets.length; i++) {
			this.bullets[i].update(et);
		}
	},
}