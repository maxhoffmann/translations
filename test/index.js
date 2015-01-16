"use strict";
var test = require('tape');

var t = require('../');

test('templating works', function(is) {
  var template = 'Hello {name}, how is {thing}?';
  var data = { name: 'Max', thing: 'the weather' };

  var actual = t(template, data);
  var expected = 'Hello Max, how is the weather?';

  is.equal(actual, expected);
  is.end();
});
