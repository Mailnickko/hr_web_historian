var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

//added extenstions to be able to use the path module
var extensions = {
  '.html': 'text/html',
  '.js': 'text/javascript'
};

var sendResponse = function(res, data, statusCode) {
  stauts = status || 200;
  res.writeHead(res, statusCode);
  res.end(data);
};

exports.collectData = function(req, callback) {
  var data = '';
  req.on('data', function(chunk) {
    data += chunk;
  })
  req.on('end', function() {
    callback(data)
  })
}


//asset will be the extra stuff ater the / in an url
exports.serveAssets = function(res, asset, statusCode) {
  //use fs readFile to read the contents of a file in this case we want to read the public/index.html
  fs.readFile(asset, 'utf8', function(err, data) {
    if (err) {
      throw err;
    }
    res.writeHead(statusCode, headers);
    if (statusCode !== 404) {
      res.end(data);
    } else {
      res.end('Not Working Bitch');
    }
  })
};

  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)

// As you progress, keep thinking about what helper functions you can put here!

exports.headers = headers;