"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseImports = void 0;
function parseImports(json, node) {
    var _a;
    var source = (_a = node.source) === null || _a === void 0 ? void 0 : _a.value;
    if (source === 'svelte')
        return; // Do not import anything from svelte
    // ^ Maybe this should even be stricter and only allow relative imports and alias ones
    // as you can't import any other svelte specific libraries either...Or can we?
    var importSpecifiers = Object.values(node.specifiers).map(function (index) {
        var _a;
        return _a = {},
            _a[index.local.name] = index.type === 'ImportDefaultSpecifier' ? 'default' : index.local.name,
            _a;
    });
    var imports = {};
    for (var _i = 0, importSpecifiers_1 = importSpecifiers; _i < importSpecifiers_1.length; _i++) {
        var specifier = importSpecifiers_1[_i];
        Object.assign(imports, specifier);
    }
    // only add imports which are actually used
    if (Object.keys(imports).length > 0) {
        json.imports = __spreadArray(__spreadArray([], json.imports, true), [
            { imports: imports, path: source.replace('.svelte', '.lite') },
        ], false);
        // TODO: if import source already exist, combine them
        // e.g. import { lowercase } from 'lodash';
        // e.g. import { uppercase } from 'lodash';
        // should become import { lowercase, uppercase } from 'lodash';
    }
}
exports.parseImports = parseImports;
