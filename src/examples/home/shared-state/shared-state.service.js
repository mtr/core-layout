'use strict';

var angular = require('angular');

function sharedState() {
    var _state = {};
    return {
        state: _state
    };
}

module.exports = angular
    .module('myApp.home.sharedState', [])
    .factory('sharedState', sharedState);
