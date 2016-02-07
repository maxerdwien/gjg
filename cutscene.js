var Cutscene = function()
{
	this.current_scene = 0;
	this.count = 0;
	
	this.scene_lengths = [2000, 2000, 2000, 4000, 2000, 999999, 999999, 999999, 999999, 3000];
	this.scene_modes = ['cutscene', 'normal', 'normal', 'won', 'normal', 'cutscene', 'cutscene', 'cutscene', 'cutscene', 'normal'];
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
				
			case 2:
				context.fillStyle="white";
				context.fillRect(0, 500, WIDTH, HEIGHT);
				game.textbox.write(context, 'my car!\ni need to get those parts back...', 10, 510, 32);
				break;
				
			case 3:
				context.fillStyle="white";
				context.fillRect(0, 500, WIDTH, HEIGHT);
				game.textbox.write(context, 'i did it!\ntime to drive out of here.\nsuck it, vampires!', 10, 510, 32);
				break;
				
			case 4:
				context.fillStyle="white";
				context.fillRect(0, 500, WIDTH, HEIGHT);
				game.textbox.write(context, 'the steak is high.', 10, 510, 32);
				break;
			
			case 5:
				context.fillStyle="white";
				context.fillRect(0, 500, WIDTH, HEIGHT);
				game.textbox.write(context, 'green bar is your glucose\ndo not let it get above or\nbelow the orange marks!', 10, 510, 32);
				break;
			case 6:
				context.fillStyle="white";
				context.fillRect(0, 500, WIDTH, HEIGHT);
				game.textbox.write(context, 'purple bar represents fullness.\neat food to restore it.\nfood also increases glucose.', 10, 510, 32);
				break;
			case 7:
				context.fillStyle="white";
				context.fillRect(0, 500, WIDTH, HEIGHT);
				game.textbox.write(context, 'health and insulin inventory\nare below the fullness bar.', 10, 510, 32);
				break;
			case 8:
				context.fillStyle="white";
				context.fillRect(0, 500, WIDTH, HEIGHT);
				game.textbox.write(context, 'move with wasd or arrow keys.\npress shift to use insulin and\nreduce your glucose.\npress enter to throw insulin in the\ndirection you are moving.', 10, 510, 32);
				break;
			case 9:
				context.fillStyle="white";
				context.fillRect(0, 500, WIDTH, HEIGHT);
				game.textbox.write(context, 'oh, and avoid the vampires.\ngood luck!', 10, 510, 32);
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