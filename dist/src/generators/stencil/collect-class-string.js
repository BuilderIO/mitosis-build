"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectClassString = void 0;
// This should really be a preprocessor mapping the `class` attribute binding based on what other values have
// to make this more pluggable
function collectClassString(json) {
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
    if (typeof json.bindings.class === 'string') {
        dynamicClasses.push(json.bindings.class);
        delete json.bindings.class;
    }
    if (typeof json.bindings.className === 'string') {
        dynamicClasses.push(json.bindings.className);
        delete json.bindings.className;
    }
    if (typeof json.bindings.className === 'string') {
        dynamicClasses.push(json.bindings.className);
        delete json.bindings.className;
    }
    var staticClassesString = staticClasses.join(' ');
    var dynamicClassesString = dynamicClasses.join(" + ' ' + ");
    var hasDynamicClasses = Boolean(dynamicClasses.length);
    if (hasStaticClasses && !hasDynamicClasses) {
        return "\"".concat(staticClassesString, "\"");
    }
    if (hasDynamicClasses && !hasStaticClasses) {
        return "{".concat(dynamicClassesString, "}");
    }
    if (hasDynamicClasses && hasStaticClasses) {
        return "{\"".concat(staticClassesString, " \" + ").concat(dynamicClassesString, "}");
    }
    return null;
}
exports.collectClassString = collectClassString;
