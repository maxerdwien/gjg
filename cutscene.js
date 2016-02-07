var Cutscene = function()
{
	this.current_scene = 0;
	this.count = 0;
	
	this.scene_lengths = [2000, 2000, 2000];
	this.scene_modes = ['cutscene', 'normal'];
}

Cutscene.prototype = {
	render: function(context)
	{
		switch (this.current_scene)
		{
			case 0:
				context.fillStyle="white";
				context.fillRect(0, 500, WIDTH, HEIGHT);
				game.textbox.write(context, 'hey guys...', 10, 510, 32);
				break;
			case 1:
				context.fillStyle="white";
				context.fillRect(0, 500, WIDTH, HEIGHT);
				game.textbox.write(context, 'we got one!', 10, 510, 32);
				break;
			
		}
	},
	
	update: function(et) {
		this.count += et;
		if (this.count >= this.scene_lengths[this.current_scene]) {
			this.count = 0;
			game.game_state = this.scene_modes[this.current_scene];
			this.current_scene++;
		}
	}
}