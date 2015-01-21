/* jshint node:true */
"use strict";
var fs = require('fs-extra');
var path = require('path');

module.exports = function _export(relativeInputDirectory, relativeOutputDirectory, options) {
  options = options || {};
  var variable = options.variable || 'window.locale';

  if ( ! relativeInputDirectory || ! relativeOutputDirectory)
    throw new Error('inputDirectory or outputDirectory is missing');

  var inputDirectory  = path.resolve(process.cwd(), relativeInputDirectory);
  var outputDirectory = path.resolve(process.cwd(), relativeOutputDirectory);

  if ( ! fs.existsSync(inputDirectory))
    throw new Error('couldn’t find '+inputDirectory);

  var locales = fs.readdirSync(inputDirectory).filter(function(file) {
    return path.extname(file) === '.json';
  });

  if ( ! locales.length)
    throw new Error(inputDirectory + ' has no locales');

  locales = locales
    .map(function(file) {
      return {
        fileName: path.basename(file, '.json'),
        content: fs.readJsonSync(path.resolve(inputDirectory, file))
      };
    })
    .filter(function(locale) {
      var isValid = Object.keys(locale.content).every(function(key) {
        return typeof locale.content[key] === 'string';
      });
      return isValid;
    });

  console.log('found '+locales.length+' valid locales');

  locales.forEach(function(locale) {
    var outputPath = path.resolve(outputDirectory, locale.fileName)+'.js';
    var output = variable + '='+JSON.stringify(locale.content)+';';
    fs.outputFile(outputPath, output);
    console.log('exported '+locale.fileName+'.js to '+relativeOutputDirectory);
  });

}

