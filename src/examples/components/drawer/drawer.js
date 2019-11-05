'use strict';

import angular from 'angular';

/* @ngInject */
function DrawerController($scope, iScrollService, coreLayoutService) {
    const _index = {};

    function _getRows(count) {
        if (!_index.hasOwnProperty(count)) {
            _index[count] = new Array(count);
        }
        return _index[count];
    }

    $scope.iScrollState = iScrollService.state;
    $scope.toggleIScroll = iScrollService.toggle;
    $scope.drawers = coreLayoutService.state;

    $scope.getRows = _getRows;
}

export default angular.module('myApp.drawer', [])
    .controller('DrawerController', DrawerController)
    .name;
