'use strict';

import angular from 'angular';

import statisListHtml from './static-list.html';

/* @ngInject */
function StaticListController($scope, $log) {
    $scope.registration = {
        email: null,
        password: null,
        remember: null
    };
}

/* @ngInject */
function config($stateProvider) {
    $stateProvider.state({
        name: 'demos.staticList',
        url: '/staticList',
        views: {
            'main-contents@': {
                template: statisListHtml,
                controller: 'StaticListController'
            }
        }
    });
}

export default angular.module('myApp.demos.staticList', [])
    .config(config)
    .controller('StaticListController', StaticListController)
    .name;
