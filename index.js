"use strict";
var t = require('fuchs-template');

module.exports = function translations(locale) {
  if (typeof locale !== 'object') {
    throw new Error('The locale has to be a json file or an object.')
  }

  var invalidLocale = Object.keys(locale).some(function(key) {
    return typeof locale[key] !== 'string';
  })

  if (invalidLocale) {
    throw new Error('The locale json file has to be a map of strings to strings.');
  }

  return function(input, values) {
    return t(locale[input], values);
  }
};
