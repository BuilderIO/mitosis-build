"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertMethodToFunction = void 0;
function convertMethodToFunction(code, properties, lexicalArgs) {
    var out = [];
    var idx = 0;
    var lastIdx = idx;
    var end = code.length;
    var mode = "code" /* Mode.code */;
    var braceDepth = 0;
    var stringEndBraceDepth = -1;
    var stringEndBraceDepthQueue = [];
    var lastCh = null;
    while (idx < end) {
        var ch = code.charCodeAt(idx++);
        switch (mode) {
            case "code" /* Mode.code */:
                if (ch === QUOTE_DOUBLE) {
                    mode = "stringDouble" /* Mode.stringDouble */;
                }
                else if (ch === QUOTE_SINGLE) {
                    mode = "stringSingle" /* Mode.stringSingle */;
                }
                else if (ch === QUOTE_BACK_TICK) {
                    mode = "stringTemplate" /* Mode.stringTemplate */;
                }
                else if (ch === OPEN_BRACE) {
                    braceDepth++;
                }
                else if (lastCh == FORWARD_SLASH && ch == FORWARD_SLASH) {
                    mode = "commentSingleline" /* Mode.commentSingleline */;
                }
                else if (lastCh == FORWARD_SLASH && ch == STAR) {
                    mode = "commentMultiline" /* Mode.commentMultiline */;
                }
                else if (ch === CLOSE_BRACE) {
                    braceDepth--;
                    if (braceDepth === stringEndBraceDepth) {
                        stringEndBraceDepth = stringEndBraceDepthQueue.pop();
                        mode = "stringTemplate" /* Mode.stringTemplate */;
                    }
                }
                else if (isWord(ch, code, idx, 'this') || isWord(ch, code, idx, 'state')) {
                    idx--;
                    flush();
                    consumeIdent();
                    if (code.charCodeAt(idx) == DOT) {
                        idx++;
                        var propEndIdx = findIdentEnd();
                        var identifier = code.substring(idx, propEndIdx);
                        var propType = properties[identifier];
                        if (propType) {
                            var isGetter = code.charCodeAt(propEndIdx) !== OPEN_PAREN;
                            lastIdx = idx = propEndIdx + (isGetter ? 0 : 1);
                            if (isGetter) {
                                if (propType === 'method') {
                                    out.push(identifier, ".bind(null,".concat(lexicalArgs.join(','), ")"));
                                }
                                else {
                                    out.push(identifier, "(".concat(lexicalArgs.join(','), ")"));
                                }
                            }
                            else {
                                out.push(identifier, "(".concat(lexicalArgs.join(','), ","));
                            }
                        }
                        else {
                            flush();
                        }
                    }
                }
                break;
            case "commentSingleline" /* Mode.commentSingleline */:
                if (ch == EOL)
                    mode = "code" /* Mode.code */;
                break;
            case "commentMultiline" /* Mode.commentMultiline */:
                if (lastCh == STAR && ch == FORWARD_SLASH)
                    mode = "code" /* Mode.code */;
                break;
            case "stringSingle" /* Mode.stringSingle */:
                if (lastCh !== BACKSLASH && ch == QUOTE_SINGLE)
                    mode = "code" /* Mode.code */;
                break;
            case "stringDouble" /* Mode.stringDouble */:
                if (lastCh !== BACKSLASH && ch == QUOTE_DOUBLE)
                    mode = "code" /* Mode.code */;
                break;
            case "stringTemplate" /* Mode.stringTemplate */:
                if (lastCh !== BACKSLASH && ch == QUOTE_BACK_TICK) {
                    mode = "code" /* Mode.code */;
                }
                else if (lastCh === DOLLAR && ch == OPEN_BRACE) {
                    mode = "code" /* Mode.code */;
                    stringEndBraceDepthQueue.push(stringEndBraceDepth);
                    stringEndBraceDepth = braceDepth;
                    braceDepth++;
                }
                break;
        }
        lastCh = ch;
    }
    flush();
    return out.join('');
    function flush() {
        out.push(code.substring(lastIdx, idx));
        lastIdx = idx;
    }
    function findIdentEnd() {
        var scanIdx = idx;
        while (isIdentCh(code.charCodeAt(scanIdx)) && scanIdx < end) {
            scanIdx++;
        }
        return scanIdx;
    }
    function consumeIdent() {
        while (isIdentCh(code.charCodeAt(idx))) {
            idx++;
        }
    }
}
exports.convertMethodToFunction = convertMethodToFunction;
function isIdentCh(ch) {
    return ((CHAR_0 <= ch && ch <= CHAR_9) ||
        (CHAR_a <= ch && ch <= CHAR_z) ||
        (CHAR_A <= ch && ch <= CHAR_Z) ||
        ch === UNDERSCORE ||
        ch === DOLLAR);
}
function isWord(ch, code, idx, word) {
    if (ch !== word.charCodeAt(0))
        return false;
    for (var i = 1; i < word.length; i++) {
        if (code.charCodeAt(idx + i - 1) !== word.charCodeAt(i)) {
            return false;
        }
    }
    if (isIdentCh(code.charCodeAt(idx + word.length - 1))) {
        return false;
    }
    return true;
}
var QUOTE_DOUBLE = '"'.charCodeAt(0);
var QUOTE_SINGLE = "'".charCodeAt(0);
var QUOTE_BACK_TICK = '`'.charCodeAt(0);
var BACKSLASH = "\\".charCodeAt(0);
var FORWARD_SLASH = "/".charCodeAt(0);
var EOL = "\n".charCodeAt(0);
var STAR = "*".charCodeAt(0);
var CHAR_0 = "0".charCodeAt(0);
var CHAR_9 = "9".charCodeAt(0);
var CHAR_a = "a".charCodeAt(0);
var CHAR_z = "z".charCodeAt(0);
var CHAR_A = "A".charCodeAt(0);
var CHAR_Z = "Z".charCodeAt(0);
var UNDERSCORE = "_".charCodeAt(0);
var DOLLAR = "$".charCodeAt(0);
var DOT = ".".charCodeAt(0);
var OPEN_PAREN = '('.charCodeAt(0);
var OPEN_BRACE = '{'.charCodeAt(0);
var CLOSE_BRACE = '}'.charCodeAt(0);
