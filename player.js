var Player = function() {
	this.x = WIDTH/2;
	this.y = HEIGHT/2;
	
	this.speed = 10;
}

Player.prototype = {
	render: function(ctx) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(this.x, this.y, 10, 10);
		ctx.fillStyle = 'red';
		
		ctx.fill();
		ctx.stroke();
		ctx.restore();
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