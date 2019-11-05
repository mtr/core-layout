'use strict';

import angular from 'angular';

import multiColumnDynamicHtml from './multi-column-dynamic.html';

/* @ngInject */
function MultiColumnDynamicController($scope, $log) {
    const _index = {};

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
                template: multiColumnDynamicHtml,
                controller: 'MultiColumnDynamicController'
            }
        }

    });
}

export default angular.module('myApp.demos.multiColumnDynamic', [])
    .config(config)
    .controller('MultiColumnDynamicController', MultiColumnDynamicController)
    .name;
