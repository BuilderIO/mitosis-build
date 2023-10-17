"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.iteratorProperty = exports.lastProperty = exports.isStatement = exports.iif = exports.arrowFnValue = exports.arrowFnBlock = exports.invoke = exports.quote = exports.Imports = exports.Symbol = exports.SrcBuilder = exports.File = void 0;
var parser_typescript_1 = __importDefault(require("prettier/parser-typescript"));
var standalone_1 = require("prettier/standalone");
var html_tags_1 = require("../../constants/html_tags");
var builder_1 = require("../../parsers/builder");
var stable_serialize_1 = require("./helpers/stable-serialize");
var File = /** @class */ (function () {
    function File(filename, options, qwikModule, qrlPrefix) {
        this.imports = new Imports();
        this.exports = new Map();
        this.filename = filename;
        this.options = options;
        this.src = new SrcBuilder(this, this.options);
        this.qwikModule = qwikModule;
        this.qrlPrefix = qrlPrefix;
    }
    Object.defineProperty(File.prototype, "module", {
        get: function () {
            return this.filename.substr(0, this.filename.lastIndexOf('.'));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(File.prototype, "path", {
        get: function () {
            return this.filename;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(File.prototype, "contents", {
        get: function () {
            return this.toString();
        },
        enumerable: false,
        configurable: true
    });
    File.prototype.import = function (module, symbol, as) {
        return this.imports.get(module, symbol, as);
    };
    File.prototype.toQrlChunk = function () {
        return quote(this.qrlPrefix + this.module + '.js');
    };
    File.prototype.exportConst = function (name, value, locallyVisible) {
        if (locallyVisible === void 0) { locallyVisible = false; }
        if (this.exports.has(name))
            return;
        this.exports.set(name, this.src.isModule ? name : 'exports.' + name);
        this.src.const(name, value, true, locallyVisible);
    };
    File.prototype.exportDefault = function (symbolName) {
        if (this.options.isPretty) {
            this.src.emit('\n\n');
        }
        if (this.options.isModule) {
            this.src.emit('export default ', symbolName, ';');
        }
        else {
            this.src.emit('module.exports=', symbolName, ';');
        }
    };
    File.prototype.toString = function () {
        var _this = this;
        var srcImports = new SrcBuilder(this, this.options);
        var imports = this.imports.imports;
        var modules = Array.from(imports.keys()).sort();
        modules.forEach(function (module) {
            if (module == '<SELF>')
                return;
            var symbolMap = imports.get(module);
            var symbols = Array.from(symbolMap.values());
            symbols.sort(symbolSort);
            if (removeExt(module) !== removeExt(_this.qrlPrefix + _this.filename)) {
                srcImports.import(module, symbols);
            }
        });
        var source = srcImports.toString() + this.src.toString();
        if (this.options.isPretty) {
            try {
                source = (0, standalone_1.format)(source, {
                    parser: 'typescript',
                    plugins: [
                        'prettier/parser-postcss',
                        parser_typescript_1.default,
                        'prettier-plugin-organize-imports',
                    ],
                    htmlWhitespaceSensitivity: 'ignore',
                });
            }
            catch (e) {
                throw new Error(e +
                    '\n' +
                    '========================================================================\n' +
                    source +
                    '\n\n========================================================================');
            }
        }
        return source;
    };
    return File;
}());
exports.File = File;
function symbolSort(a, b) {
    return a.importName < b.importName ? -1 : a.importName === b.importName ? 0 : 1;
}
function removeExt(filename) {
    var indx = filename.lastIndexOf('.');
    return indx == -1 ? filename : filename.substr(0, indx);
}
var SrcBuilder = /** @class */ (function () {
    function SrcBuilder(file, options) {
        this.buf = [];
        this.jsxDepth = 0;
        /**
         * Used to signal that we are generating code for Builder.
         *
         * In builder the `<For/>` iteration places the value on the state.
         */
        this.isBuilder = false;
        this.file = file;
        this.isTypeScript = options.isTypeScript;
        this.isModule = options.isModule;
        this.isJSX = options.isJSX;
        this.isBuilder = options.isBuilder;
    }
    SrcBuilder.prototype.import = function (module, symbols) {
        var _this = this;
        if (this.isModule) {
            this.emit('import');
            if (symbols.length === 1 && symbols[0].importName === 'default') {
                this.emit(' ', symbols[0].localName, ' ');
            }
            else {
                this.emit('{');
                symbols.forEach(function (symbol) {
                    if (symbol.importName === symbol.localName) {
                        _this.emit(symbol.importName);
                    }
                    else {
                        _this.emit(symbol.importName, ' as ', symbol.localName);
                    }
                    _this.emit(',');
                });
                this.emit('}');
            }
            this.emit('from', quote(module), ';');
        }
        else {
            symbols.forEach(function (symbol) {
                _this.const(symbol.localName, function () {
                    this.emit(invoke('require', [quote(module)]));
                    if (symbol.importName !== 'default') {
                        this.emit('.', symbol.importName);
                    }
                });
            });
        }
        if (this.file.options.isPretty) {
            this.emit('\n\n');
        }
        return this;
    };
    SrcBuilder.prototype.emit = function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        for (var i = 0; i < values.length; i++) {
            var value = values[i];
            if (typeof value == 'function') {
                value.call(this);
            }
            else if (value === null) {
                this.push('null');
            }
            else if (value === undefined) {
                this.push('undefined');
            }
            else if (typeof value == 'string') {
                this.push(value);
            }
            else if (typeof value == 'number') {
                this.push(String(value));
            }
            else if (typeof value == 'boolean') {
                this.push(String(value));
            }
            else if (Array.isArray(value)) {
                this.emitList(value);
            }
            else if (typeof value == 'object') {
                this.emit('{');
                var separator = false;
                for (var key in value) {
                    if (Object.prototype.hasOwnProperty.call(value, key)) {
                        if (separator) {
                            this.emit(',');
                        }
                        this.emit(possiblyQuotePropertyName(key)).emit(':', value[key]);
                        separator = true;
                    }
                }
                this.emit('}');
            }
            else {
                throw new Error('Unexpected value: ' + value);
            }
        }
        return this;
    };
    SrcBuilder.prototype.push = function (value) {
        if (value.startsWith(')') ||
            value.startsWith(':') ||
            value.startsWith(']') ||
            value.startsWith('}') ||
            value.startsWith(',') ||
            value.startsWith('?')) {
            // clear last ',' or ';';
            var index = this.buf.length - 1;
            var ch = this.buf[index];
            if (ch.endsWith(',') || ch.endsWith(';')) {
                ch = ch.substring(0, ch.length - 1);
                this.buf[index] = ch;
            }
        }
        this.buf.push(value);
    };
    SrcBuilder.prototype.emitList = function (values, sep) {
        if (sep === void 0) { sep = ','; }
        var separator = false;
        for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
            var value = values_1[_i];
            if (separator) {
                this.emit(sep);
            }
            this.emit(value);
            separator = true;
        }
        return this;
    };
    SrcBuilder.prototype.const = function (name, value, export_, locallyVisible) {
        if (export_ === void 0) { export_ = false; }
        if (locallyVisible === void 0) { locallyVisible = false; }
        if (export_) {
            this.emit(this.isModule
                ? 'export const '
                : (locallyVisible ? 'const ' + name + '=' : '') + 'exports.');
        }
        else {
            this.emit('const ');
        }
        this.emit(name);
        if (value !== undefined) {
            this.emit('=', value);
        }
        this.emit(';');
        return this;
    };
    SrcBuilder.prototype.type = function (def) {
        if (this.isTypeScript) {
            this.emit(':', def);
        }
        return this;
    };
    SrcBuilder.prototype.typeParameters = function (typeParameters) {
        if (this.isTypeScript && typeParameters && typeParameters.length) {
            this.emit('<', typeParameters, '>');
        }
    };
    SrcBuilder.prototype.jsxExpression = function (expression) {
        var previousJsxDepth = this.jsxDepth;
        try {
            if (previousJsxDepth) {
                this.jsxDepth = 0;
                this.isJSX && this.emit('{');
            }
            expression.apply(this);
        }
        finally {
            if (previousJsxDepth) {
                this.isJSX && this.emit('}');
            }
            this.jsxDepth = previousJsxDepth;
        }
    };
    SrcBuilder.prototype.jsxBegin = function (symbol, props, bindings) {
        this.jsxDepth++;
        var self = this;
        if (symbol == 'div' && ('href' in props || 'href' in bindings)) {
            // HACK: if we contain href then we are `a` not `div`
            symbol = 'a';
        }
        if (this.isJSX) {
            this.emit('<' + symbol);
        }
        else {
            this.emit('h(', literalTagName(symbol), ',{');
        }
        for (var key in props) {
            if (Object.prototype.hasOwnProperty.call(props, key) &&
                !ignoreKey(key) &&
                !Object.prototype.hasOwnProperty.call(bindings, key)) {
                emitJsxProp(key, quote(props[key]));
            }
        }
        var _loop_1 = function (rawKey) {
            if (bindings[rawKey].type === 'spread') {
                if (this_1.isJSX) {
                    this_1.emit('{...', bindings[rawKey].code, '}');
                }
                else {
                    this_1.emit('...', bindings[rawKey].code);
                }
            }
            else if (Object.prototype.hasOwnProperty.call(bindings, rawKey) && !ignoreKey(rawKey)) {
                var binding_1 = bindings[rawKey];
                binding_1 =
                    binding_1 && typeof binding_1 == 'object' && 'code' in binding_1 ? binding_1.code : binding_1;
                if (rawKey === 'class' && props.class) {
                    // special case for classes as they can have both static and dynamic binding
                    binding_1 = quote(props.class + ' ') + '+' + binding_1;
                }
                var key = lastProperty(rawKey);
                if (isEvent(key)) {
                    key = key + '$';
                    if (this_1.file.options.isJSX) {
                        binding_1 = "(event)=>".concat(binding_1);
                    }
                    else {
                        binding_1 = "".concat(this_1.file.import(this_1.file.qwikModule, '$').localName, "((event)=>").concat(binding_1, ")");
                    }
                }
                else if (!binding_1 && rawKey in props) {
                    binding_1 = quote(props[rawKey]);
                }
                else if (binding_1 != null && binding_1 === props[key]) {
                    // HACK: workaround for the fact that sometimes the `bindings` have string literals
                    // We assume that when the binding content equals prop content.
                    binding_1 = quote(binding_1);
                }
                else if (typeof binding_1 == 'string' && isStatement(binding_1)) {
                    binding_1 = iif(binding_1);
                }
                if (key === 'hide' || key === 'show') {
                    var _a = key == 'hide' ? ['"none"', '"inherit"'] : ['"inherit"', '"none"'], truthy_1 = _a[0], falsy_1 = _a[1];
                    emitJsxProp('style', function () {
                        this.emit('{display:', binding_1, '?', truthy_1, ':', falsy_1, '}');
                    });
                }
                else {
                    emitJsxProp(key, binding_1);
                }
            }
        };
        var this_1 = this;
        for (var rawKey in bindings) {
            _loop_1(rawKey);
        }
        if (this.isJSX) {
            if (!this.isSelfClosingTag(symbol)) {
                this.emit('>');
            }
        }
        else {
            this.emit('},');
        }
        function emitJsxProp(key, value) {
            if (value) {
                if (key === 'innerHTML')
                    key = 'dangerouslySetInnerHTML';
                if (key === 'dataSet')
                    return; // ignore
                if (self.isJSX) {
                    self.emit(' ', key, '=');
                    if (typeof value == 'string' && value.startsWith('"') && value.endsWith('"')) {
                        self.emit(value);
                    }
                    else {
                        self.emit('{', value, '}');
                    }
                }
                else {
                    self.emit(possiblyQuotePropertyName(key), ':', value, ',');
                }
            }
        }
    };
    SrcBuilder.prototype.isSelfClosingTag = function (symbol) {
        return html_tags_1.SELF_CLOSING_HTML_TAGS.has(String(symbol));
    };
    SrcBuilder.prototype.jsxEnd = function (symbol) {
        if (this.isJSX) {
            if (this.isSelfClosingTag(symbol)) {
                this.emit(' />');
            }
            else {
                this.emit('</', symbol, '>');
            }
        }
        else {
            this.emit('),');
        }
        this.jsxDepth--;
    };
    SrcBuilder.prototype.jsxBeginFragment = function (symbol) {
        this.jsxDepth++;
        if (this.isJSX) {
            this.emit('<>');
        }
        else {
            this.emit('h(', symbol.localName, ',null,');
        }
    };
    SrcBuilder.prototype.jsxEndFragment = function () {
        this.jsxDepth--;
        if (this.isJSX) {
            this.emit('</>');
        }
        else {
            this.emit(')');
        }
    };
    SrcBuilder.prototype.jsxTextBinding = function (exp) {
        if (this.isJSX) {
            this.emit('{', exp, '}');
        }
        else {
            this.emit(exp);
        }
    };
    SrcBuilder.prototype.toString = function () {
        return this.buf.join('');
    };
    return SrcBuilder;
}());
exports.SrcBuilder = SrcBuilder;
function isEvent(name) {
    return name.startsWith('on') && isUppercase(name.charAt(2)) && !name.endsWith('$');
}
function isUppercase(ch) {
    return ch == ch.toUpperCase();
}
var Symbol = /** @class */ (function () {
    function Symbol(importName, localName) {
        this.importName = importName;
        this.localName = localName;
    }
    return Symbol;
}());
exports.Symbol = Symbol;
var Imports = /** @class */ (function () {
    function Imports() {
        this.imports = new Map();
    }
    Imports.prototype.get = function (moduleName, symbolName, asVar) {
        var importSymbols = this.imports.get(moduleName);
        if (!importSymbols) {
            importSymbols = new Map();
            this.imports.set(moduleName, importSymbols);
        }
        var symbol = importSymbols.get(symbolName);
        if (!symbol) {
            symbol = new Symbol(symbolName, asVar || symbolName);
            importSymbols.set(symbolName, symbol);
        }
        return symbol;
    };
    Imports.prototype.hasImport = function (localName) {
        for (var _i = 0, _a = Array.from(this.imports.values()); _i < _a.length; _i++) {
            var symbolMap = _a[_i];
            for (var _b = 0, _c = Array.from(symbolMap.values()); _b < _c.length; _b++) {
                var symbol = _c[_b];
                if (symbol.localName === localName) {
                    return true;
                }
            }
        }
        return false;
    };
    return Imports;
}());
exports.Imports = Imports;
function ignoreKey(key) {
    return (key.startsWith('$') ||
        key.startsWith('_') ||
        key == 'code' ||
        key == '' ||
        key.indexOf('.') !== -1);
}
function possiblyQuotePropertyName(key) {
    return /^\w[\w\d]*$/.test(key) ? key : quote(key);
}
function quote(text) {
    var string = (0, stable_serialize_1.stableJSONserialize)(text);
    // So \u2028 is a line separator character and prettier treats it as such
    // https://www.fileformat.info/info/unicode/char/2028/index.htm
    // That means it can't be inside of a string, so we replace it with `\\u2028`.
    // (see double `\\` vs `\`)
    var parts = string.split('\u2028');
    return parts.join('\\u2028');
}
exports.quote = quote;
function invoke(symbol, args, typeParameters) {
    return function () {
        this.emit(typeof symbol == 'string' ? symbol : symbol.localName);
        this.typeParameters(typeParameters);
        this.emit('(', args, ')');
    };
}
exports.invoke = invoke;
function arrowFnBlock(args, statements, argTypes) {
    return function () {
        this.emit('(');
        for (var i = 0; i < args.length; i++) {
            var arg = args[i];
            var type = argTypes && argTypes[i];
            this.emit(arg);
            if (type && this.file.options.isTypeScript) {
                this.emit(':', type);
            }
            this.emit(',');
        }
        this.emit(')=>{').emitList(statements, ';').emit('}');
    };
}
exports.arrowFnBlock = arrowFnBlock;
function arrowFnValue(args, expression) {
    return function () {
        this.emit('(', args, ')=>', expression);
    };
}
exports.arrowFnValue = arrowFnValue;
var _virtual_index = '_virtual_index;';
var return_virtual_index = 'return _virtual_index;';
function iif(code) {
    if (!code)
        return;
    code = code.trim();
    if (code.endsWith(_virtual_index) && !code.endsWith(return_virtual_index)) {
        code = code.substr(0, code.length - _virtual_index.length) + return_virtual_index;
    }
    if (code.indexOf('export') !== -1) {
        code = (0, builder_1.convertExportDefaultToReturn)(code);
    }
    return function () {
        code && this.emit('(()=>{', code, '})()');
    };
}
exports.iif = iif;
var LOWER_CASE = 'a'.charCodeAt(0) - 1;
function literalTagName(symbol) {
    if (typeof symbol == 'string' &&
        symbol.charCodeAt(0) > LOWER_CASE &&
        symbol.indexOf('.') === -1) {
        return quote(symbol);
    }
    return symbol;
}
/**
 * Returns `true` if the code is a statement (rather than expression).
 *
 * Code is an expression if it is a list of identifiers all connected with a valid separator
 * identifier: [a-z_$](a-z0-9_$)*
 * separator: [()[]{}.-+/*,]
 *
 * it is not 100% but a good enough approximation
 */
function isStatement(code) {
    // remove trailing `!` as it is used to mark a non-null assertion in TS
    // it messes up the logic afterwards
    if (code.endsWith('!')) {
        code = code.substr(0, code.length - 1);
    }
    code = code.trim();
    if ((code.startsWith('(') && code.endsWith(')')) ||
        (code.startsWith('{') && code.endsWith('}'))) {
        // Code starting with `(` is most likely an IFF and hence is an expression.
        return false;
    }
    var codeNoStrings = code.replace(STRING_LITERAL, 'STRING_LITERAL');
    var identifiers = codeNoStrings.split(EXPRESSION_SEPARATORS);
    var filteredIdentifiers = identifiers.filter(function (i) {
        i = i.trim();
        return i && !i.match(EXPRESSION_IDENTIFIER);
    });
    return filteredIdentifiers.length !== 0;
}
exports.isStatement = isStatement;
// https://regexr.com/6cppf
var STRING_LITERAL = /(["'`])((\\{2})*|((\n|.)*?[^\\](\\{2})*))\1/g;
// https://regexr.com/6cpk4
var EXPRESSION_SEPARATORS = /[()\[\]{}.\?:\-+/*,|&]+/;
// https://regexr.com/6cpka
var EXPRESSION_IDENTIFIER = /^\s*[a-zA-Z0-9_$]+\s*$/;
function lastProperty(expr) {
    var parts = expr.split('.');
    return parts[parts.length - 1];
}
exports.lastProperty = lastProperty;
function iteratorProperty(expr) {
    return lastProperty(expr) + 'Item';
}
exports.iteratorProperty = iteratorProperty;
