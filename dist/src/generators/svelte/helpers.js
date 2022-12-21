"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripStateAndProps = void 0;
var strip_state_and_props_refs_1 = require("../../helpers/strip-state-and-props-refs");
var stripStateAndProps = function (_a) {
    var options = _a.options, json = _a.json;
    return function (code) {
        return (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(code, {
            includeState: options.stateType === 'variables',
            replaceWith: function (name) { return (name === 'children' ? '$$slots.default' : name); },
        });
    };
};
exports.stripStateAndProps = stripStateAndProps;
