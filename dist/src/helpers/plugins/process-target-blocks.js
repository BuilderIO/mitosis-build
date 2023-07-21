"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processTargetBlocks = void 0;
var use_target_1 = require("../../parsers/jsx/hooks/use-target");
var process_code_1 = require("./process-code");
var getBlockForTarget = function (_a) {
    var target = _a.target, targetBlock = _a.targetBlock;
    switch (target) {
        case 'vue3':
        case 'vue':
            return targetBlock['vue3'] || targetBlock['vue'] || targetBlock['default'];
        default:
            return targetBlock[target] || targetBlock['default'];
    }
};
/**
 * Processes `useTarget()` blocks for a given target.
 */
var processTargetBlocks = function (target) {
    var plugin = (0, process_code_1.createCodeProcessorPlugin)(function (codeType, json, node) { return function (code, key) {
        var _a;
        if (codeType === 'properties') {
            var matches_2 = code.includes(use_target_1.USE_TARGET_MAGIC_STRING);
            var property = node === null || node === void 0 ? void 0 : node.properties[key];
            if (!matches_2 || !property)
                return code;
            node.bindings[key] = {
                code: '"' + property + '"',
                type: 'single',
            };
            return function () {
                delete node.properties[key];
            };
        }
        var matches = code.match(use_target_1.USE_TARGET_MAGIC_REGEX);
        if (!matches)
            return code;
        for (var _i = 0, matches_1 = matches; _i < matches_1.length; _i++) {
            var m = matches_1[_i];
            // get the captured ID of the target block
            var targetId = (0, use_target_1.getIdFromMatch)(m);
            if (!targetId)
                continue;
            // find the target block in the component, or the default target block
            var targetBlock = (_a = json.targetBlocks) === null || _a === void 0 ? void 0 : _a[targetId];
            if (!targetBlock) {
                throw new Error("Could not find `useTarget()` value in \"".concat(json.name, "\"."));
            }
            var block = getBlockForTarget({ target: target, targetBlock: targetBlock });
            if (!block) {
                if (targetBlock.settings.requiresDefault) {
                    throw new Error("Could not find `useTarget()` value in \"".concat(json.name, "\" for target \"").concat(target, "\", and no default value was set."));
                }
                else {
                    // if we don't need a default, then that means we allow for nothing to be injected, e.g. when we are in a function body.
                    code = code.replaceAll(m, '');
                    continue;
                }
            }
            code = code.replaceAll(m, block.code);
        }
        return code;
    }; }, { processProperties: true });
    return function () { return ({ json: { pre: plugin } }); };
};
exports.processTargetBlocks = processTargetBlocks;
