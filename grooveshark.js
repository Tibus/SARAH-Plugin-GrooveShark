exports.action = function(data, callback, config, SARAH)
{
	var path = require("path").resolve(".");
	config = config.modules.grooveshark;
	
	var API_URL = __dirname + "/bin/GroovesharkPlayerAIR.exe ";
	var exec = require('child_process').exec;
	exec(API_URL+" config "+config.login+" "+config.password+" "+config.bigPicture);
	
	var params = "";
	var tts = "Je m'en occupe";
	switch(data.command)
	{
		case "pause":
			params = "pause";
			break;
		case "resume":
			params = "resume";
			break;
		case "next":
			params = "next";
			break;
		case "close":
			params = "close";
			break;
		case "prev":
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
			params = "like";
			break;
		case "favorites":
			params = "favorites";
			break;
		case "playlist":
			params = "playlist "+data.id;
			break;
		case "currentSong":
			if(config.detailedSongs == "true" || config.detailedSongs == "oui")
				params = "currentSongAlbum";
			else
				params = "currentSong";
			break;
		case "popular":
			params = "popular";
			break;
		case "currently":
			params = "currently";
			break;
		default : 
			callback();
			return;
			break;
	}

	callback({"tts":tts});
	
	var child = exec(API_URL+params,
		function (error, stdout, stderr) {
			if (error !== null) {
				console.log('exec error: ' + error);
			}
		});
}