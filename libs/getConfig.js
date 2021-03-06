"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var path_1 = tslib_1.__importDefault(require("path"));
var fs_1 = tslib_1.__importDefault(require("fs"));
var colors_1 = tslib_1.__importDefault(require("colors"));
var iconfont_json_1 = tslib_1.__importDefault(require("./iconfont.json"));
var cacheConfig;
exports.getConfig = function () {
    if (cacheConfig) {
        return cacheConfig;
    }
    var targetFile = path_1.default.resolve('iconfont.json');
    if (!fs_1.default.existsSync(targetFile)) {
        console.warn(colors_1.default.red('File "iconfont.json" doesn\'t exist, did you forget to generate it?'));
        process.exit(1);
    }
    var config = require(targetFile);
    if (!config.symbol_url || !/^(https?:)?\/\//.test(config.symbol_url)) {
        console.warn(colors_1.default.red('You are required to provide symbol_url'));
        process.exit(1);
    }
    if (config.symbol_url.indexOf('//') === 0) {
        config.symbol_url = 'http:' + config.symbol_url;
    }
    config.save_dir = config.save_dir || iconfont_json_1.default.save_dir;
    config.default_icon_size = config.default_icon_size || iconfont_json_1.default.default_icon_size;
    cacheConfig = config;
    return config;
};
