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
