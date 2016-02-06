var Textbox = function() {

}

Textbox.prototype = {
	render: function(ctx) {
		
	},
	
	write: function(ctx, string) {
		for (var i = 0; i < string.length; i++) {
			var char_num = 0;
			if (string.charAt(i) == ' ') {
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
			else {
				char_num = string.charCodeAt(i) - 97;
			}
			ctx.drawImage(Resource.Image.alphabet, char_num*16, 0, 16, 16, i*24, 0, 24, 24);
		}
	},
}