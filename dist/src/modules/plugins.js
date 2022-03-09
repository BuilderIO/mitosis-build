"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runPostCodePlugins = exports.runPreCodePlugins = exports.runPostJsonPlugins = exports.runPreJsonPlugins = void 0;
var runPreJsonPlugins = function (json, plugins, options) {
    var _a;
    var useJson = json;
    for (var _i = 0, plugins_1 = plugins; _i < plugins_1.length; _i++) {
        var plugin = plugins_1[_i];
        var preFunction = (_a = plugin(options).json) === null || _a === void 0 ? void 0 : _a.pre;
        if (preFunction) {
            useJson = preFunction(json) || json;
        }
    }
    return useJson;
};
exports.runPreJsonPlugins = runPreJsonPlugins;
var runPostJsonPlugins = function (json, plugins, options) {
    var _a;
    var useJson = json;
    for (var _i = 0, plugins_2 = plugins; _i < plugins_2.length; _i++) {
        var plugin = plugins_2[_i];
        var postFunction = (_a = plugin(options).json) === null || _a === void 0 ? void 0 : _a.post;
        if (postFunction) {
            useJson = postFunction(json) || json;
        }
    }
    return useJson;
};
exports.runPostJsonPlugins = runPostJsonPlugins;
var runPreCodePlugins = function (code, plugins, options) {
    var _a;
    var string = code;
    for (var _i = 0, plugins_3 = plugins; _i < plugins_3.length; _i++) {
        var plugin = plugins_3[_i];
        var preFunction = (_a = plugin(options).code) === null || _a === void 0 ? void 0 : _a.pre;
        if (preFunction) {
            string = preFunction(string);
        }
    }
    return string;
};
exports.runPreCodePlugins = runPreCodePlugins;
var runPostCodePlugins = function (code, plugins, options) {
    var _a;
    var string = code;
    for (var _i = 0, plugins_4 = plugins; _i < plugins_4.length; _i++) {
        var plugin = plugins_4[_i];
        var postFunction = (_a = plugin(options).code) === null || _a === void 0 ? void 0 : _a.post;
        if (postFunction) {
            string = postFunction(string);
        }
    }
    return string;
};
exports.runPostCodePlugins = runPostCodePlugins;
