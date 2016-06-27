var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var minifycss = require('gulp-minify-css');
var browserSync = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');

var cssFiles = [
    'blue', 'colorE', 'green', 'lightBlue', 'purple'
];

var cssConfig = {
    prefixerScheme: ['> 1%', 'last 2 versions', 'Android >= 4.0', 'iOS >= 8'],
    writePath: 'css/',
    onsenFileName: 'onsenui',
    onsenComponentsFileName: 'onsen-css-components',
    bhComponentsFileName: 'bh-components',
    bhScenesFileName: 'bh-scenes'
};

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: __dirname,
            index: 'index.html',
            directory: true
        },
        files: [],
        watchOptions: {
            //debounceDelay: 400
        },
        ghostMode: false,
        notify: false
    });
});

gulp.task('js', function(){
    gulp.src('./src/js/*.js')
        .pipe(concat('bhtc-datetimepicker.js'))
        .pipe(gulp.dest('./js/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('./js/'));
});

gulp.task('css', function(){
    for(var i=0, cssFilesLen = cssFiles.length; i<cssFilesLen; i++){
        var skinName = cssFiles[i];
        var writeFilePath = './css/'+skinName;
        gulp.src(['./src/sass/skins/'+skinName+'/color.scss',
            './src/sass/*.scss'])
            .pipe(concat('bhtc-datetimepicker.scss'))
            .pipe(sass().on('error', sass.logError))
            .pipe(autoprefixer({
                browsers: cssConfig.prefixerScheme
            }))
            .pipe(gulp.dest(writeFilePath))
            .pipe(rename({suffix: '.min'}))
            .pipe(minifycss())
            .pipe(gulp.dest(writeFilePath))
    }
});

gulp.task('watch', function () {
    gulp.watch('./src/js/*.js', ['js']);
    gulp.watch('./src/sass/*.scss', ['css']);
});

//默认启动开发模式
gulp.task('default',['watch', 'js', 'css', 'browser-sync'], function(){
    gulp.watch([
        'example/**/*.{js,css,html}',
        'js/**/*.js',
        'css/**/*.css'
    ]).on('change', function (changedFile) {
        gulp.src(changedFile.path)
            .pipe(browserSync.reload({
                stream: true,
                once: true
            }));
    });
});
