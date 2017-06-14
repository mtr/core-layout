'use strict';

var angular = require('angular-x');

/* @ngInject */
function MultiColumnDynamicController($scope, $log) {
    var _index = {};

    function _getRows(count) {
        if (! _index.hasOwnProperty(count)) {
            _index[count] = new Array(count);
        }
        return _index[count];
    }

    $scope.getRows = _getRows;
}

/* @ngInject */
function config($stateProvider) {
    $stateProvider.state({
        name: 'demos.multiColumnDynamic',
        url: '/multiColumnDynamic',
        views: {
            'main-contents@': {
                templateUrl:
                    'demos/multi-column-dynamic/multi-column-dynamic.html',
                controller: 'MultiColumnDynamicController'
            }
        }

    });
}

module.exports = angular.module('myApp.demos.multiColumnDynamic', [])
    .config(config)
    .controller('MultiColumnDynamicController', MultiColumnDynamicController);
