"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRawMustacheTag = exports.parseMustacheTag = void 0;
var astring_1 = require("astring");
var bindings_1 = require("../../../helpers/bindings");
var mitosis_node_1 = require("../helpers/mitosis-node");
function parseMustacheTag(node) {
    var mitosisNode = (0, mitosis_node_1.createMitosisNode)();
    mitosisNode.name = 'div';
    mitosisNode.bindings['_text'] = (0, bindings_1.createSingleBinding)({
        code: (0, astring_1.generate)(node.expression),
    });
    return mitosisNode;
}
exports.parseMustacheTag = parseMustacheTag;
function parseRawMustacheTag(node) {
    var mitosisNode = (0, mitosis_node_1.createMitosisNode)();
    mitosisNode.name = 'div';
    mitosisNode.bindings.innerHTML = (0, bindings_1.createSingleBinding)({
        code: (0, astring_1.generate)(node.expression),
    });
    return mitosisNode;
}
exports.parseRawMustacheTag = parseRawMustacheTag;
