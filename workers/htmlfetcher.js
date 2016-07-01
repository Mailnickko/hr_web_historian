// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers.js');

exports.putInArchives = function() {
  archive.readListOfUrls(function(urls) {
    console.log(urls);
      archive.downloadUrls(urls);
  })
}