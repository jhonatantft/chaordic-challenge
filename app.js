const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const compressor = require('node-minify');

// chose your port. e.g. node app 5000
const port = process.argv[2] || 8080;

http.createServer(function (req, res) {
  console.log(`${req.method} ${req.url}`);

  const parsedUrl = url.parse(req.url);
  // get URL path
  var pathname = `.${parsedUrl.pathname}`;
  // maps file extention
  const mimeType = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.eot': 'appliaction/vnd.ms-fontobject',
    '.ttf': 'aplication/font-sfnt'
  };
  fs.exists(pathname, function (exist) {
    if(!exist) {
      // file not found, return 404
      res.statusCode = 404;
      res.end(`File ${pathname} not found!`);
      return;
    }
    // look for index.html
    if (fs.statSync(pathname).isDirectory()) {
      pathname += '/index.html';
    }
    // read file from file system
    fs.readFile(pathname, function(err, data){
      if(err){
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        // extract the file extention.
        const ext = path.parse(pathname).ext;
        // set Content-type and send data
        res.setHeader('Content-type', mimeType[ext] || 'text/plain' );
        res.end(data);
      }
    });
  });
}).listen(parseInt(port));

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
console.log(`Server listening on port ${port}`);