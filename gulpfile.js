const { src, dest, parallel, series, watch } = require('gulp');
const browserSync =  require('browser-sync').create();
const concat =       require('gulp-concat');
const uglify =       require('gulp-uglify-es').default;
const sass =         require('gulp-sass')(require('sass'));
const cleanCss =     require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const imagemin =     require('gulp-imagemin');
const newer =        require('gulp-newer');

function browserSyncFunc() {
    browserSync.init({
        server: { baseDir: 'app/' },
        notify: false,
        online: true
    })
}

function scripts() {
    return src([
        'node_modules/jquery/dist/jquery.min.js',
        'app/js/app.js'
    ])
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js/'))
    .pipe(browserSync.stream())
}

function styles() {
    return src('app/sass/main.scss')
    .pipe(sass())
    .pipe(concat('app.min.css'))
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
    .pipe(cleanCss(( { level: { 1: { specialComments: 0 } } /*, format: 'beautify'*/ } )))
    .pipe(dest('app/css/'))
    .pipe(browserSync.stream())
}

function images() {
    return src('app/images/src/*')
    .pipe(newer('app/images/dest/'))
    .pipe(imagemin())
    .pipe(dest('app/images/dest/'))
}

function buildCopy () {
    return src([
        'app/css/**/*.min.css',
        'app/js/**/*.min.js',
        'app/images/dest/**/*',
        'app/**/*.html',
    ])
    .pipe(dest('dist'))
}

function startWatch() {
    watch('app/sass/*.scss', styles);
    watch(['app/**/*.js', '!app/**/*.min.js'], scripts);
    watch('app/**/*.html').on('change', browserSync.reload);
    watch('app/images/src/*', images)
}

exports.browsersync = browserSyncFunc; 
exports.scripts = scripts;
exports.styles = styles;
exports.images = images;
exports.build = series(styles, scripts, images, buildCopy);

exports.default = parallel(styles, scripts, browserSyncFunc, startWatch)
// если нужно, создать таски удаления(очищения) dist, dest с помощью del.