'use strict';

import angular from 'angular';

import SharedStateController from "./shared-state/shared-state.controller.js";

import leftDrawerHeaderHtml from '../components/drawer/left-drawer.header.html';
import leftDrawerHtml from '../components/drawer/left-drawer.html';
import leftDrawerFooterHtml from '../components/drawer/left-drawer.footer.html';
import rightDrawerHeaderHtml
    from '../components/drawer/right-drawer.header.html';
import rightDrawerHtml from '../components/drawer/right-drawer.html';
import rightDrawerFooterHtml
    from '../components/drawer/right-drawer.footer.html';
import headerHtml from '../components/header/header.html';

import homeHtml from './home.html';
import openModalFooterHtml from './open-modal.footer.html';

import modalHeaderHtml from './modal.header.html';
import modalFooterHtml from './modal.footer.html';

import firstModalHtml from './first.modal.html';
import firstModalFooterHtml from './first.modal.footer.html';
import secondModalHtml from './second.modal.html';

import smallModalHtml from './small.modal.html';
import smallModalHeaderHtml from './small.modal.header.html';
import smallModalFooterHtml from './small.modal.footer.html';

import sharedStateHeaderHtml from './shared-state/shared-state.header.html';
import sharedStateHtml from './shared-state/shared-state.html';
import sharedStateFooterHtml from './shared-state/shared-state.footer.html';


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
                    template: leftDrawerHeaderHtml
                },
                'left-drawer-contents@': {
                    template: leftDrawerHtml,
                    controller: 'DrawerController'
                },
                'left-drawer-footer@': {
                    template: leftDrawerFooterHtml
                },
                'right-drawer-header@': {
                    template: rightDrawerHeaderHtml
                },
                'right-drawer-contents@': {
                    template: rightDrawerHtml,
                    controller: 'DrawerController'
                },
                'right-drawer-footer@': {
                    template: rightDrawerFooterHtml
                },
                'main-header@': {
                    template: headerHtml,
                    controller: 'HeaderController'
                },
                'main-contents@': {
                    template: homeHtml,
                    controller: 'HomeController'
                },
                'main-footer@': {
                    template: openModalFooterHtml
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
                    template: modalHeaderHtml
                },
                'modal-footer@': {
                    template: modalFooterHtml
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
                    template: firstModalHtml,
                    controller: 'HomeController'
                },
                'modal-footer@': {
                    template: firstModalFooterHtml
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
                    template: secondModalHtml
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
                    template: sharedStateHeaderHtml
                },
                'modal-contents@': {
                    controller: 'SharedStateController',
                    template: sharedStateHtml
                },
                'modal-footer@': {
                    controller: 'SharedStateController',
                    template: sharedStateFooterHtml
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
                    template: smallModalHeaderHtml
                },
                'modal-contents@': {
                    template: smallModalHtml
                },
                'modal-footer@': {
                    template: smallModalFooterHtml
                }
            },
            onEnter: /* @ngInject */ function _updateModal(coreLayoutService) {
                coreLayoutService.updateModal({
                    size: 'small'
                });
            }
        });
}

export default angular.module('myApp.home', [
    SharedStateController
])
    .config(config)
    .controller('HomeController', HomeController)
    .name;
