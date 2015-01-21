"use strict";
var fs = require('fs-extra');
var test = require('tape');

var translations = require('../lib');
var sync = require('../lib/sync');
var _export = require('../lib/export');

test('imported locale', function(is) {
  var english = translations(require('./locales/en'));
  var german = translations(require('./locales/de-DE'));

  var template = 'Hello {name}, how is {thing}?';
  var dataEnglish = { name: 'Max', thing: english('the weather') };
  var dataGerman = { name: 'Max', thing: german('the weather') };

  var actualEnglish = english(template, dataEnglish);
  var expectedEnglish = 'Hello Max, how is the weather?';
  var actualGerman = german(template, dataGerman);
  var expectedGerman = 'Hallo Max, wie ist das Wetter?';

  is.equal(actualEnglish, expectedEnglish, 'is used for translating (en)');
  is.equal(actualGerman, expectedGerman, 'is used for translating (de-DE)');
  is.end();
});

test('invalid locale', function(is) {

  is.throws(function() {
    translations('');
  }, 'throws because of invalid argument');

  // development

  is.throws(function() {
    translations(require('./locales/invalid'), true);
  }, 'throws because of invalid values in development');

  is.throws(function() {
    var en = translations(require('./locales/en'), true);
    en('invalid');
  }, 'throws because of non-existent key in development');

  is.throws(function() {
    var en = translations(require('./locales/en'), true);
    en('Hello {name}, how are you?', {});
  }, 'throws because of missing value in development');

  // production

  is.doesNotThrow(function() {
    translations(require('./locales/invalid'));
  }, 'does not throw because of invalid values in production');

  is.doesNotThrow(function() {
    var en = translations(require('./locales/en'));
    en('invalid');
  }, 'does not throw because of non-existent key in production');

  is.doesNotThrow(function() {
    var en = translations(require('./locales/en'));
    en('Hello {name}, how are you?', {});
  }, 'does not throw because of missing value in production');

  is.end();
});

test('sync throws', function(is) {

  is.throws(function() {
    sync();
  }, 'if no source is passed');

  is.throws(function() {
    sync('source');
  }, 'if no target is passed');

  is.throws(function() {
    sync('not found', 'found');
  }, /find/, 'if source was not found');

  is.throws(function() {
    sync('test/locales/invalid.json', 'found');
  }, /strings/, 'if source has values that are not strings');

  is.end();
});

test('sync copies source if target does not exist yet', function(is) {
  var testTarget = 'test/locales/__test-copy.json';
  is.ok(! fs.existsSync(testTarget), 'target should not exist yet');

  sync('test/locales/en.json', testTarget);

  is.ok(fs.existsSync(testTarget));
  fs.removeSync(testTarget);
  is.end();
});

test('sync syncs source with target if it does already exist', function(is) {
  var testTarget = 'test/locales/__test-sync.json';
  fs.copySync('test/locales/incomplete.json', testTarget);

  sync('test/locales/en.json', testTarget);

  is.ok(fs.existsSync(testTarget));

  var sourceJson = fs.readJsonSync('test/locales/en.json');
  var targetJson = fs.readJsonSync(testTarget);

  is.equal(sourceJson.length, targetJson.length);

  var hasSameKeys = Object.keys(targetJson).every(function(key) {
    return key in sourceJson;
  });

  is.ok(hasSameKeys);

  fs.removeSync(testTarget);
  is.end();
});

test('export throws', function(is) {

  is.throws(function() {
    _export();
  }, 'if no input directory is passed');

  is.throws(function() {
    _export('input directory');
  }, 'if no output directory is passed');

  is.throws(function() {
    _export('not found', 'found');
  }, /find/, 'if input directory was not found');

  is.throws(function() {
    _export('test/empty', 'found');
  }, /no locales/, 'if input directory is empty');

  is.end();
});

test('export exports locales in inputDirectory to outputdirectory', function(is) {
  var testInputDirectory = 'test/input';
  var testOutputDirectory = 'test/exported';

  _export(testInputDirectory, testOutputDirectory, { variable: 'window.testLocale' });

  setTimeout(function() {
    is.ok(fs.existsSync(testOutputDirectory));
    is.ok(fs.readdirSync(testOutputDirectory).length);

    fs.removeSync(testOutputDirectory);

    is.end();
  }, 300)
});
