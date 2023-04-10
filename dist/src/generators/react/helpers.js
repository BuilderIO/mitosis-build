"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapInFragment = exports.getFragment = exports.closeFrag = exports.openFrag = exports.processBinding = void 0;
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
var openFrag = function (options) { return getFragment('open', options); };
exports.openFrag = openFrag;
var closeFrag = function (options) { return getFragment('close', options); };
exports.closeFrag = closeFrag;
function getFragment(type, options) {
    var tagName = options.preact ? 'Fragment' : '';
    return type === 'open' ? "<".concat(tagName, ">") : "</".concat(tagName, ">");
}
exports.getFragment = getFragment;
var wrapInFragment = function (json) { return json.children.length !== 1; };
exports.wrapInFragment = wrapInFragment;
