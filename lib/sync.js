/* jshint node:true */
"use strict";
var fs = require('fs-extra');
var path = require('path');

module.exports = function sync(source, target, spaces) {

  if ( ! source || ! target)
    throw new Error('source or target is missing');

  var sourcePath = path.resolve(process.cwd(), source);
  var targetPath = path.resolve(process.cwd(), target);
  var options = { spaces: (spaces || 0) };

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

  var targetJson = fs.readJsonSync(targetPath);
  var key;

  for (key in targetJson) {
    if (key in sourceJson) continue;
    delete targetJson[key];
  }

  for (key in sourceJson) {
    if (key in targetJson) continue;
    targetJson[key] = sourceJson[key];
  }

  fs.writeJsonSync(targetPath, targetJson, options);

  console.log('synced '+source+' to '+target);
}

