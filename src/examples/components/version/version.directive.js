'use strict';

import angular from 'angular';

/* @ngInject */
function currentVersion(version, buildTimestamp) {
    function _link(scope, element, attrs) {
        element.text(attrs[directiveDefinition.name] === 'full' ?
        version + ' (' + buildTimestamp + ')' : version);
    }

    var directiveDefinition = {
        link: _link
    };

    return directiveDefinition;
}

export default angular.module('myApp.version.directive', [])
    .directive('currentVersion', currentVersion)
    .name;
