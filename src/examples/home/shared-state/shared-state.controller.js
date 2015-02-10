'use strict';

var angular = require('angular');

function SharedStateController($scope, $log, sharedState) {
    $log.debug('Initialized SharedStateController');
    $scope.state = sharedState.state;
}

module.exports = angular
    .module('myApp.sharedState.SharedStateController', [
        require('./shared-state.service.js').name
    ])
    .controller('SharedStateController', SharedStateController);
