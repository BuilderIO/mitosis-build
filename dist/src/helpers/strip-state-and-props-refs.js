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
    var domRefs = (options === null || options === void 0 ? void 0 : options.domRefs) || [];
    var stateVars = (options === null || options === void 0 ? void 0 : options.stateVars) || [];
    if (contextVars.length) {
        contextVars.forEach(function (_var) {
            newCode = newCode.replace(
            // determine expression edge cases - https://regex101.com/r/iNcTSM/1
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
    var matchPropertyAccessorsArguments = '\\?\\.|,|\\.|\\(| |;|\\)|\\]|$'; // foo?.stuff | foo) | foo | foo] etc.
    var matchVariableUseInClass = '^|\\n|\\r| |;|\\(|\\[|!|,'; //  foo | (foo | !foo | foo, | [foo etc.
    if (domRefs.length) {
        domRefs.forEach(function (_var) {
            newCode = newCode.replace(new RegExp("(".concat(matchVariableUseInClass, ")").concat(_var, "(").concat(matchPropertyAccessorsArguments, ")"), 'g'), '$1' + 'this.' + _var + '$2');
        });
    }
    if (stateVars.length) {
        stateVars.forEach(function (_var) {
            newCode = newCode.replace(
            /*
              1. Skip anything that is a class variable declaration
                 myClass() {
                  stuff = 'hi'
                   foo = 'bar'  <-- in the event that formatting is off
                 }
              2. Skip anything that is the name of a function declaration or a getter
                 stuff = function stuff() {}  or  get stuff
              3. If the conditions are met then try to match all use cases of the class variables, see above.
            */
            new RegExp("(?!^".concat(_var, "|^ ").concat(_var, ")(?<!function|get)(").concat(matchVariableUseInClass, ")").concat(_var, "(").concat(matchPropertyAccessorsArguments, ")"), 'g'), '$1' + 'this.' + _var + '$2');
        });
    }
    return newCode;
};
exports.stripStateAndPropsRefs = stripStateAndPropsRefs;
