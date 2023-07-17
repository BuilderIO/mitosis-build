"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processTargetBlocks = void 0;
var function_1 = require("fp-ts/lib/function");
var use_target_1 = require("../../parsers/jsx/hooks/use-target");
var process_code_1 = require("./process-code");
var getBlockForTarget = function (_a) {
    var _b;
    var target = _a.target, json = _a.json, targetId = _a.targetId;
    var targetBlock = (_b = json.targetBlocks) === null || _b === void 0 ? void 0 : _b[targetId];
    if (!targetBlock)
        return undefined;
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
    return (0, function_1.pipe)((0, process_code_1.createCodeProcessorPlugin)(function (_codeType, json) { return function (code) {
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
            var targetBlock = getBlockForTarget({ target: target, json: json, targetId: targetId });
            if (!targetBlock) {
                throw new Error("Could not find `useTarget()` value in \"".concat(json.name, "\" for target \"").concat(target, "\", and no default value was set."));
            }
            code = code.replaceAll(m, targetBlock.code);
        }
        return code;
    }; }), function (plugin) {
        return function () { return ({ json: { pre: plugin } }); };
    });
};
exports.processTargetBlocks = processTargetBlocks;