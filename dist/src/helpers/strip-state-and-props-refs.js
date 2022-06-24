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
    var contextVars = (options === null || options === void 0 ? void 0 : options.contextVars) || [];
    var outputVars = (options === null || options === void 0 ? void 0 : options.outputVars) || [];
    var context = (options === null || options === void 0 ? void 0 : options.context) || 'this.';
    if (contextVars.length) {
        contextVars.forEach(function (_var) {
            newCode = newCode.replace(
            // determine expression edge cases
            new RegExp('(^|\\n|\\r| |;|\\(|\\[|!)' + _var + '(\\?\\.|\\.|\\(| |;|\\)|$)', 'g'), '$1' + context + _var + '$2');
        });
    }
    if (outputVars.length) {
        outputVars.forEach(function (_var) {
            // determine expression edge cases onMessage( to this.onMessage.emit(
            var regexp = '( |;|\\()(props\\.?)' + _var + '\\(';
            var replacer = '$1' + context + _var + '.emit(';
            newCode = newCode.replace(new RegExp(regexp, 'g'), replacer);
        });
    }
    if (options.includeProps !== false) {
        if (typeof replacer === 'string') {
            newCode = newCode.replace(/props\./g, replacer);
        }
        else {
            newCode = newCode.replace(/props\.([\$a-z0-9_]+)/gi, function (memo, name) { return replacer(name); });
        }
        // TODO: webcomponent edge-case
        if (/el\.this\.props/.test(newCode)) {
            newCode = newCode.replace(/el\.this\.props/g, 'el.props');
        }
    }
    if (options.includeState !== false) {
        if (typeof replacer === 'string') {
            newCode = newCode.replace(/state\./g, replacer);
        }
        else {
            newCode = newCode.replace(/state\.([\$a-z0-9_]+)/gi, function (memo, name) { return replacer(name); });
        }
    }
    return newCode;
};
exports.stripStateAndPropsRefs = stripStateAndPropsRefs;
