/* eslint no-console: 0 */
"use strict";
var fs = require('fs-extra');
var path = require('path');
var chokidar = require('chokidar');

module.exports = function _export(relativeInputDirectory, relativeOutputDirectory, options) {
  options = options || {};
  var variable = options.assign || 'window.locale';
  var watch = options.watch || false;

  if ( ! relativeInputDirectory || ! relativeOutputDirectory) {
    throw new Error('inputDirectory or outputDirectory is missing');
  }

  var inputDirectory  = path.resolve(process.cwd(), relativeInputDirectory);
  var outputDirectory = path.resolve(process.cwd(), relativeOutputDirectory);

  if ( ! fs.existsSync(inputDirectory)) {
    throw new Error('couldn’t find '+inputDirectory);
  }

  var locales = fs.readdirSync(inputDirectory).filter(function(file) {
    return path.extname(file) === '.json';
  });

  if ( ! locales.length) {
    throw new Error(inputDirectory + ' has no locales');
  }

  locales
    .map(getFileInfo)
    .filter(validLocale)
    .forEach(exportLocale);

  if ( ! watch) return;

  var watcher = chokidar.watch('*.json', { cwd: inputDirectory });
  watcher.on('change', function(filepath) {
    try {
      var watchedLocales = [filepath].map(getFileInfo).filter(validLocale);

      if ( ! watchedLocales.length) {
        return console.log(path.relative(process.cwd(), filepath)+' contains values that are not strings');
      }

      watchedLocales.forEach(exportLocale);
    } catch(error) {
      console.error('ERROR exporting '+path.relative(process.cwd(), filepath)+': '+error.message);
    }
  });

  function getFileInfo(file) {
    return {
      fileName: path.basename(file, '.json'),
      content: fs.readJsonSync(path.resolve(inputDirectory, file))
    };
  }

  function validLocale(locale) {
    return Object.keys(locale.content).every(function(key) {
      return typeof locale.content[key] === 'string';
    });
  }

  function exportLocale(locale) {
    var outputPath = path.resolve(outputDirectory, locale.fileName)+'.js';
    var output = variable + '='+JSON.stringify(locale.content)+';';
    fs.outputFile(outputPath, output);
    console.log('exported '+locale.fileName+'.js to '+relativeOutputDirectory);
  }

};
