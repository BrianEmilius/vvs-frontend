const browserSync = require('browser-sync').create();
browserSync.watch('./public/**/*').on('change', browserSync.reload);
browserSync.init({
	'server': './public'
});
