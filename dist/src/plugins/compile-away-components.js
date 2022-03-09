"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileAwayComponents = exports.getRenderOptions = void 0;
var lodash_1 = require("lodash");
var traverse_1 = __importDefault(require("traverse"));
var is_mitosis_node_1 = require("../helpers/is-mitosis-node");
var getRenderOptions = function (node) {
    return __assign(__assign({}, (0, lodash_1.mapValues)(node.properties, function (value) { return "\"".concat(value, "\""); })), (0, lodash_1.mapValues)(node.bindings, function (value) { return "{".concat(value, "}"); }));
};
exports.getRenderOptions = getRenderOptions;
/**
 * @example
 *    componentToReact(mitosisJson, {
 *      plugins: [
 *        compileAwayComponents({
 *          Image: (node) => {
 *             return jsx(`
 *               <div>
 *                 <img src="${node.properties.image}" />
 *               </div>
 *             `);
 *          }
 *        })
 *      ]
 *    })
 */
var compileAwayComponents = function (pluginOptions) { return function (options) { return ({
    json: {
        pre: function (json) {
            (0, traverse_1.default)(json).forEach(function (item) {
                if ((0, is_mitosis_node_1.isMitosisNode)(item)) {
                    var mapper = pluginOptions.components[item.name];
                    if (mapper) {
                        var result = mapper(item, this);
                        if (result) {
                            this.update(result);
                        }
                    }
                }
            });
        },
    },
}); }; };
exports.compileAwayComponents = compileAwayComponents;
