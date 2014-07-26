var API_URL = __dirname + "/bin/GroovesharkPlayerAIR.exe ";
var exec = require('child_process').exec;
/*
exports.speak = function(tts, async, SARAH)
{ 
	var child = exec(API_URL+"sarahSay "+tts, function (error, stdout, stderr){});
	console.log("say somethings : "+tts);
	return tts;
}
*/
exports.action = function(data, callback, config, SARAH)
{
	var path = require("path").resolve(".");
	config = config.modules.grooveshark;
	
	var params = "";
	var tts = "Je m'en occupe";
	switch(data.command)
	{
		case "info" :
			var info = require('fs').readFileSync(__dirname + "/bin/infos.json", 'utf8');;// last / popular / favorites
			callback({"tts":String(info)});
			return;
			break;
		case "playPause" :
			params = "playPause "+config.doOnOpen;// last / popular / favorites
			break;
		case "setVolume":
			tts="";
			console.log("coucou");
			params = "setVolume "+data.value;
			break;
		case "pause":
			tts="";
			params = "pause";
			break;
		case "resume":
			tts="";
			params = "resume";
			break;
		case "next":
			tts="";
			params = "next";
			break;
		case "close":
			params = "close";
			break;
		case "prev":
			tts="";
			params = "prev";
			break
		case "updatePlaylist":
			params = "updatePlaylist";
			break
		case "open":
			params = config.doOnOpen;// last / popular / favorites
			break;
		case "artist":
			var dictation = data.dictation;
			var gs = "GrooveShark|Grooveshark|grooveshark|Groovshark|grouvshark";
			match = dictation.match(eval("/artiste (.+) sur (?:"+gs+")/i"));
			if(!match)
				match = dictation.match(eval("/artiste (.+) (?:"+gs+")/i"));
			if(!match)
				match = dictation.match(eval("/artiste (.+)/i"));
			if(!match)
				return callback({"tts":"Je n'ai rien trouvé"});
			params = 'artist "'+match[1]+'"';
			break;
		case "last":
			params = "last";
			break;
		case "album":
			var dictation = data.dictation;
			var gs = "GrooveShark|Grooveshark|grooveshark|Groovshark|grouvshark";
			match = dictation.match(eval("/album (.+) de l'artiste (.+) sur (?:"+gs+")/i"));
			if(!match)
				match = dictation.match(eval("/album (.+) de l'artiste (.+) (?:"+gs+")/i"));
			if(!match)
				match = dictation.match(eval("/album (.+) de l'artiste (.+)/i"));
			if(match)
				params = 'album "'+match[1]+'" artist "'+match[2]+'"';
			else
			{
				match = dictation.match(eval("/album (.+) sur (?:"+gs+")/i"));
				if(!match)
					match = dictation.match(eval("/album (.+) (?:"+gs+")/i"));
				if(!match)
					match = dictation.match(eval("/album (.+)/i"));
				if(match)
					params = 'album "'+match[1]+'"';
				else
					return callback({"tts":"Je n'ai rien trouvé"});
			}
			break;
		case "like":
			tts="";
			params = "like";
			break;
		case "favorites":
			params = "favorites";
			break;
		case "playlist":
			params = "playlist "+data.id;
			break;
		case "currentSong":
			tts="";
			if(config.detailedSongs == "true" || config.detailedSongs == "oui")
				params = "currentSongAlbum";
			else
				params = "currentSong";
			break;
		case "popular":
			params = "popular";
			break;
		case "currently":
			tts="";
			params = "currently";
			break;
		default : 
			callback();
			return;
			break;
	}

	callback({"tts":tts});
	
	exec(API_URL+" config "+config.login+" "+config.password+" "+config.bigPicture);

	var child = exec(API_URL+params,
		function (error, stdout, stderr) {
			if (error !== null) {
				console.log('exec error: ' + error);
			}
		});
}