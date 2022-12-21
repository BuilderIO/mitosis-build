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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectTypes = exports.parseAttributes = exports.createTagRegex = exports.isTypeScriptComponent = void 0;
var babel = __importStar(require("@babel/core"));
var generator_1 = __importDefault(require("@babel/generator"));
var parser = __importStar(require("@babel/parser"));
var types = __importStar(require("@babel/types"));
var lodash_1 = require("lodash");
function isTypeScriptComponent(string_) {
    var regex = createTagRegex('script', 'gi');
    var match = regex.exec(string_);
    var lang = parseAttributes(((match === null || match === void 0 ? void 0 : match.length) && match[1]) || '').lang;
    return lang === 'ts';
}
exports.isTypeScriptComponent = isTypeScriptComponent;
/** Create a tag matching regexp. */
function createTagRegex(tagName, flags) {
    return new RegExp("/<!--[^]*?-->|<".concat(tagName, "(\\s[^]*?)?(?:>([^]*?)<\\/").concat(tagName, ">|\\/>)"), flags);
}
exports.createTagRegex = createTagRegex;
/** Transform an attribute string into a key-value object */
function parseAttributes(attributesString) {
    return attributesString
        .split(/\s+/)
        .filter(Boolean)
        .reduce(function (accumulator, attribute) {
        var _a = attribute.split('='), name = _a[0], value = _a[1];
        // istanbul ignore next
        accumulator[name] = value ? value.replace(/["']/g, '') : true;
        return accumulator;
    }, {});
}
exports.parseAttributes = parseAttributes;
function getScriptContent(markup, module) {
    var regex = createTagRegex('script', 'gi');
    var match;
    while ((match = regex.exec(markup)) !== null) {
        var context = parseAttributes(match[1] || '').context;
        if ((context !== 'module' && !module) || (context === 'module' && module)) {
            return match[2];
        }
    }
    return '';
}
function collectTypes(string_, json) {
    var _a;
    var module = getScriptContent(string_, true); // module
    var instance = getScriptContent(string_, false); // instance
    function traverse(script_) {
        var ast = parser.parse(script_, {
            sourceType: 'module',
            plugins: ['typescript'],
        });
        babel.traverse(ast, {
            enter: function (path) {
                var _a;
                // alias or interface (e.g. type Props = { } or interface Props {} )
                if (types.isTSTypeAliasDeclaration(path.node) ||
                    types.isTSInterfaceDeclaration(path.node)) {
                    json.types = __spreadArray(__spreadArray([], ((_a = json.types) !== null && _a !== void 0 ? _a : []), true), [(0, generator_1.default)(path.node).code], false);
                    path.skip();
                }
                else if (types.isTSTypeAnnotation(path.node)) {
                    // add to actual ref
                    var reference = (0, generator_1.default)(path.parent).code;
                    var type = (0, generator_1.default)(path.node.typeAnnotation).code;
                    // add to ref
                    if (Object.prototype.hasOwnProperty.call(json.refs, reference)) {
                        json.refs[reference].typeParameter = type;
                    }
                    // temp add to prop object.
                    // after having finished traversing, we'll create the prop type declaration
                    if (Object.prototype.hasOwnProperty.call(json.props, reference)) {
                        json.props[reference].type = type;
                    }
                }
            },
        });
    }
    traverse(module);
    traverse(instance);
    // add prop type declaration to json.types and set the propsTypeRef
    if ((0, lodash_1.some)(json.props, function (property) { return !!property.type; })) {
        var propertyTypeDeclaration = "type Props = {";
        propertyTypeDeclaration += Object.keys((0, lodash_1.pickBy)(json.props, function (property) { return !!property.type; }))
            .map(function (key) {
            return "".concat(key, ": ").concat(json.props[key].type, ";");
        })
            .join('\n');
        propertyTypeDeclaration += '}';
        json.types = __spreadArray(__spreadArray([], ((_a = json.types) !== null && _a !== void 0 ? _a : []), true), [propertyTypeDeclaration], false);
        json.propsTypeRef = 'Props';
    }
}
exports.collectTypes = collectTypes;
