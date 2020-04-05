var gulp = require('gulp');
// var dest = require('gulp-dest');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
// var sourcemaps = require('gulp-sourcemaps');
var minify = require('gulp-minify');
var rename = require('gulp-rename');
var del = require('del');
var vinylPaths = require('vinyl-paths');
var minifyCss = require('gulp-minify-css');
var minimist = require('minimist');
// var gutil = require('gulp-util');
var angularFilesort = require('gulp-angular-filesort');
var inject = require('gulp-inject');
var moment = require('moment');
var GulpSSH = require('gulp-ssh');

var config = require('./gulp.config.json');


//List of lib (js) files. Please make entry of files here in correct order
var _libFiles = ['src/taxAppJs/lib/jquery-2.1.1.min.js', 'src/taxAppJs/lib/lodash.js', 'src/taxAppJs/lib/angular/angular.min.js', 'src/taxAppJs/lib/angular/angular-route.min.js', 'src/taxAppJs/lib/angular/angular-animate.min.js', 'src/taxAppJs/lib/angular/angular-sanitize.min.js', 'src/taxAppJs/lib/angular/angular-touch.min.js',
	'src/taxAppJs/lib/angular/angular-cookies.min.js', 'src/taxAppJs/lib/angular-lodash.js', 'src/taxAppJs/lib/angular-translate/angular-translate.min.js', 'src/taxAppJs/lib/ui-bootstrap-tpls.js', 'src/taxAppJs/lib/ui-bootstrap-custom-tpls-0.13.4.js', 'src/taxAppJs/lib/ng-table.min.js', 'src/taxAppJs/lib/toaster.js', 'src/taxAppJs/lib/ui-layout.js', 'src/taxAppJs/lib/loading-bar.js',
	'src/taxAppJs/lib/select.min.js', 'src/taxAppJs/lib/dialogs.min.js', 'src/taxAppJs/lib/dialogs-default-translations.min.js', 'src/taxAppJs/lib/text-angular/rangy-core.js', 'src/taxAppJs/lib/text-angular/rangy-selectionsaverestore.js', 'src/taxAppJs/lib/text-angular/textAngularSetup.js', 'src/taxAppJs/lib/text-angular/textAngular.js',
	'src/taxAppJs/lib/text-angular/textAngular-sanitize.js', 'src/taxAppJs/lib/moment/moment.js', 'src/taxAppJs/lib/moment/moment-timezone.js', 'src/taxAppJs/lib/moment/moment-timezone-with-data-2010-2020.js', 'src/taxAppJs/lib/ui-calendar/fullcalendar.js', 'src/taxAppJs/lib/ui-calendar/calendar.js', 'src/taxAppJs/lib/angular-multi-select.js',
	'src/taxAppJs/lib/file-upload/ng-file-upload-shim.min.js', 'src/taxAppJs/lib/file-upload/ng-file-upload.min.js', 'src/taxAppJs/lib/angular-sortable-view.js', 'src/taxAppJs/lib/export/ng-csv.min.js', 'src/taxAppJs/lib/pdfMaker/pdfmake.min.js', 'src/taxAppJs/lib/pdfMaker/vfs_fonts.js', 'src/taxAppJs/lib/kendo-ui/kendo.custom.min.js',
	'src/taxAppJs/lib/kendo-ui/jszip.min.js', 'src/taxAppJs/lib/kendo-ui/pako_deflate.min.js', 'src/taxAppJs/lib/intro.min.js', 'src/taxAppJs/lib/angular-intro.min.js', 'src/taxAppJs/lib/irs/fingerprint.js', 'src/taxAppJs/lib/irs/sha1.js', 'src/taxAppJs/lib/postal.min.js', 'src/taxAppJs/lib/bootstrap-colorpicker-module.js',
	'src/taxAppJs/lib/hotkeys.js', 'src/taxAppJs/lib/angular-recaptcha.js', 'src/taxAppJs/lib/angular-qrcode.js', 'src/taxAppJs/lib/qrcode.js', 'src/taxAppJs/lib/socket.io.js', 'src/taxAppJs/lib/angular-pretty-xml.js', 'src/taxAppJs/lib/cropper/cropper.js', 'src/taxAppJs/lib/jquery-ui.min.js', 'src/taxAppJs/lib/ilink-chat.js', 'src/taxAppJs/lib/ng-clipboard.min.js', 'src/taxAppJs/lib/ngclipboard.min.js', 'src/taxAppJs/lib/ua-parser.min.js', 'src/taxAppJs/lib/firebase/firebase-app.js', 'src/taxAppJs/lib/firebase/firebase-messaging.js'];

var _cssFiles = ['src/taxAppJs/common/css/Styles.css', 'src/taxAppJs/common/css/ng-table.min.css', 'src/taxAppJs/common/css/toaster.css'
	, 'src/taxAppJs/common/css/loading-bar.css', 'src/taxAppJs/common/css/ui-layout.css', 'src/taxAppJs/common/css/resizablepanel.css', 'src/taxAppJs/common/css/dialogs.min.css','src/taxAppJs/common/css/textAngular.css'
	, 'src/taxAppJs/common/css/select.min.css', 'src/taxAppJs/common/css/fullcalendar.css', 'src/taxAppJs/common/css/angular-multi-select.css', 'src/taxAppJs/lib/kendo-ui/kendo.common-material.min.css'
	, 'src/taxAppJs/lib/kendo-ui/kendo.material.min.css', 'src/taxAppJs/common/css/introjs.min.css', 'src/taxAppJs/common/css/introjs-theme.css', 'src/taxAppJs/common/css/flag-css/flag-icon.css', 'src/taxAppJs/common/css/colorpicker.css', 'src/taxAppJs/common/css/ilink-chat.css'];
/**
 * This will build app file for all source (js) files
 */
/*gulp.task('appBuild',['appMinify'],function(){
	return gulp.src('taxapp/dist/app.min.js.map')
		    .pipe(vinylPaths(del))
			.pipe(rename('app.min.js.map.bk'))
			.pipe(gulp.dest('taxapp/dist/'));
});*/

/**
 * This will build app file for all source (js) files
 * please pass NODE_ENV variable like 'gulp appMinify --NODE_ENV production'  production/test/local
 */
gulp.task('appMinify', function () {
	//external
	var preprocess = require('gulp-preprocess');

	// knownOptions taken bcoz we have to take arguments from command line
	var knownOptions = {
		string: 'NODE_ENV'
	};

	var options = minimist(process.argv.slice(2), knownOptions);

	return gulp.src(config.jsSource)
		.pipe(angularFilesort())
		//.pipe(sourcemaps.init())
		.pipe(concat('app.min.js'))
		.pipe(preprocess({ context: { NODE_ENV: options.NODE_ENV } }))
		.pipe(uglify())
		//.pipe(sourcemaps.write('../dist/'))
		.pipe(gulp.dest('src/taxAppJs/dist/'));
});

/**
 * This taks will minify and concat all css in to one . This include main Style.css and all third party css.
 */
gulp.task('cssBuild', function () {
	return gulp.src(_cssFiles)
		.pipe(concat('all.css'))
		.pipe(minifyCss())
		.pipe(gulp.dest('src/taxAppJs/common/css'));
});

/**
 * This task will concat & minify lib files
 */
gulp.task('libMinify', function () {
	return gulp.src(_libFiles)
		.pipe(concat('lib.js'))
		.pipe(minify())
		.pipe(gulp.dest('src/taxAppJs/'));
});

/**
 * This task will delete lib.js file form taxapp directory
 * We have introduced dependency of 'libMinify' task to make it synchronous
 */
gulp.task('libDelete', function () {
	return gulp.src('src/taxAppJs/lib.js')
		.pipe(vinylPaths(del))
})

/**
 * This task will rename minified file to main and then delete minified copy.
 * We have introduced dependency of 'libMinify' task to make it synchronous
 */
gulp.task('renameMinifiedLib', function () {
	return gulp.src('src/taxAppJs/lib-min.js')
		.pipe(vinylPaths(del))
		.pipe(rename('lib.min.js'))
		.pipe(gulp.dest('src/taxAppJs/dist/'));
});

/**
 * This will build lib.js
 */
gulp.task('libBuild', gulp.series('libMinify', 'libDelete', 'renameMinifiedLib'));

///////////////////////////////////////////////////////////////////// CALC WORKER //////////////////////////////////////////////////////////////////////////

/**
 * Minify calc worker
 */

/**
 * This will minify and concat external libraries used in Calc Worker
 */
gulp.task('minifyCalcLibImports', function () {
	return gulp.src(config.calcLibImports)
		.pipe(concat('calc-lib-import.js'))
		.pipe(uglify({ mangle: false }))
		.pipe(gulp.dest('src/taxAppJs/dist/'));
});

/**
 * This will minify and concat source files for import in main calc file
 */
gulp.task('minifyCalcSourceImports', function () {
	return gulp.src(config.calcSourceImports)
		.pipe(concat('calc-source-import.js'))
		.pipe(uglify())
		.pipe(gulp.dest('src/taxAppJs/dist/'));
});

/**
 * This will minify and concat external libraries used in Calc Worker
 */
gulp.task('minifyCalcSource', function () {
	var preprocess = require('gulp-preprocess');

	// knownOptions taken bcoz we have to take arguments from command line
	var knownOptions = {
		string: 'NODE_ENV'
	};

	var options = minimist(process.argv.slice(2), knownOptions);

	return gulp.src(config.calcSource)
		.pipe(concat('calc-dist.js'))
		.pipe(preprocess({ context: { NODE_ENV: options.NODE_ENV } }))
		.pipe(uglify())
		.pipe(gulp.dest('src/taxAppJs/dist/'));
});

gulp.task('minifyCalc', gulp.series('minifyCalcSource', 'minifyCalcLibImports', 'minifyCalcSourceImports'));




/**
 * Generate offline file list for Local/Development
 */
gulp.task('devGenerateOfflineList', function () {
	var path = require('path');
	var glob = require('glob');
	var fs = require('fs');

	var pattern = "{/*/**/*,/*}";
	var cacheListJson = {};
	cacheListJson.list = [];

	glob(pattern + '.{css,png,js,html,eot,ttf,woff,otf,woff2,gif,jpg}', { ignore: ['/index.html', '/index-taxvision.html', '/index-empiretax.html', '/index-co9.html', '/index-uplus.html', '/index-tsg.html', '/index-siglo.html', '/index-trooblr.html', '/index-incomeusa.html', '/index-incometax.html', '/index-sam.html', '/index-nextworld.html', '/serviceWorker-main.js', '/sw-mtpo', '/sw-taxvision', '/sw-empiretax', '/sw-co9', '/sw-uplus', '/sw-tsg', '/sw-siglo', '/sw-trooblr', '/sw-incomeusa', '/sw-incometax', '/sw-sam', '/sw-nextworld', '/offline/**', '/common/css/**', '/lib/**'], root: 'src/taxAppJs', nomount: true }, function (err, files) {
		for (var index in files) {
			cacheListJson.list.push("/taxAppJs" + files[index]);
		}
		//temporary patch
		cacheListJson.list.push('/taxAppJs/common/css/all.css');

		//
		fs.writeFileSync('./src/taxAppJs/offline/cacheList.json', JSON.stringify(cacheListJson));
	});
});



/**
 * Inject source JS files for Live/Beta to index.html only
 */
gulp.task('devMTPOInjectAppJS', function () {
	//
	var target = gulp.src(config.indexDev);
	//
	var sources = gulp.src(config.jsSource)
		.pipe(angularFilesort());

	//
	return target.pipe(inject(sources, { relative: true }))
		.pipe(gulp.dest('src/taxAppJs/'));
});

/**
 * Inject source JS files for Live/Beta to index-taxvision.html only
 */
gulp.task('devTaxVisionInjectAppJS', function () {
	//
	var target = gulp.src(config.indexTaxvisionDev);
	//
	var sources = gulp.src(config.jsSource)
		.pipe(angularFilesort());

	//
	return target.pipe(inject(sources, { relative: true }))
		.pipe(gulp.dest('src/taxAppJs/'));
});

/**
 * Inject source JS files for Live/Beta to index-empiretax.html only
 */
gulp.task('devEmpireTaxInjectAppJS', function () {
	//
	var target = gulp.src(config.indexEmpireTaxDev);
	//
	var sources = gulp.src(config.jsSource)
		.pipe(angularFilesort());

	//
	return target.pipe(inject(sources, { relative: true }))
		.pipe(gulp.dest('src/taxAppJs/'));
});

/**
 * Inject source JS files for Live/Beta to index-co9.html only
 */
gulp.task('devCo9InjectAppJS', function () {
	//
	var target = gulp.src(config.indexCo9Dev);
	//
	var sources = gulp.src(config.jsSource)
		.pipe(angularFilesort());

	//
	return target.pipe(inject(sources, { relative: true }))
		.pipe(gulp.dest('src/taxAppJs/'));
});

/**
 * Inject source JS files for Live/Beta to index-uplus.html only
 */
gulp.task('devUplusInjectAppJS', function () {
	//
	var target = gulp.src(config.indexUplusDev);
	//
	var sources = gulp.src(config.jsSource)
		.pipe(angularFilesort());

	//
	return target.pipe(inject(sources, { relative: true }))
		.pipe(gulp.dest('src/taxAppJs/'));
});

/**
 * Inject source JS files for Live/Beta to index-tsg-dev.html only
 */
gulp.task('devTSGInjectAppJS', function () {
	//
	var target = gulp.src(config.indexTSGDev);
	//
	var sources = gulp.src(config.jsSource)
		.pipe(angularFilesort());

	//
	return target.pipe(inject(sources, { relative: true }))
		.pipe(gulp.dest('src/taxAppJs/'));
});

/**
 * Inject source JS files for Live/Beta to index-siglo-dev.html only
 */
gulp.task('devSigloInjectAppJS', function () {
	//
	var target = gulp.src(config.indexSigloDev);
	//
	var sources = gulp.src(config.jsSource)
		.pipe(angularFilesort());

	//
	return target.pipe(inject(sources, { relative: true }))
		.pipe(gulp.dest('src/taxAppJs/'));
});

/**
 * Inject source JS files for Live/Beta to index-trooblr-dev.html only
 */
gulp.task('devTrooblrInjectAppJS', function () {
	//
	var target = gulp.src(config.indexTrooblrDev);
	//
	var sources = gulp.src(config.jsSource)
		.pipe(angularFilesort());

	//
	return target.pipe(inject(sources, { relative: true }))
		.pipe(gulp.dest('src/taxAppJs/'));
});

/**
 * Inject source JS files for Live/Beta to index-incomeusa-dev.html only
 */
gulp.task('devIncomeusaInjectAppJS', function () {
	//
	var target = gulp.src(config.indexIncomeusaDev);
	//
	var sources = gulp.src(config.jsSource)
		.pipe(angularFilesort());

	//
	return target.pipe(inject(sources, { relative: true }))
		.pipe(gulp.dest('src/taxAppJs/'));
});

/**
 * Inject source JS files for Live/Beta to index-sam-dev.html only
 */
gulp.task('devSamInjectAppJS', function () {
	//
	var target = gulp.src(config.indexSamDev);
	//
	var sources = gulp.src(config.jsSource)
		.pipe(angularFilesort());

	//
	return target.pipe(inject(sources, { relative: true }))
		.pipe(gulp.dest('src/taxAppJs/'));
});

/**
 * Inject source JS files for Live/Beta to index-incometax-dev.html only
 */
gulp.task('devIncomeTaxInjectAppJS', function () {
	//
	var target = gulp.src(config.indexIncomeTaxDev);
	//
	var sources = gulp.src(config.jsSource)
		.pipe(angularFilesort());

	//
	return target.pipe(inject(sources, { relative: true }))
		.pipe(gulp.dest('src/taxAppJs/'));
});

/**
 * Inject source JS files for Live/Beta to index-incometax-dev.html only
 */
gulp.task('devNextWorldInjectAppJS', function () {
	//
	var target = gulp.src(config.indexNextWorldDev);
	//
	var sources = gulp.src(config.jsSource)
		.pipe(angularFilesort());

	//
	return target.pipe(inject(sources, { relative: true }))
		.pipe(gulp.dest('src/taxAppJs/'));
});

/**
 * 
 */
gulp.task('devInjectAppJS', gulp.series('devMTPOInjectAppJS', 'devTaxVisionInjectAppJS', 'devEmpireTaxInjectAppJS', 'devCo9InjectAppJS', 'devUplusInjectAppJS', 'devTSGInjectAppJS', 'devSigloInjectAppJS', 'devTrooblrInjectAppJS', 'devIncomeusaInjectAppJS', 'devSamInjectAppJS', 'devIncomeTaxInjectAppJS', 'devNextWorldInjectAppJS'));

/**
 * Inject source JS files for Development environment (local) to index-dev.html
 * please pass NODE_ENV variable like 'gulp deployMTPOInjectAppJS --NODE_ENV production'  production/test/local
 */
gulp.task('deployMTPOInjectAppJS', gulp.series('appMinify'), function () {
	//
	var target = gulp.src(config.index);
	//
	var sources = gulp.src(config.deployInjectAppJS, { read: false });

	//
	return target.pipe(inject(sources, { relative: true }))
		.pipe(gulp.dest('src/taxAppJs/'));
});

/**
 * Inject source JS files for Development environment (local) index-taxvision-dev.html
 * please pass NODE_ENV variable like 'gulp deployTaxVisionInjectAppJS --NODE_ENV production'  production/test/local
 */
gulp.task('deployTaxVisionInjectAppJS', gulp.series('appMinify'), function () {
	//
	var target = gulp.src(config.indexTaxvision);
	//
	var sources = gulp.src(config.deployInjectAppJS, { read: false });

	//
	return target.pipe(inject(sources, { relative: true }))
		.pipe(gulp.dest('src/taxAppJs/'));
});

/**
 * Inject source JS files for Development environment (local) index-empiretax-dev.html
 * please pass NODE_ENV variable like 'gulp deployEmpireTaxInjectAppJS --NODE_ENV production'  production/test/local
 */
gulp.task('deployEmpireTaxInjectAppJS', gulp.series('appMinify'), function () {
	//
	var target = gulp.src(config.indexEmpireTax);
	//
	var sources = gulp.src(config.deployInjectAppJS, { read: false });

	//
	return target.pipe(inject(sources, { relative: true }))
		.pipe(gulp.dest('src/taxAppJs/'));
});


/**
 * Inject source JS files for Development environment (local) index-co9-dev.html
 * please pass NODE_ENV variable like 'gulp deployCo9InjectAppJS --NODE_ENV production'  production/test/local
 */
gulp.task('deployCo9InjectAppJS', gulp.series('appMinify'), function () {
	//
	var target = gulp.src(config.indexCo9);
	//
	var sources = gulp.src(config.deployInjectAppJS, { read: false });

	//
	return target.pipe(inject(sources, { relative: true }))
		.pipe(gulp.dest('src/taxAppJs/'));
});


/**
 * Inject source JS files for Development environment (local) index-uplus-dev.html
 * please pass NODE_ENV variable like 'gulp deployUplusInjectAppJS --NODE_ENV production'  production/test/local
 */
gulp.task('deployUplusInjectAppJS', gulp.series('appMinify'), function () {
	//
	var target = gulp.src(config.indexUplus);
	//
	var sources = gulp.src(config.deployInjectAppJS, { read: false });

	//
	return target.pipe(inject(sources, { relative: true }))
		.pipe(gulp.dest('src/taxAppJs/'));
});

/**
 * Inject source JS files for Development environment (local) index-tsg.html
 * please pass NODE_ENV variable like 'gulp deployTSGInjectAppJS --NODE_ENV production'  production/test/local
 */
gulp.task('deployTSGInjectAppJS', gulp.series('appMinify'), function () {
	//
	var target = gulp.src(config.indexTSG);
	//
	var sources = gulp.src(config.deployInjectAppJS, { read: false });

	//
	return target.pipe(inject(sources, { relative: true }))
		.pipe(gulp.dest('src/taxAppJs/'));
});

/**
 * Inject source JS files for Development environment (local) index-siglo.html
 * please pass NODE_ENV variable like 'gulp deploySigloInjectAppJS --NODE_ENV production'  production/test/local
 */
gulp.task('deploySigloInjectAppJS', gulp.series('appMinify'), function () {
	//
	var target = gulp.src(config.indexSiglo);
	//
	var sources = gulp.src(config.deployInjectAppJS, { read: false });

	//
	return target.pipe(inject(sources, { relative: true }))
		.pipe(gulp.dest('src/taxAppJs/'));
});

/**
 * Inject source JS files for Development environment (local) index-trooblr.html
 * please pass NODE_ENV variable like 'gulp deployTrooblrInjectAppJS --NODE_ENV production'  production/test/local
 */
gulp.task('deployTrooblrInjectAppJS', gulp.series('appMinify'), function () {
	//
	var target = gulp.src(config.indexTrooblr);
	//
	var sources = gulp.src(config.deployInjectAppJS, { read: false });

	//
	return target.pipe(inject(sources, { relative: true }))
		.pipe(gulp.dest('src/taxAppJs/'));
});

/**
 * Inject source JS files for Development environment (local) index-incomeusa.html
 * please pass NODE_ENV variable like 'gulp deployIncomeusaInjectAppJS --NODE_ENV production'  production/test/local
 */
gulp.task('deployIncomeusaInjectAppJS', gulp.series('appMinify'), function () {
	//
	var target = gulp.src(config.indexIncomeusa);
	//
	var sources = gulp.src(config.deployInjectAppJS, { read: false });

	//
	return target.pipe(inject(sources, { relative: true }))
		.pipe(gulp.dest('src/taxAppJs/'));
});

/**
 * Inject source JS files for Development environment (local) index-sam.html
 * please pass NODE_ENV variable like 'gulp deploySamInjectAppJS --NODE_ENV production'  production/test/local
 */
gulp.task('deploySamInjectAppJS', gulp.series('appMinify'), function () {
	//
	var target = gulp.src(config.indexSam);
	//
	var sources = gulp.src(config.deployInjectAppJS, { read: false });

	//
	return target.pipe(inject(sources, { relative: true }))
		.pipe(gulp.dest('src/taxAppJs/'));
});

/**
 * Inject source JS files for Development environment (local) index-incometax.html
 * please pass NODE_ENV variable like 'gulp deployIncomeTaxInjectAppJS --NODE_ENV production'  production/test/local
 */
gulp.task('deployIncomeTaxInjectAppJS', gulp.series('appMinify'), function () {
	//
	var target = gulp.src(config.indexIncomeTax);
	//
	var sources = gulp.src(config.deployInjectAppJS, { read: false });

	//
	return target.pipe(inject(sources, { relative: true }))
		.pipe(gulp.dest('src/taxAppJs/'));
});

/**
 * Inject source JS files for Development environment (local) index-nextworld.html
 * please pass NODE_ENV variable like 'gulp deployNextWorldInjectAppJS --NODE_ENV production'  production/test/local
 */
gulp.task('deployNextWorldInjectAppJS', gulp.series('appMinify'), function () {
	//
	var target = gulp.src(config.indexNextWorld);
	//
	var sources = gulp.src(config.deployInjectAppJS, { read: false });

	//
	return target.pipe(inject(sources, { relative: true }))
		.pipe(gulp.dest('src/taxAppJs/'));
});

/**
 * Inject source JS files for Development environment (local)
 */
gulp.task('deployInjectAppJS', gulp.series('deployMTPOInjectAppJS', 'deployTaxVisionInjectAppJS', 'deployEmpireTaxInjectAppJS', 'deployCo9InjectAppJS', 'deployUplusInjectAppJS', 'deployTSGInjectAppJS', 'deploySigloInjectAppJS', 'deployTrooblrInjectAppJS', 'deployIncomeusaInjectAppJS', 'deploySamInjectAppJS', 'deployIncomeTaxInjectAppJS', 'deployNextWorldInjectAppJS', 'devInjectAppJS'));


/**
 * Generate offline file list for Live/Beta
 */
gulp.task('deployGenerateOfflineList', function () {
	var path = require('path');
	var glob = require('glob');
	var fs = require('fs');

	var pattern = "{/*/**/*,/*}";
	var cacheListJson = {};
	cacheListJson.list = [];

	return glob(pattern + '.{css,png,html,eot,ttf,woff,otf,woff2,gif,jpg}', { ignore: ['/index.html', '/offline/**', '/common/css/**', '/lib/**'], root: 'src/taxAppJs', nomount: true }, function (err, files) {
		for (var index in files) {
			cacheListJson.list.push("/taxAppJs" + files[index]);
		}
		//temporary patch
		cacheListJson.list.push('/taxAppJs/common/css/all.css');
		cacheListJson.list.push('/taxAppJs/dist/app.min.js', '/taxAppJs/dist/lib.min.js');
		cacheListJson.list.push('/taxAppJs/dist/calc-dist.js', '/taxAppJs/dist/calc-lib-import.js', '/taxAppJs/dist/calc-source-import.js');
		//
		fs.writeFileSync('./src/taxAppJs/offline/cacheList.json', JSON.stringify(cacheListJson));
	});
});

/////////////////////////////////////////////////////////////////////////  OFFLINE //////////////////////////////////////////////////////////////////////

/**
 * This will minify external libs into one
 */
gulp.task('minifyOfflineLibImports', function () {
	return gulp.src(config.offlineLibImports)
		.pipe(concat('offline-lib-import.js'))
		.pipe(uglify())
		.pipe(gulp.dest('src/taxAppJs/dist/'));
});

/**
 * This will minify source files other then main into one
 */
gulp.task('minifyOfflineSourceImports', function () {
	return gulp.src(config.offlineSourceImports)
		.pipe(concat('offline-src-import.js'))
		.pipe(uglify())
		.pipe(gulp.dest('src/taxAppJs/dist/'));
});

/**
 * This will minify main service worker file
 * please pass NODE_ENV variable like 'gulp minifyOfflineSource --NODE_ENV production'  production/test/local
 */
gulp.task('minifyOfflineSource', function () {
	var preprocess = require('gulp-preprocess');

	// knownOptions taken bcoz we have to take arguments from command line
	var knownOptions = {
		string: 'NODE_ENV'
	};

	var options = minimist(process.argv.slice(2), knownOptions);

	return gulp.src(config.offlineSource)
		.pipe(concat('sw-dist.js'))
		.pipe(preprocess({ context: { NODE_ENV: options.NODE_ENV } }))
		.pipe(uglify())
		.pipe(gulp.dest('src/'));
});

/**
 * Minify Offline files
 * please pass NODE_ENV variable like 'gulp minifyOffline --NODE_ENV production'  production/test/local
 */
gulp.task('minifyOffline', gulp.series('minifyOfflineSource', 'minifyOfflineLibImports', 'minifyOfflineSourceImports'));

/**
 * This will make file like tax-app and common-services for release ready. Do not commit these files on SVN.
 */
gulp.task('singleSWFilesForDeploy', function () {
	var preprocess = require('gulp-preprocess');

	// knownOptions taken bcoz we have to take arguments from command line
	var knownOptions = {
		string: 'NODE_ENV'
	};

	var options = minimist(process.argv.slice(2), knownOptions);

	return gulp.src(config.singleSWFilesForDeploy)
		.pipe(preprocess({ context: { NODE_ENV: options.NODE_ENV } }))
		.pipe(gulp.dest('src/'));
});

/**
 * This will make file like tax-app and common-services for release ready. Do not commit these files on SVN.
 */
gulp.task('singleFilesForDeploy', function () {
	var preprocess = require('gulp-preprocess');

	// knownOptions taken bcoz we have to take arguments from command line
	var knownOptions = {
		string: 'NODE_ENV'
	};

	var options = minimist(process.argv.slice(2), knownOptions);

	return gulp.src(config.singleFilesForDeploy)
		.pipe(preprocess({ context: { NODE_ENV: options.NODE_ENV } }))
		.pipe(gulp.dest('src/taxAppJs/'));
});

gulp.task("filesForDeploy", gulp.series("singleFilesForDeploy", "singleSWFilesForDeploy"));

/**
 * For live/beta. Minify source files, inject in html, generate offline list
 * please pass NODE_ENV variable like 'gulp deployApp --NODE_ENV production'  production/test/local
 */
gulp.task('deployApp', gulp.series('appMinify', 'deployGenerateOfflineList', 'minifyCalc', 'minifyOffline', 'filesForDeploy'));


/**
 * For local. Inject source js files, generate offline list.
 please pass NODE_ENV variable like 'gulp deployApp --NODE_ENV local'  production/test/local
 */
gulp.task('devApp', gulp.series('appMinify', 'devInjectAppJS', 'devGenerateOfflineList'));


//////////////////////////////////////////////////////////////////////  NOT APPROVED /////////////////////////////////////////////////////////////////////







///////////////////////////////////////////////////////////////////// Common Tax App Release //////////////////////////////////////////////////////////////////

/**
 *
 */
gulp.task('zipTaxApp', function () {
	var zip = require('gulp-zip');

	return gulp.src(['taxapp/*', 'taxapp/**/*'], { base: '.' })
		.pipe(zip('taxapp.zip'))
		.pipe(gulp.dest('.'));
});
///////////////////////////////////////////////////////////////////// Beta Tax App Release //////////////////////////////////////////////////////////////////

//For Release
var gulpSSHBeta;


/**
 *
 */
gulp.task('createSSHClientBeta', function () {
	if (gulpSSHBeta == undefined) {
		gulpSSHBeta = new GulpSSH({
			ignoreErrors: false,
			sshConfig: config.sshConfig.beta
		});
	}
});

/**
 *
 */
gulp.task('createUploadfolderBeta', gulp.series('createSSHClientBeta'), function () {
	var _date = moment().format('DDMMMMYYYY');

	return gulpSSHBeta.exec(["mkdir -p /home/development1/Downloads/ReleaseFiles/" + _date + "/Attempt1"]);
});

/**
 *
 */
gulp.task('uploadTaxAppBeta', gulp.series('zipTaxApp', 'createUploadfolderBeta'), function () {
	var _date = moment().format('DDMMMMYYYY');

	return gulp.src("taxapp.zip")
		.pipe(gulpSSHBeta.dest("/home/development1/Downloads/ReleaseFiles/" + _date + "/Attempt1/"));
});

/**
 *
 */
gulp.task('deleteTaxAppZipBeta', gulp.series('uploadTaxAppBeta'), function () {
	return gulp.src('taxapp.zip')
		.pipe(vinylPaths(del))
});

/**
 *
 */
gulp.task('releaseTaxAppBeta', gulp.series('uploadTaxAppBeta', 'deleteTaxAppZipBeta'), function () {
	var _date = moment().format('DDMMMMYYYY');

	return gulpSSHBeta.shell(["/home/development1/Downloads/ScriptsRelease/releaseTaxAppBeta.sh " + _date + " -t"])
		.on('ssh2Data', function (data) {
			process.stdout.write(data.toString());
		});
});



// ///////////////////////////////////////////////////////////////////// Live Tax App Release //////////////////////////////////////////////////////////////////

// //SSH clients for 103 & 105 Servers
// var gulpSSHLive103;
// var gulpSSHLive105;
// var gulpSSHLive93;
// var gulpSSHLive94;

// /**
//  *
//  */
// gulp.task('releaseTaxAppLive', ['releaseTaxAppLive103', 'releaseTaxAppLive105', 'releaseTaxAppLive93', 'releaseTaxAppLive94']);
// /**
//  *
//  */
// gulp.task('releaseTaxAppLive103', ['uploadTaxAppLive', 'deleteTaxAppZipLive'], function () {
// 	var _date = moment().format('DDMMMMYYYY');

// 	return gulpSSHLive103.shell(["echo \"10BftmotdmD\" | su - root /dataHDD/mytaxprepoffice/ScriptsRelease/releaseTaxAppLive.sh " + _date])
// 		.on('ssh2Data', function (data) {
// 			process.stdout.write(data.toString());
// 		});
// });
// /**
//  *
//  */
// gulp.task('releaseTaxAppLive105', ['uploadTaxAppLive', 'deleteTaxAppZipLive'], function () {
// 	var _date = moment().format('DDMMMMYYYY');

// 	return gulpSSHLive105.shell(["echo \"10BftmotdmD\" | su - root /dataHDD/mytaxprepoffice/ScriptsRelease/releaseTaxAppLive.sh " + _date])
// 		.on('ssh2Data', function (data) {
// 			process.stdout.write(data.toString());
// 		});
// });

// /**
//  *
//  */
// gulp.task('releaseTaxAppLive93', ['uploadTaxAppLive', 'deleteTaxAppZipLive'], function () {
// 	var _date = moment().format('DDMMMMYYYY');

// 	return gulpSSHLive93.shell(["echo \"10BftmotdmD\" | su - root /dataHDD/mytaxprepoffice/ScriptsRelease/releaseTaxAppLive.sh " + _date])
// 		.on('ssh2Data', function (data) {
// 			process.stdout.write(data.toString());
// 		});
// });

// /**
//  *
//  */
// gulp.task('releaseTaxAppLive94', ['uploadTaxAppLive', 'deleteTaxAppZipLive'], function () {
// 	var _date = moment().format('DDMMMMYYYY');

// 	return gulpSSHLive94.shell(["echo \"10BftmotdmD\" | su - root /dataHDD/mytaxprepoffice/ScriptsRelease/releaseTaxAppLive.sh " + _date])
// 		.on('ssh2Data', function (data) {
// 			process.stdout.write(data.toString());
// 		});
// });

// /**
//  *
//  */
// gulp.task('deleteTaxAppZipLive', ['uploadTaxAppLive'], function () {
// 	return gulp.src('taxapp.zip')
// 		.pipe(vinylPaths(del))
// });

// /**
//  * Task to create SSH client for 103 Server
//  */
// gulp.task('createSSHClientLive103', function () {
// 	if (gulpSSHLive103 == undefined) {
// 		gulpSSHLive103 = new GulpSSH({
// 			ignoreErrors: false,
// 			sshConfig: config.sshConfig.live103
// 		});
// 	}
// });

// /**
//  * Task to create SSH client for 105 Server
//  */
// gulp.task('createSSHClientLive105', function () {
// 	if (gulpSSHLive105 == undefined) {
// 		gulpSSHLive105 = new GulpSSH({
// 			ignoreErrors: false,
// 			sshConfig: config.sshConfig.live105
// 		});
// 	}
// });

// /**
//  * Task to create SSH client for 93 Server
//  */
// gulp.task('createSSHClientLive93', function () {
// 	if (gulpSSHLive93 == undefined) {
// 		gulpSSHLive93 = new GulpSSH({
// 			ignoreErrors: false,
// 			sshConfig: config.sshConfig.live93
// 		});
// 	}
// });

// /**
//  * Task to create SSH client for 94 Server
//  */
// gulp.task('createSSHClientLive94', function () {
// 	if (gulpSSHLive94 == undefined) {
// 		gulpSSHLive94 = new GulpSSH({
// 			ignoreErrors: false,
// 			sshConfig: config.sshConfig.live94
// 		});
// 	}
// });

// /**
//  * This task will create Attempt folder (date wise) on All Live server
//  */
// gulp.task('createUploadfolderLive', ['createUploadfolderLive103', 'createUploadfolderLive105', 'createUploadfolderLive93', 'createUploadfolderLive94']);

// /**
//  * This task will create Attempt folder (date wise) on 103 Live server
//  */
// gulp.task('createUploadfolderLive103', ['createSSHClientLive103'], function () {
// 	var _date = moment().format('DDMMMMYYYY');

// 	return gulpSSHLive103.exec(["mkdir -p /dataHDD/Release/" + _date + "/Attempt1"]);
// });

// /**
//  * This task will create Attempt folder (date wise) on 105 Live server
//  */
// gulp.task('createUploadfolderLive105', ['createSSHClientLive105'], function () {
// 	var _date = moment().format('DDMMMMYYYY');

// 	return gulpSSHLive105.exec(["mkdir -p /dataHDD/Release/" + _date + "/Attempt1"]);
// });


// /**
//  * This task will create Attempt folder (date wise) on 93 Live server
//  */
// gulp.task('createUploadfolderLive93', ['createSSHClientLive93'], function () {
// 	var _date = moment().format('DDMMMMYYYY');

// 	return gulpSSHLive93.exec(["mkdir -p /dataHDD/Release/" + _date + "/Attempt1"]);
// });

// /**
//  * This task will create Attempt folder (date wise) on 94 Live server
//  */
// gulp.task('createUploadfolderLive94', ['createSSHClientLive94'], function () {
// 	var _date = moment().format('DDMMMMYYYY');

// 	return gulpSSHLive94.exec(["mkdir -p /dataHDD/Release/" + _date + "/Attempt1"]);
// });


// /**
//  * This task will upload tax app zip file on all Live servers
//  */
// gulp.task('uploadTaxAppLive', ['uploadTaxAppLive103', 'uploadTaxAppLive105', 'uploadTaxAppLive93', 'uploadTaxAppLive94']);
// /**
//  * This task will upload tax app zip file on 103 Live server
//  */
// gulp.task('uploadTaxAppLive103', ['zipTaxApp', 'createUploadfolderLive'], function () {
// 	var _date = moment().format('DDMMMMYYYY');

// 	return gulp.src("taxapp.zip")
// 		.pipe(gulpSSHLive103.dest("/dataHDD/Release/" + _date + "/Attempt1/"));
// });
// /**
//  * This task will upload tax app zip file on 105 Live server
//  */
// gulp.task('uploadTaxAppLive105', ['zipTaxApp', 'createUploadfolderLive'], function () {
// 	var _date = moment().format('DDMMMMYYYY');

// 	return gulp.src("taxapp.zip")
// 		.pipe(gulpSSHLive105.dest("/dataHDD/Release/" + _date + "/Attempt1/"));
// });

// /**
//  * This task will upload tax app zip file on 93 Live server
//  */
// gulp.task('uploadTaxAppLive93', ['zipTaxApp', 'createUploadfolderLive'], function () {
// 	var _date = moment().format('DDMMMMYYYY');

// 	return gulp.src("taxapp.zip")
// 		.pipe(gulpSSHLive93.dest("/dataHDD/Release/" + _date + "/Attempt1/"));
// });

// /**
//  * This task will upload tax app zip file on 94 Live server
//  */
// gulp.task('uploadTaxAppLive94', ['zipTaxApp', 'createUploadfolderLive'], function () {
// 	var _date = moment().format('DDMMMMYYYY');

// 	return gulp.src("taxapp.zip")
// 		.pipe(gulpSSHLive94.dest("/dataHDD/Release/" + _date + "/Attempt1/"));
// });




/**
 * This will minify main service worker file for Live
 */
/*gulp.task('minifyOfflineSourceLive',function(){
	var preprocess = require('gulp-preprocess');

	return gulp.src(config.offlineSource)
		.pipe(concat('sw-dist.js'))
		.pipe(preprocess({context:{NODE_ENV:'production'}}))
		.pipe(uglify())
		.pipe(gulp.dest('taxapp/'));
});*/


//
/*gulp.task('testing',function(){
    var through2 = require('through2');
    var insert = require('gulp-insert');
    var fs = require('fs');

    gulp.src(config.jsSource)
        .pipe(through2.obj(function(chunk, enc, cb){
            insert.append(chunk.path);
            this.push(chunk.path+'\n');
            cb();
        })).pipe(fs.createWriteStream('testing.txt'));
});*/

/*gulp.task('minifyOffline',function(){
	//knownOptions taken bcoz we have to take arguments from command line
	var knownOptions = {
			string: 'path',
			string: 'fileName'
	};

	var options = minimist(process.argv.slice(2), knownOptions);


	var path = options.path;
	var fileName = options.fileName;

	gulp.src(path+fileName)
	.pipe(uglify({mangle: {toplevel: true}}))
	.pipe(dest(path,{ext:'.min.js'}))
	.pipe(gulp.dest('./'));
});*/




/*gulp.task('generateHTML',function(){
	bucket.get('RE-4dc601df-dc0e-4a7a-857d-9493ba33a223', function(err, result) {
	    if (err) throw err;

	    console.log(result.value);
	    // {name: Frank}
	  });
});*/
