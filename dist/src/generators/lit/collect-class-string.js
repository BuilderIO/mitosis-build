"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectClassString = void 0;
// This should really be a preprocessor mapping the `class` attribute binding based on what other values have
// to make this more pluggable
function collectClassString(json, bindingOpenChar, bindingCloseChar) {
    var _a, _b;
    if (bindingOpenChar === void 0) { bindingOpenChar = '{'; }
    if (bindingCloseChar === void 0) { bindingCloseChar = '}'; }
    var staticClasses = [];
    var hasStaticClasses = Boolean(staticClasses.length);
    if (json.properties.class) {
        staticClasses.push(json.properties.class);
        delete json.properties.class;
    }
    if (json.properties.className) {
        staticClasses.push(json.properties.className);
        delete json.properties.className;
    }
    var dynamicClasses = [];
    if (typeof ((_a = json.bindings.class) === null || _a === void 0 ? void 0 : _a.code) === 'string') {
        dynamicClasses.push(json.bindings.class.code);
        delete json.bindings.class;
    }
    if (typeof ((_b = json.bindings.className) === null || _b === void 0 ? void 0 : _b.code) === 'string') {
        dynamicClasses.push(json.bindings.className.code);
        delete json.bindings.className;
    }
    var staticClassesString = staticClasses.join(' ');
    var dynamicClassesString = dynamicClasses.join(" + ' ' + ");
    var hasDynamicClasses = Boolean(dynamicClasses.length);
    if (hasStaticClasses && !hasDynamicClasses) {
        return "\"".concat(staticClassesString, "\"");
    }
    if (hasDynamicClasses && !hasStaticClasses) {
        return "".concat(bindingOpenChar).concat(dynamicClassesString).concat(bindingCloseChar);
    }
    if (hasDynamicClasses && hasStaticClasses) {
        return "".concat(bindingOpenChar, "\"").concat(staticClassesString, " \" + ").concat(dynamicClassesString).concat(bindingCloseChar);
    }
    return null;
}
exports.collectClassString = collectClassString;
