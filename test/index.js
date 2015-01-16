"use strict";
var test = require('tape');

var translations = require('../');

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
