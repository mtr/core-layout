'use strict';

import angular from 'angular';

import ngRepeatListHtml from './ng-repeat-list.html';

/* @ngInject */
function NgRepeatListController($scope, $log) {
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
        name: 'demos.ngRepeatList',
        url: '/ngRepeatList',
        views: {
            'main-contents@': {
                template: ngRepeatListHtml,
                controller: 'NgRepeatListController'
            }
        }
    });
}

export default angular.module('myApp.demos.ngRepeatList', [])
    .config(config)
    .controller('NgRepeatListController', NgRepeatListController)
    .name;
