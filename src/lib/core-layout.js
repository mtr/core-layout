(function (root, factory) {
    // Using the Universal Module Definition pattern from
    // https://github.com/umdjs/umd/blob/master/returnExports.js
    if (typeof define === 'function' && define.amd) {
        define(['angular', 'angular-iscroll'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('angular'), require('angular-iscroll'));
    } else {
        // Browser globals (root is window)
        root.coreLayout = factory(root.angular, root.angularIscroll);
    }
}(this, function (angular, angularIscroll) {
    'use strict';

    coreLayout = angular
        .module('coreLayout', [
            angularIscroll.name,
            require('./core-layout.modal.js').name,
            require('./core-layout.service.js').name,
            require('./core-layout.directive.js').name,
            require('./core-layout-close.directive.js').name
        ]);

    return coreLayout;
}));
