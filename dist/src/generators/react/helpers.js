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
exports.processTagReferences = exports.getCode = exports.wrapInFragment = exports.getFragment = exports.closeFrag = exports.openFrag = exports.processBinding = void 0;
var lodash_1 = require("lodash");
var traverse_1 = __importDefault(require("traverse"));
var is_mitosis_node_1 = require("../../helpers/is-mitosis-node");
var strip_state_and_props_refs_1 = require("../../helpers/strip-state-and-props-refs");
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
    return (0, lodash_1.upperFirst)(path) + 'Ref';
}
function getCode(str, options) {
    if (str === void 0) { str = ''; }
    return (0, exports.processBinding)(str, options);
}
exports.getCode = getCode;
function processTagReferences(json, options) {
    var namesFound = new Set();
    (0, traverse_1.default)(json).forEach(function (el) {
        var _a, _b;
        if (!(0, is_mitosis_node_1.isMitosisNode)(el)) {
            return;
        }
        var processedRefName = (0, exports.processBinding)(el.name, options);
        if (el.name.includes('state.')) {
            switch ((_a = json.state[processedRefName]) === null || _a === void 0 ? void 0 : _a.type) {
                case 'getter':
                    var refName = getRefName(processedRefName);
                    if (!namesFound.has(el.name)) {
                        namesFound.add(el.name);
                        json.hooks.init = __assign(__assign({}, json.hooks.init), { code: "\n            ".concat(((_b = json.hooks.init) === null || _b === void 0 ? void 0 : _b.code) || '', "\n            const ").concat(refName, " = ").concat(el.name, ";\n            ") });
                    }
                    el.name = refName;
                    break;
                // NOTE: technically, it should be impossible for the tag to be a method or a function in Mitosis JSX syntax,
                // as that will fail JSX parsing.
                case 'method':
                case 'function':
                case 'property':
                    var capitalizedName = (0, lodash_1.upperFirst)(processedRefName);
                    if (capitalizedName !== processedRefName) {
                        el.name = capitalizedName;
                        json.state[capitalizedName] = __assign({}, json.state[processedRefName]);
                        delete json.state[processedRefName];
                    }
                    else {
                        el.name = processedRefName;
                    }
                    break;
            }
        }
        else {
            el.name = processedRefName;
        }
    });
}
exports.processTagReferences = processTagReferences;
