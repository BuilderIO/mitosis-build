"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSignalAccessPlugin = exports.getSignalTypePlugin = exports.replaceSignalSetters = void 0;
var core_1 = require("@babel/core");
var generator_1 = __importDefault(require("@babel/generator"));
var babel_transform_1 = require("../babel-transform");
var capitalize_1 = require("../capitalize");
var nullable_1 = require("../nullable");
var replace_identifiers_1 = require("../replace-identifiers");
var signals_1 = require("../signals");
var process_code_1 = require("./process-code");
var replaceSignalSetters = function (_a) {
    var code = _a.code, nodeMaps = _a.nodeMaps;
    var _loop_1 = function (from, setTo) {
        code = (0, babel_transform_1.babelTransformExpression)(code, {
            AssignmentExpression: function (path) {
                if (path.node.operator !== '=')
                    return;
                var lhs = path.node.left;
                var rhs = path.node.right;
                if (!core_1.types.isMemberExpression(lhs))
                    return;
                if (!(core_1.types.isObjectExpression(rhs) || core_1.types.isIdentifier(rhs)))
                    return;
                var signalAccess = lhs.object;
                if (!core_1.types.isMemberExpression(signalAccess))
                    return;
                if ((0, generator_1.default)(signalAccess).code !== (0, generator_1.default)(from).code)
                    return;
                /**
                 * Go from:
                 *  a.b.c.value.d = e
                 *
                 * to:
                 *  a.b.setC((PREVIOUS_VALUE) => ({ ...PREVIOUS_VALUE, d: e }))
                 */
                var setter = core_1.types.cloneNode(setTo);
                // TO-DO: replace all `value` references inside of the set logic with `PREVIOUS_VALUE`.
                var prevValueIdentifier = core_1.types.identifier('PREVIOUS_VALUE');
                var setFn = core_1.types.arrowFunctionExpression([prevValueIdentifier], core_1.types.objectExpression([
                    core_1.types.spreadElement(prevValueIdentifier),
                    core_1.types.objectProperty(lhs.property, rhs),
                ]));
                var setterExpression = core_1.types.callExpression(setter, [setFn]);
                path.replaceWith(setterExpression);
            },
        });
    };
    for (var _i = 0, nodeMaps_1 = nodeMaps; _i < nodeMaps_1.length; _i++) {
        var _b = nodeMaps_1[_i], from = _b.from, setTo = _b.setTo;
        _loop_1(from, setTo);
    }
    return code;
};
exports.replaceSignalSetters = replaceSignalSetters;
/**
 * Processes `Signal` type imports, transforming them to the target's equivalent and adding the import to the component.
 */
var getSignalTypePlugin = function (_a) {
    var target = _a.target;
    return function () { return ({
        json: {
            pre: function (json) {
                var _a;
                (0, process_code_1.createCodeProcessorPlugin)(function (codeType, json) {
                    switch (codeType) {
                        // Skip these for now because they break for svelte: `<svelte:element>` becomes `<svelte: element>`.
                        // Besides, fairly impossible to endup with a Signal generic there like `<MyComponent<Signal<number>> />`.
                        case 'dynamic-jsx-elements':
                            return function (x) { return x; };
                        default:
                            return function (code) {
                                var _a;
                                if ((_a = json.signals) === null || _a === void 0 ? void 0 : _a.signalTypeImportName) {
                                    return (0, signals_1.mapSignalType)({
                                        code: code,
                                        signalImportName: json.signals.signalTypeImportName,
                                        target: target,
                                    });
                                }
                                return code;
                            };
                    }
                })(json);
                if ((_a = json.signals) === null || _a === void 0 ? void 0 : _a.signalTypeImportName) {
                    json.imports = json.imports || [];
                    var signalMappedImport = (0, signals_1.getSignalMitosisImportForTarget)(target);
                    if (signalMappedImport) {
                        json.imports.push(signalMappedImport);
                    }
                }
            },
        },
    }); };
};
exports.getSignalTypePlugin = getSignalTypePlugin;
var getSignalMapperForTarget = function (target) {
    switch (target) {
        case 'svelte':
            return {
                getter: function (name) { return core_1.types.identifier('$' + name); },
            };
        case 'react':
        case 'solid':
            return {
                getter: function (name) { return core_1.types.identifier(name); },
                setter: function (name) { return core_1.types.identifier('set' + (0, capitalize_1.capitalize)(name)); },
            };
        default:
            // default case: strip the `.value` accessor
            return {
                getter: function (name) { return core_1.types.identifier(name); },
            };
    }
};
/**
 * Processes `mySignal.value` accessors for props, context, and state.
 */
var getSignalAccessPlugin = function (_a) {
    var target = _a.target;
    return function () { return ({
        json: {
            pre: function (x) {
                return (0, process_code_1.createCodeProcessorPlugin)(function (_codeType, json) { return function (code) {
                    var _a;
                    var mapSignal = getSignalMapperForTarget(target);
                    var nodeMaps = [];
                    for (var propName in json.props) {
                        if (json.props[propName].propertyType === 'reactive') {
                            var getter = core_1.types.memberExpression(core_1.types.identifier('props'), mapSignal.getter(propName));
                            var setter = mapSignal.setter
                                ? core_1.types.memberExpression(core_1.types.identifier('props'), mapSignal.setter(propName))
                                : undefined;
                            nodeMaps.push({
                                from: core_1.types.memberExpression(core_1.types.memberExpression(core_1.types.identifier('props'), core_1.types.identifier(propName)), core_1.types.identifier('value')),
                                to: getter,
                                setTo: setter,
                            });
                            nodeMaps.push({
                                from: core_1.types.optionalMemberExpression(core_1.types.memberExpression(core_1.types.identifier('props'), core_1.types.identifier(propName)), core_1.types.identifier('value'), false, true),
                                to: getter,
                                setTo: setter,
                            });
                        }
                    }
                    for (var propName in json.context.get) {
                        if (json.context.get[propName].type === 'reactive') {
                            nodeMaps.push({
                                from: core_1.types.memberExpression(core_1.types.identifier(propName), core_1.types.identifier('value')),
                                to: mapSignal.getter(propName),
                                setTo: mapSignal.setter ? mapSignal.setter(propName) : undefined,
                            });
                        }
                    }
                    for (var propName in json.state) {
                        if (((_a = json.state[propName]) === null || _a === void 0 ? void 0 : _a.propertyType) === 'reactive') {
                            var to = core_1.types.memberExpression(core_1.types.identifier('state'), mapSignal.getter(propName));
                            var setTO = mapSignal.setter ? mapSignal.setter(propName) : undefined;
                            nodeMaps.push({
                                from: core_1.types.memberExpression(core_1.types.memberExpression(core_1.types.identifier('state'), core_1.types.identifier(propName)), core_1.types.identifier('value')),
                                to: to,
                                setTo: setTO,
                            });
                            nodeMaps.push({
                                from: core_1.types.optionalMemberExpression(core_1.types.memberExpression(core_1.types.identifier('state'), core_1.types.identifier(propName)), core_1.types.identifier('value'), false, true),
                                to: to,
                                setTo: setTO,
                            });
                        }
                    }
                    var filteredNodeMaps = nodeMaps.filter(function (x) { return (0, nullable_1.checkIsDefined)(x.setTo); });
                    // we run state-setter replacement first, because otherwise the other one will catch it.
                    if (filteredNodeMaps.length) {
                        code = (0, exports.replaceSignalSetters)({ code: code, nodeMaps: filteredNodeMaps });
                    }
                    if (nodeMaps.length) {
                        code = (0, replace_identifiers_1.replaceNodes)({ code: code, nodeMaps: nodeMaps });
                    }
                    return code;
                }; })(x);
            },
        },
    }); };
};
exports.getSignalAccessPlugin = getSignalAccessPlugin;
