"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapStyles = void 0;
var get_styles_1 = require("../helpers/get-styles");
var traverse_nodes_1 = require("../helpers/traverse-nodes");
var mapStyles = function (pluginOptions) { return function (options) { return ({
    json: {
        pre: function (json) {
            (0, traverse_nodes_1.traverseNodes)(json, function (node, context) {
                var styles = (0, get_styles_1.getStyles)(node);
                (0, get_styles_1.setStyles)(node, pluginOptions.map(styles || {}, context));
            });
        },
    },
}); }; };
exports.mapStyles = mapStyles;
