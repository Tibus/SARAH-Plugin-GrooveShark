var API_URL = __dirname + "/bin/GroovesharkPlayerAIR.exe ";
var exec = require('child_process').exec;
var grooveSharkProcess;

/*
exports.speak = function(tts, async, SARAH)
{ 
	if(grooveSharkProcess)
		grooveSharkProcess = exec(API_URL+" speak "+tts, function (error, stdout, stderr){});
	return tts;
}
*/
exports.action = function(data, callback, config, SARAH)
{	
	var path = require("path").resolve(".");
	config = config.modules.grooveshark;
		
	var needProcess = false;
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
			needProcess = true;
			break;
		case "pause":
			tts="";
			params = "pause";
			needProcess = true;
			break;
		case "resume":
			tts="";
			params = "resume";
			needProcess = true;
			break;
		case "next":
			tts="";
			params = "next";
			needProcess = true;
			break;
		case "close":
			params = "close";
			needProcess = true;
			break;
		case "prev":
			tts="";
			params = "prev";
			needProcess = true;
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
			needProcess = true;
			break;
		case "unlike":
			tts="";
			params = "unlike";
			needProcess = true;
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
			needProcess = true;
			break;
		case "popular":
			params = "popular";
			break;
		case "currently":
			tts="";
			params = "currently";
			needProcess = true;
			break;
		case "shuffleTrue":
			tts="";
			params = "shuffle true";
			needProcess = true;
			break;
		case "shuffleFalse":
			tts="";
			params = "shuffle false";
			needProcess = true;
			break;
		default : 
			callback();
			return;
			break;
	}

	
	if(grooveSharkProcess == null)
	{
		if(needProcess == true)
			return 	callback({"tts":"Grouvshark n'est pas lancé"});
		exec(API_URL+" config "+config.login+" "+config.password+" "+config.bigPicture);
	}
	
	callback({"tts":tts});

	grooveSharkProcess = exec(API_URL+params,
		function (error, stdout, stderr) {
			if (error !== null) {
				console.log('exec error: ' + error);
			}
		});
}