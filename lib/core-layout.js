/**
 * @license core-layout v6.0.0, 2016-09-02T22:14:04+0200
 * (c) 2016 Martin Thorsen Ranang <mtr@ranang.org>
 * License: MIT
 */
(function (module, window) {'use strict'; module.exports = angular.module('coreLayout.templates', []).run(['$templateCache', function($templateCache) { $templateCache.put("core-layout.html","<div class=\"cl-header\" ui-view=\"{{::names.header}}\"></div><div class=\"cl-contents\" ui-view=\"{{::names.contents}}\"></div><div class=\"cl-footer\" ui-view=\"{{::names.footer}}\"></div>");}]); })(module, window);
(function (root, factory) {
    'use strict';
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
}(this, function (angular, angularIscroll, _) {
    'use strict';

    CoreLayoutService.$inject = ["$rootScope", "iScrollService"];
    coreLayout.$inject = ["$rootScope", "coreLayoutService"];
    coreLayoutClose.$inject = ["$state", "coreLayoutService"];
    function _defaultExcept(options, defaultValue) {
        options = options || {};
        defaultValue = angular.isDefined(defaultValue) ? defaultValue : false;
        return {
            all: options.all || defaultValue,
            xs: options.xs || defaultValue,
            sm: options.sm || defaultValue,
            md: options.md || defaultValue,
            lg: options.lg || defaultValue
        };
    }

    /* @ngInject */
    function CoreLayoutService($rootScope, iScrollService) {
        var _state = {
            /**
             * Different state variables get assigned by core-layout directive
             * instances.
             **/
        };

        function _mergeStateIfProvided(configChanges, target) {
            if (angular.isDefined(configChanges)) {
                if (angular.isDefined(target)) {
                    _.merge(target, configChanges);
                } else {
                    _.merge(_state.modal, configChanges);
                }
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

        function _mayChangeDrawerState(drawerId, doOpen) {
            var drawer = _state[drawerId],
                now = Date.now(),
                lastActionTimeStamp = drawer.lastActionTimeStamp || 0,
                isTimedOut =
                    (now - lastActionTimeStamp) > drawer.debounceTimeout;

            if (isTimedOut) {
                drawer.lastActionTimeStamp = now;
            }

            return isTimedOut;
        }

        function _openDrawer(drawerId, configChanges) {
            var drawer = _state[drawerId];
            _mergeStateIfProvided(configChanges, drawer);
            if (_mayChangeDrawerState(drawerId)) {
                drawer.show = true;
            }
        }

        function _updateDrawer(drawerId, configChanges) {
            _mergeStateIfProvided(configChanges, _state[drawerId]);
        }

        function _closeDrawer(drawerId, configChanges) {
            var drawer = _state[drawerId];
            if (_mayChangeDrawerState(drawerId)) {
                drawer.show = false;
            }
            _mergeStateIfProvided(configChanges, drawer);
        }

        function _toggleDrawer(drawerId) {
            var drawer = _state[drawerId];
            if (_mayChangeDrawerState(drawerId)) {
                drawer.show = !drawer.show;
            }
        }

        function _layoutChanged(name) {
            iScrollService.refresh(name);
        }

        function _update(configChanges) {
            _mergeStateIfProvided(configChanges, _state.main)
        }

        $rootScope.coreLayout = _state;

        return {
            state: _state,
            openModal: _openModal,
            updateModal: _updateModal,
            closeModal: _closeModal,
            openDrawer: _openDrawer,
            updateDrawer: _updateDrawer,
            closeDrawer: _closeDrawer,
            toggleDrawer: _toggleDrawer,
            layoutChanged: _layoutChanged,
            update: _update,
            defaultExcept: _defaultExcept
        };
    }

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

    function _trueKeys(result, value, key) {
        if (value === true) {
            result.push(key);
        }
        return result;
    }

    /* @ngInject */
    function coreLayout($rootScope, coreLayoutService) {
        var defaults = {
                enabled: true,
                show: true,
                header: {
                    visible: _defaultExcept(),
                    hidden: _defaultExcept()
                },
                footer: {
                    visible: _defaultExcept(),
                    hidden: _defaultExcept()
                },
                debounceTimeout: 0
            },
            cache = {};

        function _addWatcher(attrs, ccName, area, visibility) {
            var group = ccName + '.' + area + '.' + visibility;

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
                        coreLayoutService.layoutChanged(ccName);
                    }

                    cache[group] = sizes;
                });
        }

        function _link(scope, element, attrs) {
            var options = defaultsDeep({}, scope.options, defaults),
                name = options.name,
                ccName = attrs.$normalize(name),
                identifier = 'cl-' + name;

            delete options.name;

            scope.names = {
                header: name + '-header',
                contents: name + '-contents',
                footer: name + '-footer'
            };

            coreLayoutService.state[ccName] = options;

            element.attr('id', identifier);

            var deregistrators = [
                _addWatcher(attrs, ccName, 'header', 'visible'),
                _addWatcher(attrs, ccName, 'header', 'hidden'),
                _addWatcher(attrs, ccName, 'footer', 'visible'),
                _addWatcher(attrs, ccName, 'footer', 'hidden')
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

    function _fixViewportHeight() {
        /**
         * To cope with Facebook's embedded browser on iOS 9.x breaking the
         * layout because the page's height gets wrong.
         **/
        var html = document.querySelector('html');

        function _onResize(event) {
            html.style.height = window.innerHeight + 'px';
        }

        angular.element(window).on('resize', _.debounce(_onResize, 125, {
            leading: true,
            maxWait: 250,
            trailing: true
        }));

        _onResize();
    }

    _fixViewportHeight();

    return angular
        .module('coreLayout', [angularIscroll.name, 'coreLayout.templates'])
        .factory('coreLayoutService', CoreLayoutService)
        .directive('coreLayout', coreLayout)
        .directive('coreLayoutClose', coreLayoutClose);
}));

