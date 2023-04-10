"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectClassString = void 0;
// This should really be a preprocessor mapping the `class` attribute binding based on what other values have
// to make this more pluggable
var collectClassString = function (json, options) {
    var _a, _b, _c;
    var staticClasses = [];
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
    if (typeof ((_c = json.bindings.css) === null || _c === void 0 ? void 0 : _c.code) === 'string' &&
        json.bindings.css.code.trim().length > 4 &&
        options.stylesType === 'styled-components') {
        dynamicClasses.push("css(".concat(json.bindings.css.code, ")"));
    }
    delete json.bindings.css;
    var staticClassesString = staticClasses.join(' ');
    var dynamicClassesString = dynamicClasses.join(" + ' ' + ");
    var hasStaticClasses = Boolean(staticClasses.length);
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
};
exports.collectClassString = collectClassString;
