var express = require('express');
var app = express();
const compressor = require('node-minify');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/'));

app.get('/', function(request, response) {
  response.send('Hi heroku')
});

compressor.minify({
  compressor: 'uglifyjs',
  input: 'public/js/script.js',
  output: 'public/js/script.min.js',
  callback: function(err, min) {
    console.log('js minified');
  }
});

compressor.minify({
  compressor: 'sqwish',
  input: 'public/css/style.css',
  output: 'public/css/style.min.css',
  callback: function(err, min) {
    console.log('css minified');
  }
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});