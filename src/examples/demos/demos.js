'use strict';

var angular = require('angular-x');

/* @ngInject */
function config($stateProvider) {
    $stateProvider.state({
        name: 'demos',
        url: '/demos',
        abstract: true,
        views: {
            'left-drawer-header@': {
                templateUrl: 'components/drawer/left-drawer.header.html'
            },
            'left-drawer-contents@': {
                templateUrl: 'components/drawer/left-drawer.html',
                controller: 'DrawerController'
            },
            'left-drawer-footer@': {
                templateUrl: 'components/drawer/left-drawer.footer.html'
            },
            'right-drawer-header@': {
                templateUrl: 'components/drawer/right-drawer.header.html'
            },
            'right-drawer-contents@': {
                templateUrl: 'components/drawer/right-drawer.html',
                controller: 'DrawerController'
            },
            'right-drawer-footer@': {
                templateUrl: 'components/drawer/right-drawer.footer.html'
            },
            'main-header@': {
                templateUrl: 'components/header/header.html',
                controller: 'HeaderController'
            },
            'main-footer@': {
                templateUrl: 'components/footer/footer.html'
            }
        }
    });
}

module.exports = angular.module('myApp.demos', [
    require('./static-list/static-list.js').name,
    require('./ng-repeat-list/ng-repeat-list.js').name,
    require('./multi-column-dynamic/multi-column-dynamic.js').name
])
    .config(config);
