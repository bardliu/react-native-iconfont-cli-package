#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var colors_1 = tslib_1.__importDefault(require("colors"));
console.log([
    '',
    'Usage:',
    '',
    '    ' + colors_1.default.yellow('iconfont-init') + '       : generate config file',
    '    ' + colors_1.default.yellow('iconfont-rn') + '         : generate icon components',
    '',
].join('\n'));
