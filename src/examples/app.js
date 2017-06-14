'use strict';

var angular = require('angular-x'),
    _ = require('lodash');

require('bootstrap');
require('angular-messages');

var _platform;

/* @ngInject */
function config($urlServiceProvider, iScrollServiceProvider) {
    // For any unmatched url, redirect to '/'.
    $urlServiceProvider.rules.otherwise('/');

    _platform = iScrollServiceProvider.platform;

    iScrollServiceProvider.configureDefaults({
        iScroll: {
            momentum: true,
            mouseWheel: true,
            preventDefaultException: {
                tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|LABEL|A)$/
            }
        },
        directive: {
            asyncRefreshDelay: 0,
            refreshInterval: false
        }
    });
    /**
     * Alternative method, using Lodash's (deep) merge:
     *
     * _.merge(iScrollServiceProvider.getDefaults(), {
     *   iScroll: {
     *       preventDefaultException: {
     *           tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|LABEL|A)$/
     *       }
     *   }
     * });
     */
}

function MyAppController($rootScope, iScrollService, coreLayoutService) {
    var vm = this;  // Use 'controller as' syntax.

    vm.iScrollState = iScrollService.state;

    if (angular.isDefined(_platform)) {
        $rootScope.platform = _platform;
    }

    vm.layout = coreLayoutService.state;
}

angular
    .module('myApp', [
        require('@uirouter/angularjs').default,
        require('../../dist/lib/core-layout.js').name,
        'ngMessages',
        require('./components/drawer/drawer.js').name,
        require('./components/header/header.js').name,
        require('./components/version/version.js').name,
        require('./demos/demos.js').name,
        require('./home/home.js').name
    ])
    .config(config)
    .run(function _run(/*$trace*/) {
        // $trace.enable();
    })
    .controller('MyAppController', MyAppController);

module.exports = angular.module('myApp');
