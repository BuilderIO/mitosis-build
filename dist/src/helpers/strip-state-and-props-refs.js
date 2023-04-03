"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripStateAndPropsRefs = exports.DO_NOT_USE_VARS_TRANSFORMS = exports.DO_NOT_USE_CONTEXT_VARS_TRANSFORMS = void 0;
var replace_identifiers_1 = require("./replace-identifiers");
var DEFAULT_OPTIONS = {
    replaceWith: '',
    includeProps: true,
    includeState: true,
};
/**
 * Do not use this anywhere. We are migrating to AST transforms and should avoid Regex String.replace() as they are
 * very brittle.
 *
 * If you need to re-use this, re-create it as an AST tranform first.
 */
var DO_NOT_USE_CONTEXT_VARS_TRANSFORMS = function (_a) {
    var code = _a.code, contextVars = _a.contextVars, context = _a.context;
    contextVars === null || contextVars === void 0 ? void 0 : contextVars.forEach(function (_var) {
        code = code.replace(
        // determine expression edge cases - https://regex101.com/r/iNcTSM/1
        new RegExp('(^|\\n|\\r| |;|\\(|\\[|!)' + _var + '(\\?\\.|\\.|\\(| |;|\\)|$)', 'g'), '$1' + context + _var + '$2');
    });
    return code;
};
exports.DO_NOT_USE_CONTEXT_VARS_TRANSFORMS = DO_NOT_USE_CONTEXT_VARS_TRANSFORMS;
/**
 * Do not use these anywhere. We are migrating to AST transforms and should avoid Regex String.replace() as they are
 * very brittle.
 *
 * If you need to re-use a part of this, re-create it as an AST tranform first.
 */
var DO_NOT_USE_VARS_TRANSFORMS = function (newCode, _a) {
    var _b = _a.context, context = _b === void 0 ? 'this.' : _b, domRefs = _a.domRefs, outputVars = _a.outputVars, stateVars = _a.stateVars, contextVars = _a.contextVars;
    newCode = (0, exports.DO_NOT_USE_CONTEXT_VARS_TRANSFORMS)({ code: newCode, context: context, contextVars: contextVars });
    outputVars === null || outputVars === void 0 ? void 0 : outputVars.forEach(function (_var) {
        // determine expression edge cases onMessage( to this.onMessage.emit(
        var regexp = '(^|\\s|;|\\()(props\\.?)' + _var + '\\(';
        var replacer = '$1' + context + _var + '.emit(';
        newCode = newCode.replace(new RegExp(regexp, 'g'), replacer);
    });
    var matchPropertyAccessorsArguments = '\\?\\.|,|\\.|\\(| |;|\\)|\\]|$'; // foo?.stuff | foo) | foo | foo] etc.
    var matchVariableUseInClass = '^|\\n|\\r| |;|\\(|\\[|!|,'; //  foo | (foo | !foo | foo, | [foo etc.
    domRefs === null || domRefs === void 0 ? void 0 : domRefs.forEach(function (_var) {
        newCode = newCode.replace(new RegExp("(".concat(matchVariableUseInClass, ")").concat(_var, "(").concat(matchPropertyAccessorsArguments, ")"), 'g'), '$1' + 'this.' + _var + '$2');
    });
    stateVars === null || stateVars === void 0 ? void 0 : stateVars.forEach(function (_var) {
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
    return newCode;
};
exports.DO_NOT_USE_VARS_TRANSFORMS = DO_NOT_USE_VARS_TRANSFORMS;
/**
 * Remove state. and props. from expressions, e.g.
 * state.foo -> foo
 *
 * This is for support for frameworks like Vue, Svelte, liquid, etc
 *
 */
var stripStateAndPropsRefs = function (code, _options) {
    if (_options === void 0) { _options = {}; }
    var newCode = code || '';
    var _a = __assign(__assign({}, DEFAULT_OPTIONS), _options), replaceWith = _a.replaceWith, includeProps = _a.includeProps, includeState = _a.includeState;
    if (includeProps !== false) {
        newCode = (0, replace_identifiers_1.replacePropsIdentifier)(replaceWith)(newCode);
        // TODO: webcomponent edge-case
        if (/el\.this\.props/.test(newCode)) {
            newCode = newCode.replace(/el\.this\.props/g, 'el.props');
        }
    }
    if (includeState !== false) {
        newCode = (0, replace_identifiers_1.replaceStateIdentifier)(replaceWith)(newCode);
    }
    return newCode;
};
exports.stripStateAndPropsRefs = stripStateAndPropsRefs;
