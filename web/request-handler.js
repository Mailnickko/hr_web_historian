var path = require('path');
var archive = require('../helpers/archive-helpers');
var url = require('url');
var fs = require('fs');
var httpHelpers = require('./http-helpers.js');
var fetcher = require('../workers/htmlfetcher.js')
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  var pathurl = url.parse(req.url).pathname;
  var noSlashUrl = pathurl.replace('/', '');
  if (req.method === 'GET') {
    if (pathurl === '/') {
      httpHelpers.serveAssets(res, archive.paths.index, 200);
    } else {
      if (archive.isUrlArchived(noSlashUrl, function(exists) {
        if (exists) {
          console.log('exists!');
          httpHelpers.serveAssets(res, archive.paths.archivedSites + pathurl, 200);
        } else {
          httpHelpers.serveAssets(res, archive.paths.index, 404);
        }
      })){}
    }
  } else if (req.method === 'POST') {
    httpHelpers.collectData(req, function(data) {
      var url = data.split('=')[1];
      archive.isUrlInList(url, function(found) {
        if (found) {
          archive.isUrlArchived(url, function(exists) {
            //if it exists in archives serve it up
            if (exists) {
              httpHelpers.serveAssets(res, archive.paths.archivedSites + pathurl, 200);
            } else {
                //TODO add it to archives
                //for now load loading page
              httpHelpers.serveAssets(res, archive.paths.siteAssets + '/loading.html', 302);
            }
          })
          //it not in url list
        } else {
          archive.addUrlToList(url, function() {
            httpHelpers.serveAssets(res, archive.paths.siteAssets + '/loading.html', 302);
            fetcher.putInArchives();
          })
        }
      })
    })
  }

};
