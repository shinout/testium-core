'use strict';

var tap = require('tap');
var Gofer = require('gofer');
var Bluebird = require('bluebird');

var initTestium = require('../');

var gofer = new Gofer({
  globalDefaults: {}
});
function fetch(uri, options) {
  return Bluebird.resolve(gofer.fetch(uri, options));
}

tap.test('Init against hello-world', function(t) {
  process.chdir(__dirname + '/../examples/hello-world');
  var testium;
  initTestium()
    .then(function(_testium) { testium = _testium; })
    .then(function() {
      return fetch(testium.getInitialUrl());
    })
    .then(function(result) {
      t.equal(result, '', 'Initial url returns a blank page');
      return fetch(testium.getNewPageUrl('/foo'));
    })
    .then(function(result) {
      t.equal(result, 'Hello Quinn', 'New page url redirects to target');
    })
    .then(function() {
      t.end();
    })
    .then(null, function(error) {
      if (testium) {
        testium.close();
      }
      t.error(error);
      t.end();
    });
});