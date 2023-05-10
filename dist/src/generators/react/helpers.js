"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processTagReferences = exports.getCode = exports.wrapInFragment = exports.getFragment = exports.closeFrag = exports.openFrag = exports.processBinding = void 0;
var lodash_1 = require("lodash");
var traverse_1 = __importDefault(require("traverse"));
var strip_state_and_props_refs_1 = require("../../helpers/strip-state-and-props-refs");
var is_mitosis_node_1 = require("../../helpers/is-mitosis-node");
var processBinding = function (str, options) {
    if (options.stateType !== 'useState') {
        return str;
    }
    return (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(str, {
        includeState: true,
        includeProps: false,
    });
};
exports.processBinding = processBinding;
var openFrag = function (options) { return getFragment('open', options); };
exports.openFrag = openFrag;
var closeFrag = function (options) { return getFragment('close', options); };
exports.closeFrag = closeFrag;
function getFragment(type, options) {
    var tagName = options.preact ? 'Fragment' : '';
    return type === 'open' ? "<".concat(tagName, ">") : "</".concat(tagName, ">");
}
exports.getFragment = getFragment;
var wrapInFragment = function (json) { return json.children.length !== 1; };
exports.wrapInFragment = wrapInFragment;
function getRefName(path) {
    return (0, lodash_1.upperFirst)((0, lodash_1.camelCase)((0, lodash_1.last)(path.split('.')))) + 'Ref';
}
function getCode(str, options) {
    if (str === void 0) { str = ''; }
    return (0, exports.processBinding)(str, options);
}
exports.getCode = getCode;
function processTagReferences(json, options) {
    var namesFound = new Set();
    (0, traverse_1.default)(json).forEach(function (el) {
        var _a;
        if ((0, is_mitosis_node_1.isMitosisNode)(el)) {
            var type = (0, lodash_1.get)(json, "".concat(el.name, ".type"), '');
            var isUseRef = ['getter', 'method', 'function'].includes(type);
            if (isUseRef && el.name.includes('.')) {
                if (!namesFound.has(el.name)) {
                    namesFound.add(el.name);
                    if (typeof ((_a = json.hooks.init) === null || _a === void 0 ? void 0 : _a.code) !== 'string') {
                        json.hooks.init = { code: '' };
                    }
                    json.hooks.init.code += "\n            const ".concat(getRefName(el.name), " = ").concat(el.name, ";\n          ");
                }
                if (isUseRef) {
                    el.name = getRefName(el.name);
                }
            }
        }
    });
}
exports.processTagReferences = processTagReferences;
