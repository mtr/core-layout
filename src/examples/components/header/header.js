'use strict';

import angular from 'angular';

import HeaderController from "./header.controller.js";

export default angular.module('myApp.header', [
    HeaderController
])
    .name;
