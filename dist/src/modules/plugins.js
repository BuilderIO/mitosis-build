"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runPostCodePlugins = exports.runPreCodePlugins = exports.runPostJsonPlugins = exports.runPreJsonPlugins = void 0;
var runPreJsonPlugins = function (_a) {
    var _b;
    var json = _a.json, plugins = _a.plugins, options = _a.options;
    var useJson = json;
    for (var _i = 0, plugins_1 = plugins; _i < plugins_1.length; _i++) {
        var plugin = plugins_1[_i];
        var preFunction = (_b = plugin(options).json) === null || _b === void 0 ? void 0 : _b.pre;
        if (preFunction) {
            useJson = preFunction(json) || json;
        }
    }
    return useJson;
};
exports.runPreJsonPlugins = runPreJsonPlugins;
var runPostJsonPlugins = function (_a) {
    var _b;
    var json = _a.json, plugins = _a.plugins, options = _a.options;
    var useJson = json;
    for (var _i = 0, plugins_2 = plugins; _i < plugins_2.length; _i++) {
        var plugin = plugins_2[_i];
        var postFunction = (_b = plugin(options).json) === null || _b === void 0 ? void 0 : _b.post;
        if (postFunction) {
            useJson = postFunction(json) || json;
        }
    }
    return useJson;
};
exports.runPostJsonPlugins = runPostJsonPlugins;
var runPreCodePlugins = function (_a) {
    var _b;
    var code = _a.code, plugins = _a.plugins, options = _a.options, json = _a.json;
    var string = code;
    for (var _i = 0, plugins_3 = plugins; _i < plugins_3.length; _i++) {
        var plugin = plugins_3[_i];
        var preFunction = (_b = plugin(options).code) === null || _b === void 0 ? void 0 : _b.pre;
        if (preFunction) {
            string = preFunction(string, json);
        }
    }
    return string;
};
exports.runPreCodePlugins = runPreCodePlugins;
var runPostCodePlugins = function (_a) {
    var _b;
    var code = _a.code, plugins = _a.plugins, options = _a.options, json = _a.json;
    var string = code;
    for (var _i = 0, plugins_4 = plugins; _i < plugins_4.length; _i++) {
        var plugin = plugins_4[_i];
        var postFunction = (_b = plugin(options).code) === null || _b === void 0 ? void 0 : _b.post;
        if (postFunction) {
            string = postFunction(string, json);
        }
    }
    return string;
};
exports.runPostCodePlugins = runPostCodePlugins;
