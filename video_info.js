/*
 * video_info.js
 *
 * node.js video information module.
 */

var util	= require('util'), 
	cp		= require('child_process');

util.log('Load video_info.js module.');

exports.getInfo = function(file, callback) {
	var strCmd 	= '-loglevel quiet -show_format -show_streams -print_format json' + ' ' + file;
	var arrCmd 	= strCmd.split(' ');
	var ffprobe = cp.spawn('ffprobe', arrCmd);
	var stdout 	= '';
	var err 	= {};

	ffprobe.stdout.on('data', function(data) {
		stdout += data;
	});

	ffprobe.on('close', function(code, signal) {
		if (code != null) {
			util.log('ffprobe child process closed with code: ' + code);
			if (code == 0) {
                var info = JSON.parse(stdout);
				callback(null, info);
            } else {
				err.message = 'ffprobe closed with code: ' + code;
				callback(err, null);
			}
        }
        if (signal != null) {
            util.log('ffprobe child process closed with signal: ' + signal);
			err.message = 'ffprobe close with signal: ' + signal;
			callback(err, null);
        }
    });	
}

exports.getThumbnail = function(file, thumb, callback) {
    var strCmd 	= '-y -i ' + file + ' -vf thumbnail -frames:v 1 ' + thumb;
    var arrCmd 	= strCmd.split(' ');
    var ffmpeg 	= cp.spawn('ffmpeg', arrCmd);
	var err 	= {};

    ffmpeg.on('close', function(code, signal) {
        if (code != null) {
            util.log('ffmpeg child process closed with code: ' + code);
            if (code == 0) {
                callback(null);
            } else {
                err.message = 'ffmpeg closed with code: ' + code;
                callback(err);
            }
        }
        if (signal != null) {
            util.log('ffmpeg child process closed with signal: ' + signal);
            err.message = 'ffmpeg close with signal: ' + signal;
            callback(err);
        }
    }); 
}



