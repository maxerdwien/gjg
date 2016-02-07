var CarPart = function(x, y, name, sprite) {
	this.bb = new BoundingBox(x, y, 64, 64);
	
	this.cells = [];
	this.name = name;
	this.sprite = sprite;
	
	this.picked_up = false;
	
	this.render_text_timer = 3000;
	
	this.dead = false;
}

CarPart.prototype = {
	render: function(ctx) {
		if (!this.picked_up) {
			ctx.drawImage(this.sprite, this.bb.x-gx, this.bb.y-gy, 64, 64);
		} else {
			if (!this.dead) {
				
				if (game.car_parts_found.toString() == '4')	{
					game.textbox.write(ctx, 'you got the ' + this.name + '.\n' + game.car_parts_found.toString() + '/4 parts found\ngo fix your car!',
						100, 300, 24);
				} else {
					game.textbox.write(ctx, 'you got the ' + this.name + '.\n' + game.car_parts_found.toString() + '/4 parts found',
						100, 300, 24);
				}
			}
		}
	},
	
	update: function(et) {
		if (this.picked_up) {
			this.render_text_timer -= et;
			if (this.render_text_timer <= 0) {
				this.dead = true;
			}
		}
	},
}