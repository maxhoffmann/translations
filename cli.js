/* jshint node:true */
"use strict";
var fs = require('fs-extra');
var path = require('path');

module.exports = function translations(source, target) {

  if ( ! source || ! target)
    throw new Error('source or target is missing');

  var sourcePath = path.resolve(process.cwd(), source);
  var targetPath = path.resolve(process.cwd(), target);

  if ( ! fs.existsSync(sourcePath))
   throw new Error('couldn’t find '+source);

  var sourceJson = fs.readJsonSync(sourcePath);

  var invalidLocale = Object.keys(sourceJson).some(function(key) {
    return typeof sourceJson[key] !== 'string';
  });

  if (invalidLocale)
    throw new Error(source+' has values that are not strings');

  if ( ! fs.existsSync(targetPath)) {
    fs.copySync(sourcePath, targetPath);
    return console.log('copied '+source+' to '+target);
  }
}

