"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processBinding = void 0;
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
