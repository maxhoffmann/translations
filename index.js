"use strict";
var t = require('fuchs-template');

var variableRegex = /\{[\w-]+?\}/g;

module.exports = function translations(locale) {

  if (typeof locale !== 'object')
    throw new Error('The locale has to be a json file or an object.');

  var invalidLocale = Object.keys(locale).some(function(key) {
    return typeof locale[key] !== 'string';
  });

  if (invalidLocale)
    throw new Error('The locale json file has to be a map of strings to strings.');

  return function(key, values) {

    if (typeof locale[key] !== 'string')
      throw new Error('There is no translation for the key "'+key+'" in this locale.');

    var result = t(locale[key], values);

    if (variableRegex.test(result)) {
      var undefinedVariables = result.match(variableRegex)
        .map(function(variable) {
          return variable.slice(1,-1);
        })
        .join(', ');
      throw new Error('Missing value for '+undefinedVariables)
    }

    return result;
  }
};
