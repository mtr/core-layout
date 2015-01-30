'use strict';

var angular = require('angular-x');

console.log('angular', angular);

require('bootstrap');
require('angular-messages');

/* @ngInject */
function config($urlRouterProvider) {
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise('/');
}

function MyAppController(iScrollService, coreLayoutService) {
    var vm = this;  // Use 'controller as' syntax.

    vm.iScrollState = iScrollService.state;
    vm.layout = coreLayoutService.state;
}

console.log("require('angular-ui-router').name", require('angular-ui-router'));
console.log("require('../lib/core-layout.js').name", require('../lib/core-layout.js').name);
console.log("require('angular-messages').name", require('angular-messages'));
console.log("require('./components/header/header.js').name", require('./components/header/header.js').name);
console.log("require('./components/version/version.js').name", require('./components/version/version.js').name);
console.log("require('./demos/demos.js').name", require('./demos/demos.js').name);
console.log("require('./home/home.js').name", require('./home/home.js').name);

angular
    .module('myApp', [
        require('angular-ui-router'),
        require('../../dist/lib/core-layout.js').name,
        'ngMessages',
        require('./components/header/header.js').name,
        require('./components/version/version.js').name,
        require('./demos/demos.js').name,
        require('./home/home.js').name
    ])
    .config(config)
    .controller('MyAppController', MyAppController);

module.exports = angular.module('myApp');
