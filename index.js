/**
 * arcconfig
 * https://github.com/ARitz-Cracker/arc-config
 * "I think JSON is an ugly config file format, so I made my own!"
 *
 * Copyright (c) Aritz Beobide-Cardinal
 * Licensed under the GNU GPLv3 license.
 *
 *
 */
const guessValType = function(val){
	if(val === "true" || val === "yes"){
		return true;
	}else if(val === "false" || val === "no"){
		return false;
	}else if(isNaN(val)){
		return val;
	}
	return Number(val);
};

const STATE_KEY = 0;
const STATE_QUOTE_KEY = 1;
const STATE_VALUE = 2;
// const STATE_BRACKET = 3;
const STATE_COMMENT = 4;

exports.Decode = function(str = ""){
	str = str.replace(/\r/gm, "").replace(/\t/gm, " ");
	const result = {};
	let curObject = result;
	let state = 0;
	let curKey = "";
	let curVal = "";
	let bracket;
	for(let i = 0; i < str.length; i += 1){
		const c = str[i];
		if(c === "#" && state !== STATE_QUOTE_KEY){
			switch(state){
				case STATE_VALUE:
					curVal = curVal.trim();
					if(curVal !== ""){
						curObject[curKey] = guessValType(curVal);
						curVal = "";
					}
				case STATE_KEY:
					curKey = "";
				default:
					// None
			}
			state = STATE_COMMENT;
		}
		switch(state){
			case STATE_KEY:
				if(curKey === ""){
					switch(c){
						case " ":
						case "\n":
							break;
						case "\"":
							state = STATE_QUOTE_KEY;
							break;
						case "{":
							if(bracket != null){
								throw new Error("Nested brackets aren't allowed");
							}
							bracket = curObject;
							break;
						case "}":
							bracket = null;
							curObject = result;
							break;
						default:
							curKey += c;
					}
					break;
				}
				switch(c){
					case " ":
						state = STATE_VALUE;
						break;
					case ".":{
						if(str[i + 1] === "["){
							const i2 = str.indexOf("]", i + 1);
							const lines = str.substring(i + 2, i2).split("\n");
							const value = [];
							for(let ii = 0; ii < lines.length; ii += 1){
								let[val] = lines[ii].split("#", 1);
								val = val.trim();
								if(val){
									value.push(guessValType(val));
								}
							}
							curObject[curKey] = value;
							curKey = "";
							i = i2;
							break;
						}
						const newObject = curObject[curKey];
						if(newObject == null){
							curObject[curKey] = {};
							curObject = curObject[curKey];
						}else if(typeof newObject === "object"){
							curObject = newObject;
						}else{
							curObject[curKey] = {_root: newObject};
							curObject = curObject[curKey];
						}
						curKey = "";
						break;
					}
					default:
						curKey += c;
				}
				break;
			case STATE_QUOTE_KEY: // Quoted key
				if(c === "\""){
					state = STATE_KEY;
				}else{
					curKey += c;
				}
				break;
			case STATE_VALUE: // value
				if(c === "\n"){
					curVal = curVal.trim();
					if(curVal !== ""){
						curObject[curKey] = guessValType(curVal);
						curVal = "";
					}
					curKey = "";
					if(bracket == null){
						curObject = result;
					}else{
						curObject = bracket;
					}
					state = STATE_KEY;
				}else{
					curVal += c;
				}
				break;
			case STATE_COMMENT: // Comment
				if(c === "\n"){
					if(bracket == null){
						curObject = result;
					}else{
						curObject = bracket;
					}
					state = STATE_KEY;
				}
				break;
			/* istanbul ignore next */
			default:
				throw new Error("Unknown state! " + state + " this should never happen!");
		}
	}
	curVal = curVal.trim();
	if(curVal !== ""){
		curObject[curKey] = guessValType(curVal);
		curVal = "";
	}
	return result;
};

exports.decode = exports.Decode;
