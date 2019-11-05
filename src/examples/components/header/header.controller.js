'use strict';

import angular from 'angular';

/* @ngInject */
function HeaderController($scope, $window, $interval, iScrollService,
                          coreLayoutService) {
    $scope.iScrollState = iScrollService.state;
    $scope.toggleIScroll = iScrollService.toggle;

    $scope.toggleDrawer = coreLayoutService.toggleDrawer;

    $scope.demos = [
        {
            state: 'demos.staticList',
            name: 'Static List'
        },
        {
            state: 'demos.ngRepeatList',
            name: 'ngRepeat List'
        },
        {
            state: 'demos.multiColumnDynamic',
            name: 'Multi-column'
        }
    ];

    const promise = $interval(function _checkBrowserSync() {
        $scope.browserSync = !!$window.___browserSync___;
    }, 250);

    $scope.$on('$destroy', function _cleanUp() {
        $interval.cancel(promise);
    });
}

export default angular.module('myApp.header.HeaderController', [])
    .controller('HeaderController', HeaderController)
    .name;
