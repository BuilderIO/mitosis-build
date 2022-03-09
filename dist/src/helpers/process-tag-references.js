"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processTagReferences = void 0;
var lodash_1 = require("lodash");
var traverse_1 = __importDefault(require("traverse"));
var is_mitosis_node_1 = require("./is-mitosis-node");
function getRefName(path) {
    return (0, lodash_1.upperFirst)((0, lodash_1.camelCase)((0, lodash_1.last)(path.split('.')))) + 'Ref';
}
function processTagReferences(json) {
    var namesFound = new Set();
    (0, traverse_1.default)(json).forEach(function (el) {
        var _a;
        if ((0, is_mitosis_node_1.isMitosisNode)(el)) {
            if (el.name.includes('.')) {
                if (!namesFound.has(el.name)) {
                    namesFound.add(el.name);
                    if (typeof ((_a = json.hooks.init) === null || _a === void 0 ? void 0 : _a.code) !== 'string') {
                        json.hooks.init = { code: '' };
                    }
                    json.hooks.init.code += "\n            const ".concat(getRefName(el.name), " = ").concat(el.name, ";\n          ");
                }
                el.name = getRefName(el.name);
            }
        }
    });
}
exports.processTagReferences = processTagReferences;
