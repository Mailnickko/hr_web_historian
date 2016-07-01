var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt'),
  index: path.join(__dirname, '../web/public/index.html')
};

// exports.paths = {
//   siteAssets: path.resolve( './web/public'),
//   archivedSites: path.resolve( './archives/sites'),
//   list: path.resolve( './archives/sites.txt'),
//   index: path.resolve( './web/public/index.html')
// };

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list,'utf8', function(err, data) {
    //data is the contents of the file
    if (err) {
      throw err;
    }
    console.log('data split', data.split('\n'))
    callback(data.split('\n'));
  })
};

exports.isUrlInList = function(url, callback) {

  return exports.readListOfUrls(function(listArray) {
    if(listArray.indexOf(url) > -1) {
      return callback(true);
    } else {
      callback(false);
    }
  })
};

exports.addUrlToList = function(url, callback) {

  fs.appendFile(exports.paths.list, url + '\n', 'utf8', function(err, data) {
      if (err) {
        throw err;
      }
      callback(data);
  })

};

exports.isUrlArchived = function(url, callback) {

  if (fs.existsSync(exports.paths.archivedSites + '/' + url)) {
    callback(true);
  } else {
    //console.log('isUrlArchived returning false ',exports.paths.archivedSites + '/' + url);
    callback(false);
  }

};

exports.downloadUrls = function(list) {
  var dest = exports.paths.archivedSites;

  // temp fix for random str at end of array
  list = list.slice(0, list.length-1);

  console.log('DL List',list)

  list.forEach(function(url) {
    var body = '';
    http.get('http://' + url, function(res) {
      res.on('data', function(chunk) {
        body += chunk;
      })
      fs.writeFile(path.join(dest, url), body, function(err) {
        if (err) {
          throw err;
        } else {
          console.log('working?');
        }
      })
    })

  })
};
