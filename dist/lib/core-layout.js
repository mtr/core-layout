/**
 * @license core-layout v0.6.2, 2015-01-30T12:36:58+0100
 * (c) 2015 Martin Thorsen Ranang <mtr@ranang.org>
 * License: MIT
 */
(function (module, window) {'use strict'; module.exports = angular.module('coreLayout.templates', []).run(['$templateCache', function($templateCache) { $templateCache.put("core-layout.html","<div class=\"cl-header\" ui-view=\"{{::names.header}}\"></div><div class=\"cl-contents\" ui-view=\"{{::names.contents}}\"></div><div class=\"cl-footer\" ui-view=\"{{::names.footer}}\"></div>");}]); })(module, window);
(function (root, factory) {
    // Using the Universal Module Definition pattern from
    // https://github.com/umdjs/umd/blob/master/returnExports.js
    if (typeof define === 'function' && define.amd) {
        define(['angular', 'angular-iscroll', 'lodash'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(
            require('angular'),
            require('angular-iscroll'),
            require('lodash'));
    } else {
        // Browser globals (root is window)
        root.coreLayout = factory(
            root.angular,
            root.angularIscroll,
            root.lodash);
    }
}(this, function (angular, angularIScroll, _) {
    'use strict';

    /* @ngInject */
    function CoreLayoutService($rootScope, iScrollService) {
        var _state = {
            /**
             * Different state variables are assigned by core-layout directive
             * instances.
             **/
        };

        function _mergeStateIfProvided(configChanges) {
            if (angular.isDefined(configChanges)) {
                _.merge(_state.modal, configChanges);
            }
        }

        function _openModal(configChanges) {
            _mergeStateIfProvided(configChanges);
            _state.modal.show = true;
        }

        function _updateModal(configChanges) {
            _mergeStateIfProvided(configChanges);
        }

        function _closeModal(configChanges) {
            _state.modal.show = false;
            _mergeStateIfProvided(configChanges);
        }

        function _layoutChanged(name) {
            iScrollService.refresh(name);
        }

        $rootScope.coreLayout = _state;

        return {
            state: _state,
            openModal: _openModal,
            updateModal: _updateModal,
            closeModal: _closeModal,
            layoutChanged: _layoutChanged
        };
    }
    CoreLayoutService.$inject = ["$rootScope", "iScrollService"];

    var defaultsDeep = _.partialRight(_.merge, function deep(value, other) {
        return _.merge(value, other, deep);
    });

    var suffixes = {
        all: '',
        xs: '-xs',
        sm: '-sm',
        md: '-md',
        lg: '-lg'
    };

    function _createSizeSettings(options) {
        options = options || {};
        return {
            all: options.all || false,
            xs: options.xs || false,
            sm: options.sm || false,
            md: options.md || false,
            lg: options.lg || false
        };
    }

    function _trueKeys(result, value, key) {
        if (value === true) {
            result.push(key);
        }
        return result;
    }

    /* @ngInject */
    function coreLayout($rootScope, coreLayoutService) {
        var defaults = {
                show: true,
                header: {
                    visible: _createSizeSettings(),
                    hidden: _createSizeSettings()
                },
                footer: {
                    visible: _createSizeSettings(),
                    hidden: _createSizeSettings()
                }
            },
            cache = {};

        function _addWatcher(attrs, name, area, visibility) {
            var group = name + '.' + area + '.' + visibility;

            $rootScope.$watchCollection('coreLayout.' + group,
                function _updateClasses(newValue) {
                    /**
                     * In lodash v3.0.0, it should be possible to reduce the
                     * following _.reduce() statement to
                     *
                     *   var sizes = _.invert(newValue, true).true;
                     *
                     * by supplying the multiValue flag to _.invert():
                     **/
                    var sizes = _.reduce(newValue, _trueKeys, []),
                        current = cache[group] || [],
                        classPrefix = 'cl-' + area + '-' + visibility,
                        layoutChanged = false;

                    _.each(_.difference(sizes, current), function _addClass(size) {
                        attrs.$addClass(classPrefix + suffixes[size]);
                        layoutChanged = true;
                    });

                    _.each(_.difference(current, sizes), function _removeClass(size) {
                        attrs.$removeClass(classPrefix + suffixes[size]);
                        layoutChanged = true;
                    });

                    if (layoutChanged) {
                        coreLayoutService.layoutChanged(name);
                    }

                    cache[group] = sizes;
                });
        }

        function _link(scope, element, attrs) {
            var options = defaultsDeep({}, scope.options, defaults),
                name = options.name;

            delete options.name;

            scope.names = {
                header: name + '-header',
                contents: name + '-contents',
                footer: name + '-footer'
            };

            coreLayoutService.state[name] = options;

            attrs.$addClass('core-layout');

            var deregistrators = [
                _addWatcher(attrs, name, 'header', 'visible'),
                _addWatcher(attrs, name, 'header', 'hidden'),
                _addWatcher(attrs, name, 'footer', 'visible'),
                _addWatcher(attrs, name, 'footer', 'hidden')
            ];

            scope.$on('$destroy', function _deregister() {
                _.each(deregistrators, function _deregister(deregistrator) {
                    deregistrator();
                })
            });
        }

        return {
            link: _link,
            scope: {
                options: '=coreLayout'
            },
            templateUrl: 'core-layout.html'
        };
    }
    coreLayout.$inject = ["$rootScope", "coreLayoutService"];

    /* @ngInject */
    function coreLayoutClose($state, coreLayoutService) {
        function _link(scope, element) {
            element.on('click', function _close() {
                $state.go(coreLayoutService.state[scope.name].closeTargetState);
            });
        }

        return {
            link: _link,
            scope: {
                name: '@coreLayoutClose'
            }
        };
    }
    coreLayoutClose.$inject = ["$state", "coreLayoutService"];

    return angular
        .module('coreLayout', [angularIScroll.name, 'coreLayout.templates'])
        .factory('coreLayoutService', CoreLayoutService)
        .directive('coreLayout', coreLayout)
        .directive('coreLayoutClose', coreLayoutClose);
}));

