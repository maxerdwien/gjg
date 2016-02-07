var Textbox = function() {

}

Textbox.prototype = {
	render: function(ctx) {
		
	},
	
	write: function(ctx, string, x, y, font_size) {
		var line = 0;
		var eat_chars = 0;
		for (var i = 0; i < string.length; i++) {
			var char_num = 0;
			if (string.charAt(i) == ' ') {
				continue;
			}
			else if (string.charAt(i) == '\n') {
				line++;
				eat_chars = i+1;
				continue;
			}
			else if (string.charAt(i) == '.') {
				char_num = 26;
			}
			else if (string.charAt(i) == ',') {
				char_num = 27;
			}
			else if (string.charAt(i) == '?') {
				char_num = 28;
			}
			else if (string.charAt(i) == '!') {
				char_num = 29;
			}
			else if (string.charAt(i) == '"') {
				char_num = 30;
			}
			else if (string.charAt(i) == '-') {
				char_num = 31;
			}
			else if (string.charAt(i) == '/') {
				char_num = 42;
			}
			
			// it was a game jam. shut up.
			else if (string.charAt(i) == '1') {
				char_num = 32;
			}
			else if (string.charAt(i) == '2') {
				char_num = 33;
			}
			else if (string.charAt(i) == '3') {
				char_num = 34;
			}
			else if (string.charAt(i) == '4') {
				char_num = 35;
			}
			else if (string.charAt(i) == '5') {
				char_num = 36;
			}
			else if (string.charAt(i) == '6') {
				char_num = 37;
			}
			else if (string.charAt(i) == '7') {
				char_num = 38;
			}
			else if (string.charAt(i) == '8') {
				char_num = 39;
			}
			else if (string.charAt(i) == '9') {
				char_num = 40;
			}
			else if (string.charAt(i) == '0') {
				char_num = 41;
			}
			
			
			else {
				char_num = string.charCodeAt(i) - 97;
			}
			ctx.drawImage(Resource.Image.alphabet, char_num*16, 0, 16, 16, x + (i-eat_chars)*font_size, y + line*(font_size+6), font_size, font_size);
		}
	},
}