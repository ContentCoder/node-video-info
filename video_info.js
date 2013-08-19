/*
 * video_info.js
 *
 */

var util 	= require('util'), 
	cp 		= require('child_process');

exports.getInfo = function(file, callback) {
	exports.getFullInfo(file, function(e, fullInfo) {
		if (e) {
			callback(e, null);
		} else {
			var info = {};
			info.name 		= fullInfo.format.filename;
			info.size 		= fullInfo.format.size;
			info.format 	= fullInfo.format.format_name;
			info.duration 	= fullInfo.format.duration;
			info.bit_rate 	= fullInfo.format.bit_rate;
			
			for (var i = 0; i< fullInfo.streams.length; i++) {
				var stream 	= fullInfo.streams[i];
				if (stream.codec_type === 'audio') {
					info.acodec 			= stream.codec_name;
					info.channels 			= stream.channels;
					info.sample_fmt 		= stream.sample_fmt;
					info.sample_rate 		= stream.sample_rate;
					info.bits_per_sample 	= stream.bits_per_sample;
				}
				if (stream.codec_type === 'video') {
					info.vcodec 	= stream.codec_name;
					info.width 		= stream.width;
					info.height 	= stream.height;
				}
			}

			callback(null, info);
		}
	});
}

exports.getFullInfo = function(file, callback) {
	var strCmd 		= '-loglevel quiet -show_format -show_streams -print_format json' + ' ' + file;
	var arrCmd 		= strCmd.split(' ');
	var ffprobe 	= cp.spawn('ffprobe', arrCmd);
	var stdout 		= '';
	var err 		= {};

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

exports.getThumbnail = function(file, thumb, time, callback) {
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



