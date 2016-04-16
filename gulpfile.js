var gulp = require('gulp')
, $ = require('gulp-load-plugins')()
, path = require('path')
, distDir = path.join(__dirname, 'htdoc')
, scriptDir = path.join(distDir, 'scripts')
, del = require('del')
, connect = require('connect')
, serveStatic = require('serve-static')
, connectLiveReload = require('connect-livereload')
, webpack = require('webpack')
, bundler = webpack({
  entry: {
    'app-react': './src/app-react.js',
    'app-flux': './src/app-flux.js'
  },
  devtool: 'inline-source-map',
  output: {
    path: scriptDir,
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  }
});

gulp.task('clean', del.bind(null, [path.join(scriptDir, '/*.js')]));

gulp.task('js:dev', cb => {
  bundler.run((err, stats) => {
    if (err) {
      throw new $.util.PluginError('webpack:build', err);
    }
    $.util.log('[webpack:build]', stats.toString({
      colors: true,
      chunkModules: false
    }));
    cb();
    $.livereload.reload();
  });
});

gulp.task('serve', () => {
  var port = process.env.PORT || 3000;
  $.livereload.listen();
  connect()
  .use(connectLiveReload())
  .use(serveStatic(distDir))
  .listen(port);
});

gulp.task('dev', ['js:dev', 'serve'], () => {
  var reload = $.livereload.reload;
  gulp.watch('htdoc/*.html', reload);
  gulp.watch('src/**/*.js', ['js:dev']);
});

gulp.task('default', ['clean'], () => {
  gulp.start('dev');
});
