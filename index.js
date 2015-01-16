"use strict";
var t = require('fuchs-template');

module.exports = function translations(json) {
  return function(input, values) {
    return t(json[input], values);
  }
};
