"use strict";
var t = require('fuchs-template');

var variableRegex = /\{[\w-]+?\}/g;

module.exports = function translations(locale, isDevelopment) {

  if (typeof locale !== 'object')
    throw new Error('The locale has to be an object.');

  var invalidLocale = Object.keys(locale).some(function(key) {
    return typeof locale[key] !== 'string';
  });

  if (isDevelopment && invalidLocale)
    throw new Error('The locale json file has to be a map of strings to strings.');

  return function(key, values) {

    if (typeof locale[key] !== 'string') {
      if ( ! isDevelopment) {
        return '';
      }
      throw new Error('There is no translation for the key "'+key+'" in this locale.')
    }

    var result = t(locale[key], values);

    if (isDevelopment && variableRegex.test(result)) {
      var undefinedVariables = result.match(variableRegex).join(', ');
      throw new Error('Missing value for '+undefinedVariables)
    }

    return result;
  }
};
