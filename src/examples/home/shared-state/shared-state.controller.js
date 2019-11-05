'use strict';

import angular from 'angular';

import sharedStateService from "./shared-state.service.js";

/* @ngInject */
function SharedStateController($scope, $log, sharedState) {
    $log.debug('Initialized SharedStateController');
    $scope.state = sharedState.state;
}

export default angular.module('myApp.sharedState.SharedStateController', [
        sharedStateService
    ])
    .controller('SharedStateController', SharedStateController)
    .name;
