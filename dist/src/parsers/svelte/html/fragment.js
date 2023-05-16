"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFragment = void 0;
var children_1 = require("../helpers/children");
var mitosis_node_1 = require("../helpers/mitosis-node");
function parseFragment(json, node) {
    var mitosisNode = (0, mitosis_node_1.createMitosisNode)();
    mitosisNode.name = 'Fragment';
    mitosisNode.children = (0, children_1.parseChildren)(json, node);
    // if there is only one child, don't even bother to render the fragment as it is not necessary
    if (mitosisNode.children.length === 1) {
        mitosisNode = mitosisNode.children[0];
    }
    return mitosisNode;
}
exports.parseFragment = parseFragment;
