const gulp = require('gulp');
const browserify = require('gulp-browserify');
const jade = require('gulp-jade');
const merge = require('merge-stream');
const meta = require('./package.json');
const NwBuilder = require('nw-builder');
const sass = require('gulp-sass');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'del', 'browser-sync']
});

var YOUR_LOCALS = {};

const src = {
	view : './src/view/*.jade',
	style : './src/style/*.scss',
	client : './src/script/client/lib.js',
	server : './src/script/server/*.js',
	json : './package.json',
	module : {
		express : './node_modules/express/**/*',
		socketio : './node_modules/socket.io/**/*',
		angular : './node_modules/angular/**/*.js',
		underscore : './node_modules/underscore/**/*',
	}
};

const dist = {
	'public' : './dist/public/', 
	app : './dist',
	module : {
		express : './dist/node_modules/express',
		socketio : './dist/node_modules/socket.io',
		angular : './dist/public',
		underscore : './dist/node_modules/underscore',
	},
	build : '.build/',
	package : 'packages/'
};

gulp.task('view', function() {
	return gulp.src(src.view)
		.pipe(jade({
			locals: YOUR_LOCALS
		}))
		.pipe(gulp.dest(dist.app))
});

gulp.task('style', function () {
	return gulp.src(src.style)
		.pipe(sass({
			includePaths: [
				'src/style/contrib/'
			]
		}).on('error', sass.logError))
		.pipe(gulp.dest(dist.public));
});
 
gulp.task('client', function() {
	return gulp.src(src.client)
		.pipe(browserify({
			insertGlobals : true,
			debug : !gulp.env.production
		}))
		.pipe(gulp.dest(dist.public))
});

gulp.task('server', function() {
	gulp.src(src.server).pipe(gulp.dest(dist.public));
});

gulp.task('json', function() {
	return gulp.src(src.json).pipe(gulp.dest(dist.app));
});

gulp.task('modules', function() {
	for (var i  in src.module ) {
		gulp.src(src.module[i]).pipe(gulp.dest(dist.module[i]));
	};
});

gulp.task('default', ['json', 'server', 'client', 'style', 'view', 'modules']);

gulp.task('watch', ['default'] , function (cb) {
	gulp.watch(src.view, ['view']);
	gulp.watch(src.style, ['style']);
	gulp.watch(src.client, [ 'client']);
	gulp.watch(src.server, ['server']);
});

// Build packages
gulp.task('build', ['default'], function() {
  var nw = new NwBuilder({
    files: [ dist.app + '**/**'], // use the glob format
    platforms: ['win', 'osx', 'linux'],
    // TODO: Use these instead of the nested app/package.json values
    //appName: meta.name,
    //appVersion: meta.version,
    buildDir: dist.build,
    macZip: true,
    cacheDir: '/tmp',
    version: '0.12.3'
    // TODO: timestamped versions
    // TODO: macIcns
    // TODO: winIco
  });

  return nw.build()
    .catch(function (error) {
      console.error(error);
    });
});

// Zip packages
gulp.task('zip', ['build'], function() {
  // Zip the packages
  var linux32 = gulp.src(dist.package + meta.name + '/linux32/**/*')
    .pipe($.zip('linux32.zip'))
    .pipe(gulp.dest(dist.package + meta.name));

  var linux64 = gulp.src(dist.package + meta.name + '/linux64/**/*')
    .pipe($.zip('linux64.zip'))
    .pipe(gulp.dest(dist.package + meta.name));

  var osx32 = gulp.src(dist.package + meta.name + '/osx32/**/*')
    .pipe($.zip('osx32.zip'))
    .pipe(gulp.dest(dist.package + meta.name));

  var osx64 = gulp.src(dist.package + meta.name + '/osx64/**/*')
    .pipe($.zip('osx64.zip'))
    .pipe(gulp.dest(dist.package + meta.name));

  var win32 = gulp.src(dist.package + meta.name + '/win32/**/*')
    .pipe($.zip('win32.zip'))
    .pipe(gulp.dest(dist.package + meta.name));

  var win64 = gulp.src(dist.package + meta.name + '/win64/**/*')
    .pipe($.zip('win64.zip'))
    .pipe(gulp.dest(dist.package + meta.name));

  return merge(linux32, linux64, osx32, osx64, win32, win64);
});


