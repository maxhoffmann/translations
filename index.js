"use strict";
var t = require('fuchs-template');

module.exports = function translations(json) {
  var invalidLocale = Object.keys(json).some(function(key) {
    return typeof json[key] !== 'string';
  })

  if (invalidLocale) {
    throw new Error('The locale json file has to be a map of strings to strings.');
  }

  return function(input, values) {
    return t(json[input], values);
  }
};
