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
exports.parseProperties = void 0;
function parseProperties(json, node) {
    var _a;
    var _b, _c;
    var declarations = (_b = node.declaration) === null || _b === void 0 ? void 0 : _b.declarations;
    if (declarations === null || declarations === void 0 ? void 0 : declarations.length) {
        var declaration = declarations[0];
        var property = declaration.id.name;
        var value = (_c = declaration.init) === null || _c === void 0 ? void 0 : _c.value;
        var propertyObject = (_a = {},
            _a[property] = {
                default: value,
            },
            _a);
        json.props = __assign(__assign({}, json.props), propertyObject);
        json.defaultProps = Object.fromEntries(Object.keys(json.props)
            .filter(function (key) { return json.props[key].default; })
            .map(function (key) { return [key, json.props[key].default]; }));
    }
}
exports.parseProperties = parseProperties;
