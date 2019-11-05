'use strict';

import angular from 'angular';

import StaticListController from "./static-list/static-list.js";
import NgRepeatListController from "./ng-repeat-list/ng-repeat-list.js";
import MultiColumnDynamicController from "./multi-column-dynamic/multi-column-dynamic.js";

import leftDrawerHeaderHtml from '../components/drawer/left-drawer.header.html';
import leftDrawerHtml from '../components/drawer/left-drawer.html';
import leftDrawerFooterHtml from '../components/drawer/left-drawer.footer.html';
import rightDrawerHeaderHtml from '../components/drawer/right-drawer.header.html';
import rightDrawerHtml from '../components/drawer/right-drawer.html';
import rightDrawerFooterHtml from '../components/drawer/right-drawer.footer.html';
import headerHtml from '../components/header/header.html';
import footerHtml from '../components/footer/footer.html';

/* @ngInject */
function config($stateProvider) {
    $stateProvider.state({
        name: 'demos',
        url: '/demos',
        abstract: true,
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
            'main-footer@': {
                template: footerHtml
            }
        }
    });
}

export default angular.module('myApp.demos', [
    StaticListController,
    NgRepeatListController,
    MultiColumnDynamicController
])
    .config(config)
    .name;
