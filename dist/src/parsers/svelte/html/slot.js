"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSlot = void 0;
var lodash_1 = require("lodash");
var children_1 = require("../helpers/children");
var mitosis_node_1 = require("../helpers/mitosis-node");
function parseSlot(json, node) {
    var _a, _b;
    var mitosisNode = (0, mitosis_node_1.createMitosisNode)();
    if (node.attributes.length > 0 &&
        node.attributes[0].value.length > 0 &&
        ((_a = node.attributes[0].value[0].data) === null || _a === void 0 ? void 0 : _a.trim().length)) {
        mitosisNode.name = 'div';
        var slotName = (0, lodash_1.upperFirst)((_b = node.attributes[0].value[0]) === null || _b === void 0 ? void 0 : _b.data);
        mitosisNode.bindings._text = {
            code: "props.slot".concat(slotName),
        };
    }
    else {
        mitosisNode.name = 'Slot';
    }
    mitosisNode.children = (0, children_1.parseChildren)(json, node);
    return mitosisNode;
}
exports.parseSlot = parseSlot;
