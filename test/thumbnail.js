/* 
 * thumbnail.js
 * 
 * test getThumbnail function exported by video_info.js
 */
 
var	vi = require('../video_info');

vi.getThumbnail('./demo.rmvb', './demo.jpg', function(e) {
	if (e) throw e;
	console.log('Done.');
});

