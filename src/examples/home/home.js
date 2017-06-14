'use strict';

var angular = require('angular-x');

/* @ngInject */
function HomeController($scope, $log, iScrollService, coreLayoutService) {
    $scope.iScrollState = iScrollService.state;
    $scope.toggleIScroll = iScrollService.toggle;
    $scope.drawers = coreLayoutService.state;
    $scope.toJson = angular.toJson;
}

/* @ngInject */
function config($stateProvider) {
    $stateProvider
        .state({
            name: 'home',
            url: '/',
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
                'main-contents@': {
                    templateUrl: 'home/home.html',
                    controller: 'HomeController'
                },
                'main-footer@': {
                    templateUrl: 'home/open-modal.footer.html'
                }
            },
            onEnter: /* @ngInject */ function _openRightDrawer(coreLayoutService) {
                coreLayoutService.updateDrawer('rightDrawer', {
                    header: {hidden: coreLayoutService.defaultExcept({all: true})},
                    footer: {hidden: coreLayoutService.defaultExcept({all: true})}
                });
            }
        })
        .state({
            name: 'home.modal',
            url: 'modal',
            abstract: true,
            views: {
                'modal-header@': {
                    templateUrl: 'home/modal.header.html'
                },
                'modal-footer@': {
                    templateUrl: 'home/modal.footer.html'
                }
            },
            onEnter: /* @ngInject */ function _openModal(coreLayoutService) {
                //console.log('modal.onEnter');
                coreLayoutService.openModal({
                    header: {visible: {all: true}},
                    footer: {visible: {all: true}},
                    closeTargetState: 'home'
                });
            },
            onExit: /* @ngInject */ function _closeModal(coreLayoutService) {
                //console.log('modal.onExit');
                coreLayoutService.closeModal({
                    closeTargetState: null
                });
            }
        })
        .state({
            name: 'home.modal.first',
            url: '/first',
            views: {
                'modal-contents@': {
                    templateUrl: 'home/first.modal.html',
                    controller: 'HomeController'
                },
                'modal-footer@': {
                    templateUrl: 'home/first.modal.footer.html'
                }
            },
            onEnter: /* @ngInject */ function _updateModal(coreLayoutService) {
                coreLayoutService.updateModal({
                    size: 'large'
                });
            }
        })
        .state({
            name: 'home.modal.second',
            url: '/second',
            views: {
                'modal-contents@': {
                    templateUrl: 'home/second.modal.html'
                }
            },
            onEnter: /* @ngInject */ function _openModal(coreLayoutService) {
                coreLayoutService.updateModal({
                    header: {visible: {all: false, xs: true}}
                });
            },
            onExit: /* @ngInject */ function _closeModal(coreLayoutService) {
                coreLayoutService.updateModal({
                    //header: {visible: {all: true, xs: false}}
                });
            }
        })
        .state({
            name: 'home.modal.shared-state',
            url: '/shared-state',
            views: {
                'modal-header@': {
                    controller: 'SharedStateController',
                    templateUrl: 'home/shared-state/shared-state.header.html'
                },
                'modal-contents@': {
                    controller: 'SharedStateController',
                    templateUrl: 'home/shared-state/shared-state.html'
                },
                'modal-footer@': {
                    controller: 'SharedStateController',
                    templateUrl: 'home/shared-state/shared-state.footer.html'
                }
            },
            onEnter: /* @ngInject */ function _updateModal(coreLayoutService) {
                coreLayoutService.updateModal({
                    size: 'medium'
                });
            }
        })
        .state({
            name: 'home.modal.small',
            url: '/small',
            views: {
                'modal-header@': {
                    templateUrl: 'home/small.modal.header.html'
                },
                'modal-contents@': {
                    templateUrl: 'home/small.modal.html'
                },
                'modal-footer@': {
                    templateUrl: 'home/small.modal.footer.html'
                }
            },
            onEnter: /* @ngInject */ function _updateModal(coreLayoutService) {
                coreLayoutService.updateModal({
                    size: 'small'
                });
            }
        });
}

module.exports = angular
    .module('myApp.home', [
        require('./shared-state/shared-state.controller.js').name
    ])
    .config(config)
    .controller('HomeController', HomeController);
