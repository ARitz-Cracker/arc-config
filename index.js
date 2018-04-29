/**
 * arcconfig
 * https://github.com/ARitz-Cracker/arc-config
 * "I think JSON is an ugly config file format, so I made my own!"
 *
 * Copyright (c) Aritz Beobide-Cardinal
 * Licensed under the GNU GPLv3 license.
 *
 * TODO: Support {}
 *
 */
exports.Decode = function(str){
	str = str.replace(/\r/gm,"").replace(/\t/gm," ");
	var result = {}
	var lines = str.split("\n");
	for (var i=0;i<lines.length;i+=1){
		var c = lines[i].indexOf("#");
		var line = "";
		if (c>=0){
			line = lines[i].substring(0,c);
		}else{
			line = lines[i];
		}
		////console.log(line)
		line = line.trim();
		
		if (line.length == 0){continue;} // Ignore blank line (or a line only containing a comment)
		var keyArr = [];
		var val;
		
		var quote = false
		var curKey = "";
		for (var ii=0;ii<line.length;ii+=1){
			if (quote){
				if(line[ii] == "\""){
					quote = false;
				}else{
					curKey += line[ii];
				}
			}else if(line[ii] == "."){
				keyArr.push(curKey);
				curKey = "";
			}else if(line[ii] == "\""){
				quote = true;
			}else if(line[ii] == " "){
				val = line.substring(ii);
				break;
			}else{
				curKey += line[ii];
			}
		}
		if (quote){
			throw new SyntaxError("There's an open quitation mark without a closing quotation mark on line "+(i+1));
		}
		keyArr.push(curKey);

		val = val.trim(); // I would use trimLeft here but apperently that isn't standard or something
		
		var layer = result;
		for(var ii=0; ii<keyArr.length-1; ii+=1){
			curlayer = layer[keyArr[ii]];
			if (curlayer == null){
				layer[keyArr[ii]] = {};
			}else if (typeof curlayer != "object"){
				layer[keyArr[ii]] = {}
				layer[keyArr[ii]]._root = curlayer
			}
			layer = layer[keyArr[ii]];
		}
		var ii = keyArr.length-1;
		if (val === "true" || val === "yes"){
			layer[keyArr[ii]] = true;
		}else if (val === "false" || val === "no"){
			layer[keyArr[ii]] = false;
		}else if(isNaN(val)){
			layer[keyArr[ii]] = val;
		}else{
			layer[keyArr[ii]] = Number(val);
		}
		
	}
	return result;
	
}

