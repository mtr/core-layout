'use strict';

var angular = require('angular-x');

require('bootstrap');
require('angular-messages');

/* @ngInject */
function config($urlRouterProvider) {
    // For any unmatched url, redirect to '/'.
    $urlRouterProvider.otherwise('/');
}

function MyAppController(iScrollService, coreLayoutService) {
    var vm = this;  // Use 'controller as' syntax.

    vm.iScrollState = iScrollService.state;
    vm.layout = coreLayoutService.state;
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
