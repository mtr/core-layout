'use strict';

import angular from 'angular';

function sharedState() {
    const _state = {};
    return {
        state: _state
    };
}

export default angular
    .module('myApp.home.sharedState', [])
    .factory('sharedState', sharedState)
    .name;
