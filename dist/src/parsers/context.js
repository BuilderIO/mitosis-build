"use strict";
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
exports.parseContext = void 0;
var babel = __importStar(require("@babel/core"));
var create_mitosis_context_1 = require("../helpers/create-mitosis-context");
var state_1 = require("./jsx/state");
var types = babel.types;
var tsPreset = require('@babel/preset-typescript');
function parseContext(code, options) {
    var found = false;
    var context = (0, create_mitosis_context_1.createMitosisContext)({ name: options.name });
    babel.transform(code, {
        configFile: false,
        babelrc: false,
        presets: [[tsPreset, { isTSX: true, allExtensions: true }]],
        plugins: [
            function () { return ({
                visitor: {
                    Program: function (path) {
                        for (var _i = 0, _a = path.node.body; _i < _a.length; _i++) {
                            var item = _a[_i];
                            if (types.isExportDefaultDeclaration(item)) {
                                var expression = item.declaration;
                                if (types.isCallExpression(expression)) {
                                    if (types.isIdentifier(expression.callee) &&
                                        expression.callee.name === 'createContext') {
                                        var _b = expression.arguments, firstArg = _b[0], secondArg = _b[1];
                                        if (types.isObjectExpression(firstArg)) {
                                            // TODO: support non object values by parsing any node type
                                            // like the logic within each property value of parseStateObject
                                            context.value = (0, state_1.parseStateObjectToMitosisState)(firstArg);
                                            if (types.isObjectExpression(secondArg)) {
                                                for (var _c = 0, _d = secondArg.properties; _c < _d.length; _c++) {
                                                    var prop = _d[_c];
                                                    if (!types.isProperty(prop) || !types.isIdentifier(prop.key))
                                                        continue;
                                                    var isReactive = prop.key.name === 'reactive';
                                                    if (isReactive &&
                                                        types.isBooleanLiteral(prop.value) &&
                                                        prop.value.value) {
                                                        context.type = 'reactive';
                                                    }
                                                }
                                            }
                                            found = true;
                                        }
                                    }
                                }
                            }
                        }
                    },
                },
            }); },
        ],
    });
    if (!found) {
        return null;
    }
    return context;
}
exports.parseContext = parseContext;
