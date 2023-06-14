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
exports.getUseTargetStatements = exports.getIdFromMatch = exports.USE_TARGET_MAGIC_REGEX = exports.USE_TARGET_MAGIC_STRING = exports.getMagicString = exports.getTargetId = void 0;
var babel = __importStar(require("@babel/core"));
var generator_1 = __importDefault(require("@babel/generator"));
var hooks_1 = require("../../../constants/hooks");
var targets_1 = require("../../../targets");
var types = babel.types;
var getTargetId = function (component) {
    var latestId = Object.keys(component.targetBlocks || {}).length;
    var blockId = (latestId + 1).toString();
    return blockId;
};
exports.getTargetId = getTargetId;
var getMagicString = function (targetId) { return [exports.USE_TARGET_MAGIC_STRING, targetId].join(''); };
exports.getMagicString = getMagicString;
exports.USE_TARGET_MAGIC_STRING = 'USE_TARGET_BLOCK_';
// check for uuid.v4() format
var idRegex = /\d*/;
var REGEX_BLOCK_NAME = 'blockId';
exports.USE_TARGET_MAGIC_REGEX = new RegExp(
// make sure to capture the id of the target block
"\"".concat(exports.USE_TARGET_MAGIC_STRING, "(?<").concat(REGEX_BLOCK_NAME, ">").concat(idRegex.source, ")\""), 'g');
var getIdFromMatch = function (match) {
    var _a;
    var USE_TARGET_MAGIC_REGEX_WITHOUT_G = new RegExp("\"".concat(exports.USE_TARGET_MAGIC_STRING, "(?<").concat(REGEX_BLOCK_NAME, ">").concat(idRegex.source, ")\""));
    var result = match.match(USE_TARGET_MAGIC_REGEX_WITHOUT_G);
    if (!result)
        return undefined;
    return (_a = result.groups) === null || _a === void 0 ? void 0 : _a[REGEX_BLOCK_NAME];
};
exports.getIdFromMatch = getIdFromMatch;
/**
 * This function finds `useTarget()` and converts it our JSON representation
 */
var getUseTargetStatements = function (useTargetHook) {
    if (!types.isIdentifier(useTargetHook.callee))
        return undefined;
    if (useTargetHook.callee.name !== hooks_1.HOOKS.TARGET)
        return undefined;
    var obj = useTargetHook.arguments[0];
    if (!types.isObjectExpression(obj))
        return undefined;
    var targetBlock = {};
    obj.properties.forEach(function (prop) {
        if (!types.isObjectProperty(prop)) {
            throw new Error('useTarget properties cannot be spread or references');
        }
        if (!types.isIdentifier(prop.key)) {
            throw new Error('Expected an identifier, instead got: ' + prop.key);
        }
        if (!Object.keys(targets_1.targets).concat('default').includes(prop.key.name)) {
            throw new Error('Invalid target: ' + prop.key.name);
        }
        var targetCode = prop.value;
        if (!types.isExpression(targetCode))
            return undefined;
        targetBlock[prop.key.name] = {
            code: (0, generator_1.default)(targetCode).code,
        };
        // TO-DO: replace the useTarget() call with a magic string
        // this will be replaced with the actual target code later
    });
    return Object.keys(targetBlock).length ? targetBlock : undefined;
};
exports.getUseTargetStatements = getUseTargetStatements;
