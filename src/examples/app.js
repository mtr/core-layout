'use strict';

import angular from 'angular';
import 'bootstrap-sass';
import uiRouter from '@uirouter/angularjs';
import angularIscroll from 'angular-iscroll';

import coreLayout from '../../dist/lib/core-layout.js';
import ngMessages from 'angular-messages';
import drawer from './components/drawer/drawer.js';
import header from './components/header/header.js';
import version from './components/version/version.js';
import demos from './demos/demos.js';
import home from './home/home.js';
import './scss/style.scss'

/* @ngInject */
function config($urlServiceProvider, iScrollServiceProvider) {
    // For any unmatched url, redirect to '/'.
    $urlServiceProvider.rules.otherwise('/');

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

/* @ngInject */
function MyAppController($rootScope, iScrollService, coreLayoutService) {
    const vm = this;  // Use 'controller as' syntax.

    vm.iScrollState = iScrollService.state;

    if (angular.isDefined(iScrollService.platform)) {
        $rootScope.platform = iScrollService.platform;
    }

    vm.layout = coreLayoutService.state;
}

// import IScroll from 'iscroll';
//console.log('IScroll:', IScroll);

angular.module('myApp', [
    angularIscroll,
    uiRouter,
    coreLayout,
    ngMessages,
    drawer,
    header,
    version,
    demos,
    home
])
    .config(config)
    // .run(function /* @ngInject */ _run($trace) {
    //     $trace.enable();
    // })
    .controller('MyAppController', MyAppController)
    .name;

