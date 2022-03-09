"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripStateAndPropsRefs = void 0;
/**
 * Remove state. and props. from expressions, e.g.
 * state.foo -> foo
 *
 * This is for support for frameworks like Vue, Svelte, liquid,  etc
 *
 * @todo proper ref replacement with babel
 */
var stripStateAndPropsRefs = function (code, options) {
    if (options === void 0) { options = {}; }
    var newCode = code || '';
    var replacer = options.replaceWith || '';
    if (options.includeProps !== false) {
        if (typeof replacer === 'string') {
            newCode = newCode.replace(/props\./g, replacer);
        }
        else {
            newCode = newCode.replace(/props\.([\$a-z0-9_]+)/gi, function (memo, name) {
                return replacer(name);
            });
        }
    }
    if (options.includeState !== false) {
        if (typeof replacer === 'string') {
            newCode = newCode.replace(/state\./g, replacer);
        }
        else {
            newCode = newCode.replace(/state\.([\$a-z0-9_]+)/gi, function (memo, name) {
                return replacer(name);
            });
        }
    }
    return newCode;
};
exports.stripStateAndPropsRefs = stripStateAndPropsRefs;
