/* 
 * info.js
 * 
 * test getInfo function exported by video_info.js
 */
 
var	vi = require('../video_info');

vi.getInfo('./demo.rmvb', function(e, info) {
	if (e) throw e;
	console.log(JSON.stringify(info, null, 2));
});

