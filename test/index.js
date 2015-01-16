"use strict";
var fs = require('fs-extra');
var path = require('path');
var test = require('tape');

var translations = require('../');
var cli = require('../cli');

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

test('cli throws', function(is) {

  is.throws(function() {
    cli();
  }, 'if no source is passed');

  is.throws(function() {
    cli('source');
  }, 'if no target is passed');

  is.throws(function() {
    cli('not found', 'found');
  }, /find/, 'if source was not found');

  is.throws(function() {
    cli('test/locales/invalid.json', 'found');
  }, /strings/, 'if source has values that are not strings');

  is.end();
});

test('cli', function(is) {
  var testTarget = 'test/locales/__test.json';
  is.ok(! fs.existsSync(path.resolve(process.cwd(), testTarget)), 'target should not exist yet');

  cli('test/locales/en.json', testTarget);

  is.ok(fs.existsSync(path.resolve(process.cwd(), testTarget)), 'copies source if target does not exist yet');
  fs.removeSync(testTarget);


  is.end();
});
