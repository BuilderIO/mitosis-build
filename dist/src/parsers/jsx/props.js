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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectDefaultProps = exports.undoPropsDestructure = void 0;
var babel = __importStar(require("@babel/core"));
var types = babel.types;
function undoPropsDestructure(path) {
    var node = path.node;
    if (node.params.length && types.isObjectPattern(node.params[0])) {
        var param = node.params[0];
        var propsMap_1 = param.properties.reduce(function (pre, cur) {
            if (types.isObjectProperty(cur) &&
                types.isIdentifier(cur.key) &&
                types.isIdentifier(cur.value)) {
                pre[cur.value.name] = "props.".concat(cur.key.name);
                return pre;
            }
            return pre;
        }, {});
        if (param.typeAnnotation) {
            node.params = [
                __assign(__assign({}, babel.types.identifier('props')), { typeAnnotation: param.typeAnnotation }),
            ];
            path.replaceWith(node);
        }
        path.traverse({
            JSXExpressionContainer: function (path) {
                var node = path.node;
                if (types.isIdentifier(node.expression)) {
                    var name_1 = node.expression.name;
                    if (propsMap_1[name_1]) {
                        path.replaceWith(babel.types.jsxExpressionContainer(babel.types.identifier(propsMap_1[name_1])));
                    }
                }
            },
        });
    }
}
exports.undoPropsDestructure = undoPropsDestructure;
function collectDefaultProps(path, context) {
    var _a;
    var expressionStatements = path.node.body.filter(function (statement) {
        return types.isExpressionStatement(statement);
    });
    var defaultPropsStatement = (_a = expressionStatements === null || expressionStatements === void 0 ? void 0 : expressionStatements.filter(function (i) {
        var expression = i.expression;
        return (types.isAssignmentExpression(expression) &&
            types.isMemberExpression(expression.left) &&
            types.isIdentifier(expression.left.property) &&
            expression.left.property.name === 'defaultProps');
    })[0]) !== null && _a !== void 0 ? _a : null;
    if (defaultPropsStatement) {
        defaultPropsStatement === null || defaultPropsStatement === void 0 ? void 0 : defaultPropsStatement.expression.right.properties.forEach(function (i) {
            var _a;
            var _b, _c, _d;
            if ((_b = i.key) === null || _b === void 0 ? void 0 : _b.name) {
                context.builder.component.defaultProps = __assign(__assign({}, ((_c = context.builder.component.defaultProps) !== null && _c !== void 0 ? _c : {})), (_a = {}, _a[(_d = i.key) === null || _d === void 0 ? void 0 : _d.name] = i.value.value, _a));
            }
        });
    }
}
exports.collectDefaultProps = collectDefaultProps;
