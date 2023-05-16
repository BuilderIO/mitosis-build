"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractContextComponents = void 0;
var babel = __importStar(require("@babel/core"));
var traverse_1 = __importDefault(require("traverse"));
var create_mitosis_node_1 = require("../../helpers/create-mitosis-node");
var is_mitosis_node_1 = require("../../helpers/is-mitosis-node");
var trace_reference_to_module_path_1 = require("../../helpers/trace-reference-to-module-path");
var state_1 = require("./state");
var expressionToNode = function (str) {
    var code = "export default ".concat(str);
    return babel.parse(code).program.body[0].declaration;
};
/**
 * Convert <Context.Provider /> to hooks formats by mutating the
 * MitosisComponent tree
 */
function extractContextComponents(json) {
    (0, traverse_1.default)(json).forEach(function (item) {
        var _a, _b;
        if ((0, is_mitosis_node_1.isMitosisNode)(item)) {
            if (item.name.endsWith('.Provider')) {
                var value = (_b = (_a = item.bindings) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.code;
                var name_1 = item.name.split('.')[0];
                var refPath = (0, trace_reference_to_module_path_1.traceReferenceToModulePath)(json.imports, name_1);
                json.context.set[refPath] = {
                    name: name_1,
                    value: value
                        ? (0, state_1.parseStateObjectToMitosisState)(expressionToNode(value))
                        : undefined,
                };
                this.update((0, create_mitosis_node_1.createMitosisNode)({
                    name: 'Fragment',
                    children: item.children,
                }));
            }
            // TODO: maybe support Context.Consumer:
            // if (item.name.endsWith('.Consumer')) { ... }
        }
    });
}
exports.extractContextComponents = extractContextComponents;
