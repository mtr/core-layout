'use strict';

var angular = require('angular-x');

require('bootstrap');
require('angular-messages');

/* @ngInject */
function config($urlRouterProvider) {
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise('/');
}

function MyAppController($document, $window, $timeout, iScrollService, coreLayoutService) {
    var vm = this;  // Use 'controller as' syntax.

    vm.iScrollState = iScrollService.state;
    vm.layout = coreLayoutService.state;

    function _nullScroll() {
        $window.scrollTo($document.body.scrollLeft, $document.body.scrollTop);
    }

    $document.on('blur', 'input, textarea', function () {
        $timeout(_nullScroll, 0);
    });

    angular.element($window).on('load', function () {
        $timeout(_nullScroll, 0);
    });

}

angular
    .module('myApp', [
        require('angular-ui-router'),
        require('../../dist/lib/core-layout.js').name,
        'ngMessages',
        require('./components/drawer/drawer.js').name,
        require('./components/header/header.js').name,
        require('./components/version/version.js').name,
        require('./demos/demos.js').name,
        require('./home/home.js').name
    ])
    .config(config)
    .controller('MyAppController', MyAppController);

module.exports = angular.module('myApp');
