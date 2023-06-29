"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAction = void 0;
var astring_1 = require("astring");
var string_1 = require("../helpers/string");
function parseAction(json, nodeReference, attribute) {
    var _a, _b;
    var methodName = attribute.name;
    var parameters = '';
    if (['Identifier', 'ObjectExpression'].includes((_a = attribute.expression) === null || _a === void 0 ? void 0 : _a.type)) {
        parameters = (0, astring_1.generate)(attribute.expression);
    }
    var actionHandler = (0, string_1.uniqueName)(Object.keys(json.state), 'actionHandler');
    json.state[actionHandler] = {
        code: 'null',
        type: 'property',
        propertyType: 'normal',
    };
    var initHandler = "if (".concat(nodeReference, ") { ").concat(actionHandler, " = ").concat(methodName, "(").concat(nodeReference, ", ").concat(parameters, "); };\n");
    // Handle Mount
    var onMountCode = ((_b = json.hooks.onMount) === null || _b === void 0 ? void 0 : _b.code) || '';
    json.hooks.onMount = {
        code: "".concat(onMountCode, "\n").concat(initHandler, ";\n"),
    };
    // Handle Destroy / Re-Mount
    var onReferenceUpdate = "\n    if (!".concat(nodeReference, " && ").concat(actionHandler, ") { \n      ").concat(actionHandler, "?.destroy(); \n      ").concat(actionHandler, " = null; \n    } else if (").concat(nodeReference, " && !").concat(actionHandler, ") { \n      ").concat(initHandler, " \n    };\n\n  ");
    json.hooks.onUpdate = json.hooks.onUpdate || [];
    json.hooks.onUpdate.push({
        code: onReferenceUpdate,
        deps: "[".concat(nodeReference, "]"),
    });
    // Handle Update
    if (parameters) {
        var onUpdate = "".concat(actionHandler, "?.update(").concat(parameters, ")\n");
        json.hooks.onUpdate.push({
            code: onUpdate,
            deps: "[".concat(parameters, "]"),
        });
    }
}
exports.parseAction = parseAction;
