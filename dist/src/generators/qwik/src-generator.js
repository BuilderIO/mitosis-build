"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iteratorProperty = exports.lastProperty = exports.isStatement = exports.iif = exports.arrowFnValue = exports.arrowFnBlock = exports.invoke = exports.quote = exports.Block = exports.Imports = exports.Symbol = exports.SrcBuilder = exports.File = void 0;
var standalone_1 = require("prettier/standalone");
var File = /** @class */ (function () {
    function File(filename, options, qwikModule, qrlPrefix) {
        this.imports = new Imports();
        this.exports = new Map();
        this.filename = filename;
        this.options = options;
        this.src = new SrcBuilder(this.options);
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
    File.prototype.import = function (module, symbol) {
        return this.imports.get(module, symbol);
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
    File.prototype.toString = function () {
        var _this = this;
        var srcImports = new SrcBuilder(this.options);
        var imports = this.imports.imports;
        var modules = Array.from(imports.keys()).sort();
        modules.forEach(function (module) {
            var symbolMap = imports.get(module);
            var symbols = Array.from(symbolMap.keys()).sort();
            if (removeExt(module) !== removeExt(_this.qrlPrefix + _this.filename)) {
                srcImports.import(module, symbols);
            }
        });
        var source = srcImports.toString() + this.src.toString();
        if (this.options.isPretty) {
            source = (0, standalone_1.format)(source, {
                parser: 'typescript',
                plugins: [
                    // To support running in browsers
                    require('prettier/parser-typescript'),
                    require('prettier/parser-postcss'),
                    require('prettier/parser-html'),
                    require('prettier/parser-babel'),
                ],
                htmlWhitespaceSensitivity: 'ignore',
            });
        }
        return source;
    };
    return File;
}());
exports.File = File;
function removeExt(filename) {
    var indx = filename.lastIndexOf('.');
    return indx == -1 ? filename : filename.substr(0, indx);
}
var spaces = [''];
var SrcBuilder = /** @class */ (function () {
    function SrcBuilder(options) {
        this.buf = [];
        this.isTypeScript = options.isTypeScript;
        this.isModule = options.isModule;
        this.isJSX = options.isJSX;
    }
    SrcBuilder.prototype.import = function (module, symbols) {
        var _this = this;
        if (this.isModule) {
            this.emit('import{', symbols, '}from', quote(module), ';');
        }
        else {
            symbols.forEach(function (symbol) {
                _this.const(symbol, function () {
                    this.emit(invoke('require', [quote(module)]), '.', symbol);
                });
            });
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
            value.startsWith('}')) {
            // clear last ',';
            var index = this.buf.length - 1;
            var ch = this.buf[index];
            if (ch.endsWith(',')) {
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
    SrcBuilder.prototype.jsxBegin = function (symbol, props, bindings) {
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
                this.isJSX
                    ? this.emit(' ', key)
                    : this.emit(possiblyQuotePropertyName(key));
                this.isJSX ? this.emit('=') : this.emit(':');
                this.emit(quote(props[key]));
                !this.isJSX && this.emit(',');
            }
        }
        for (var rawKey in bindings) {
            if (Object.prototype.hasOwnProperty.call(bindings, rawKey) &&
                !ignoreKey(rawKey)) {
                var binding = bindings[rawKey];
                var key = lastProperty(rawKey);
                this.isJSX
                    ? this.emit(' ', key)
                    : this.emit(possiblyQuotePropertyName(key));
                this.isJSX ? this.emit('={') : this.emit(':');
                if (binding === props[key]) {
                    // HACK: workaround for the fact that sometimes the `bindings` have string literals
                    // We assume that when the binding content equals prop content.
                    binding = JSON.stringify(binding);
                }
                else if (typeof binding == 'string' && isStatement(binding)) {
                    binding = iif(binding);
                }
                this.emit(binding);
                this.isJSX ? this.emit('}') : this.emit(',');
            }
        }
        if (this.isJSX) {
            this.emit('>');
        }
        else {
            this.emit('},');
        }
    };
    SrcBuilder.prototype.jsxEnd = function (symbol) {
        if (this.isJSX) {
            this.emit('</', symbol, '>');
        }
        else {
            this.emit('),');
        }
    };
    SrcBuilder.prototype.jsxBeginFragment = function (symbol) {
        if (this.isJSX) {
            this.emit('<>');
        }
        else {
            this.emit('h(', symbol.name, ',null,');
        }
    };
    SrcBuilder.prototype.jsxEndFragment = function () {
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
var Symbol = /** @class */ (function () {
    function Symbol(name) {
        this.name = name;
    }
    return Symbol;
}());
exports.Symbol = Symbol;
var Imports = /** @class */ (function () {
    function Imports() {
        this.imports = new Map();
    }
    Imports.prototype.get = function (moduleName, symbolName) {
        var importSymbols = this.imports.get(moduleName);
        if (!importSymbols) {
            importSymbols = new Map();
            this.imports.set(moduleName, importSymbols);
        }
        var symbol = importSymbols.get(symbolName);
        if (!symbol) {
            symbol = new Symbol(symbolName);
            importSymbols.set(symbolName, symbol);
        }
        return symbol;
    };
    return Imports;
}());
exports.Imports = Imports;
function ignoreKey(key) {
    return (key.startsWith('$') ||
        key.startsWith('_') ||
        key == 'code' ||
        key == '' ||
        key == 'builder-id' ||
        key.indexOf('.') !== -1);
}
var Block = /** @class */ (function () {
    function Block(imports) {
        this.imports = imports;
    }
    return Block;
}());
exports.Block = Block;
function possiblyQuotePropertyName(key) {
    return /^\w[\w\d]*$/.test(key) ? key : JSON.stringify(key);
}
function quote(text) {
    return JSON.stringify(text);
}
exports.quote = quote;
function invoke(symbol, args, typeParameters) {
    return function () {
        this.emit(typeof symbol == 'string' ? symbol : symbol.name);
        this.typeParameters(typeParameters);
        this.emit('(', args, ')');
    };
}
exports.invoke = invoke;
function arrowFnBlock(args, statements) {
    return function () {
        this.emit('(', args, ')=>{').emitList(statements, ';').emit('}');
    };
}
exports.arrowFnBlock = arrowFnBlock;
function arrowFnValue(args, expression) {
    return function () {
        this.emit('(', args, ')=>', expression);
    };
}
exports.arrowFnValue = arrowFnValue;
function iif(code) {
    return function () {
        code && this.emit('(()=>{', code, '})();');
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
    code = code.trim();
    if (code.startsWith('(') || code.startsWith('{') || code.endsWith('}')) {
        // Code starting with `(` is most likely and IFF and hence is an expression.
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
var EXPRESSION_SEPARATORS = /[()\[\]{}.\?:\-+/*,]+/;
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
