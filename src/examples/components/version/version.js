'use strict';

import angular from 'angular';

import currentVersion from "./version.directive.js";

export default angular.module('myApp.version', [
        currentVersion
    ])
    .value('version', '/* @echo pkg.version */')
    .value('buildTimestamp', '/* @echo now */')
    .name;
