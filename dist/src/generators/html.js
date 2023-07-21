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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentToCustomElement = exports.componentToHtml = void 0;
var core_1 = require("@babel/core");
var function_1 = require("fp-ts/lib/function");
var lodash_1 = require("lodash");
var standalone_1 = require("prettier/standalone");
var traverse_1 = __importDefault(require("traverse"));
var html_tags_1 = require("../constants/html_tags");
var babel_transform_1 = require("../helpers/babel-transform");
var dash_case_1 = require("../helpers/dash-case");
var fast_clone_1 = require("../helpers/fast-clone");
var get_prop_functions_1 = require("../helpers/get-prop-functions");
var get_props_1 = require("../helpers/get-props");
var get_props_ref_1 = require("../helpers/get-props-ref");
var get_refs_1 = require("../helpers/get-refs");
var get_state_object_string_1 = require("../helpers/get-state-object-string");
var has_bindings_text_1 = require("../helpers/has-bindings-text");
var has_component_1 = require("../helpers/has-component");
var has_props_1 = require("../helpers/has-props");
var has_stateful_dom_1 = require("../helpers/has-stateful-dom");
var is_children_1 = __importDefault(require("../helpers/is-children"));
var is_component_1 = require("../helpers/is-component");
var is_html_attribute_1 = require("../helpers/is-html-attribute");
var is_mitosis_node_1 = require("../helpers/is-mitosis-node");
var map_refs_1 = require("../helpers/map-refs");
var merge_options_1 = require("../helpers/merge-options");
var for_1 = require("../helpers/nodes/for");
var remove_surrounding_block_1 = require("../helpers/remove-surrounding-block");
var render_imports_1 = require("../helpers/render-imports");
var strip_meta_properties_1 = require("../helpers/strip-meta-properties");
var strip_state_and_props_refs_1 = require("../helpers/strip-state-and-props-refs");
var collect_css_1 = require("../helpers/styles/collect-css");
var plugins_1 = require("../modules/plugins");
var mitosis_node_1 = require("../types/mitosis-node");
var isAttribute = function (key) {
    return /-/.test(key);
};
var ATTRIBUTE_KEY_EXCEPTIONS_MAP = {
    class: 'className',
    innerHtml: 'innerHTML',
};
var updateKeyIfException = function (key) {
    var _a;
    return (_a = ATTRIBUTE_KEY_EXCEPTIONS_MAP[key]) !== null && _a !== void 0 ? _a : key;
};
var generateSetElementAttributeCode = function (key, tagName, useValue, options, meta) {
    var _a, _b;
    if (meta === void 0) { meta = {}; }
    if ((_a = options === null || options === void 0 ? void 0 : options.experimental) === null || _a === void 0 ? void 0 : _a.props) {
        return (_b = options === null || options === void 0 ? void 0 : options.experimental) === null || _b === void 0 ? void 0 : _b.props(key, useValue, options);
    }
    var isKey = key === 'key';
    var ignoreKey = /^(innerHTML|key|class|value)$/.test(key);
    var isTextarea = key === 'value' && tagName === 'textarea';
    var isDataSet = /^data-/.test(key);
    var isComponent = Boolean(meta === null || meta === void 0 ? void 0 : meta.component);
    var isHtmlAttr = (0, is_html_attribute_1.isHtmlAttribute)(key, tagName);
    var setAttr = !ignoreKey && (isHtmlAttr || !isTextarea || isAttribute(key));
    return [
        // is html attribute or dash-case
        setAttr ? ";el.setAttribute(\"".concat(key, "\", ").concat(useValue, ");") : '',
        // not attr or dataset or html attr
        !setAttr || !(isHtmlAttr || isDataSet || !isComponent || isKey)
            ? "el.".concat(updateKeyIfException((0, lodash_1.camelCase)(key)), " = ").concat(useValue, ";")
            : '',
        // is component but not html attribute
        isComponent && !isHtmlAttr
            ? // custom-element is created but we're in the middle of the update loop
                "\n      if (el.props) {\n        ;el.props.".concat((0, lodash_1.camelCase)(key), " = ").concat(useValue, ";\n        if (el.update) {\n          ;el.update();\n        }\n      } else {\n        ;el.props = {};\n        ;el.props.").concat((0, lodash_1.camelCase)(key), " = ").concat(useValue, ";\n      }\n      ")
            : '',
    ].join('\n');
};
var addUpdateAfterSet = function (json, options) {
    (0, traverse_1.default)(json).forEach(function (item) {
        var _a;
        if ((0, is_mitosis_node_1.isMitosisNode)(item)) {
            for (var key in item.bindings) {
                var value = (_a = item.bindings[key]) === null || _a === void 0 ? void 0 : _a.code;
                if (value) {
                    var newValue = addUpdateAfterSetInCode(value, options);
                    if (newValue !== value) {
                        item.bindings[key].code = newValue;
                    }
                }
            }
        }
    });
};
var getChildComponents = function (json, options) {
    var childComponents = [];
    json.imports.forEach(function (_a) {
        var imports = _a.imports;
        Object.keys(imports).forEach(function (key) {
            if (imports[key] === 'default') {
                childComponents.push(key);
            }
        });
    });
    return childComponents;
};
var getScopeVars = function (parentScopeVars, value) {
    return parentScopeVars.filter(function (scopeVar) {
        if (typeof value === 'boolean') {
            return value;
        }
        var checkVar = new RegExp('(\\.\\.\\.|,| |;|\\(|^|!)' + scopeVar + '(\\.|,| |;|\\)|$)', 'g');
        return checkVar.test(value);
    });
};
var addScopeVars = function (parentScopeVars, value, fn) {
    return "".concat(getScopeVars(parentScopeVars, value)
        .map(function (scopeVar) {
        return fn(scopeVar);
    })
        .join('\n'));
};
var mappers = {
    Fragment: function (json, options, blockOptions) {
        return json.children.map(function (item) { return blockToHtml(item, options, blockOptions); }).join('\n');
    },
};
var getId = function (json, options) {
    var name = json.properties.$name
        ? (0, dash_case_1.dashCase)(json.properties.$name)
        : /^h\d$/.test(json.name || '') // don't dashcase h1 into h-1
            ? json.name
            : (0, dash_case_1.dashCase)(json.name || 'div');
    var newNameNum = (options.namesMap[name] || 0) + 1;
    options.namesMap[name] = newNameNum;
    return "".concat(name).concat(options.prefix ? "-".concat(options.prefix) : '').concat(name !== json.name && newNameNum === 1 ? '' : "-".concat(newNameNum));
};
var createGlobalId = function (name, options) {
    var newNameNum = (options.namesMap[name] || 0) + 1;
    options.namesMap[name] = newNameNum;
    return "".concat(name).concat(options.prefix ? "-".concat(options.prefix) : '', "-").concat(newNameNum);
};
var deprecatedStripStateAndPropsRefs = function (code, _a) {
    var context = _a.context, contextVars = _a.contextVars, domRefs = _a.domRefs, includeProps = _a.includeProps, includeState = _a.includeState, outputVars = _a.outputVars, replaceWith = _a.replaceWith, stateVars = _a.stateVars;
    return (0, function_1.pipe)((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(code, {
        includeProps: includeProps,
        includeState: includeState,
        replaceWith: replaceWith,
    }), function (newCode) {
        return (0, strip_state_and_props_refs_1.DO_NOT_USE_VARS_TRANSFORMS)(newCode, {
            context: context,
            contextVars: contextVars,
            domRefs: domRefs,
            outputVars: outputVars,
            stateVars: stateVars,
        });
    });
};
// TODO: overloaded function
var updateReferencesInCode = function (code, options, blockOptions) {
    var _a, _b;
    if (blockOptions === void 0) { blockOptions = {}; }
    var contextVars = blockOptions.contextVars || [];
    var context = (blockOptions === null || blockOptions === void 0 ? void 0 : blockOptions.context) || 'this.';
    if ((_a = options === null || options === void 0 ? void 0 : options.experimental) === null || _a === void 0 ? void 0 : _a.updateReferencesInCode) {
        return (_b = options === null || options === void 0 ? void 0 : options.experimental) === null || _b === void 0 ? void 0 : _b.updateReferencesInCode(code, options, {
            stripStateAndPropsRefs: deprecatedStripStateAndPropsRefs,
        });
    }
    if (options.format === 'class') {
        return (0, function_1.pipe)((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(code, {
            includeProps: false,
            includeState: true,
            replaceWith: context + 'state.',
        }), function (newCode) {
            return (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(newCode, {
                // TODO: replace with `this.` and add setters that call this.update()
                includeProps: true,
                includeState: false,
                replaceWith: context + 'props.',
            });
        }, function (newCode) { return (0, strip_state_and_props_refs_1.DO_NOT_USE_CONTEXT_VARS_TRANSFORMS)({ code: newCode, context: context, contextVars: contextVars }); });
    }
    return code;
};
var addOnChangeJs = function (id, options, code) {
    if (!options.onChangeJsById[id]) {
        options.onChangeJsById[id] = '';
    }
    options.onChangeJsById[id] += code;
};
// TODO: spread support
var blockToHtml = function (json, options, blockOptions) {
    var _a, _b, _c, _d, _e, _f, _g;
    if (blockOptions === void 0) { blockOptions = {}; }
    var ComponentName = blockOptions.ComponentName;
    var scopeVars = (blockOptions === null || blockOptions === void 0 ? void 0 : blockOptions.scopeVars) || [];
    var childComponents = (blockOptions === null || blockOptions === void 0 ? void 0 : blockOptions.childComponents) || [];
    var hasData = Object.keys(json.bindings).length;
    var hasDomState = /input|textarea|select/.test(json.name);
    var elId = '';
    if (hasData) {
        elId = getId(json, options);
        json.properties['data-el'] = elId;
    }
    if (hasDomState) {
        json.properties['data-dom-state'] = createGlobalId((ComponentName ? ComponentName + '-' : '') + json.name, options);
    }
    if (mappers[json.name]) {
        return mappers[json.name](json, options, blockOptions);
    }
    if ((0, is_children_1.default)({ node: json })) {
        return "<slot></slot>";
    }
    if (json.properties._text) {
        return json.properties._text;
    }
    if ((_a = json.bindings._text) === null || _a === void 0 ? void 0 : _a.code) {
        // TO-DO: textContent might be better performance-wise
        addOnChangeJs(elId, options, "\n      ".concat(addScopeVars(scopeVars, json.bindings._text.code, function (scopeVar) {
            return "const ".concat(scopeVar, " = ").concat(options.format === 'class' ? 'this.' : '', "getScope(el, \"").concat(scopeVar, "\");");
        }), "\n      ").concat(options.format === 'class' ? 'this.' : '', "renderTextNode(el, ").concat(json.bindings._text.code, ");"));
        return "<template data-el=\"".concat(elId, "\"><!-- ").concat((_b = json.bindings._text) === null || _b === void 0 ? void 0 : _b.code, " --></template>");
    }
    var str = '';
    if ((0, mitosis_node_1.checkIsForNode)(json)) {
        var forArguments = (0, for_1.getForArguments)(json);
        var localScopeVars_1 = __spreadArray(__spreadArray([], scopeVars, true), forArguments, true);
        var argsStr = forArguments.map(function (arg) { return "\"".concat(arg, "\""); }).join(',');
        addOnChangeJs(elId, options, 
        // TODO: be smarter about rendering, deleting old items and adding new ones by
        // querying dom potentially
        "\n        let array = ".concat((_c = json.bindings.each) === null || _c === void 0 ? void 0 : _c.code, ";\n        ").concat(options.format === 'class' ? 'this.' : '', "renderLoop(el, array, ").concat(argsStr, ");\n      "));
        // TODO: decide on how to handle this...
        str += "\n      <template data-el=\"".concat(elId, "\">");
        if (json.children) {
            str += json.children
                .map(function (item) {
                return blockToHtml(item, options, __assign(__assign({}, blockOptions), { scopeVars: localScopeVars_1 }));
            })
                .join('\n');
        }
        str += '</template>';
    }
    else if (json.name === 'Show') {
        var whenCondition = ((_d = json.bindings.when) === null || _d === void 0 ? void 0 : _d.code).replace(/;$/, '');
        addOnChangeJs(elId, options, "\n        ".concat(addScopeVars(scopeVars, whenCondition, function (scopeVar) {
            return "const ".concat(scopeVar, " = ").concat(options.format === 'class' ? 'this.' : '', "getScope(el, \"").concat(scopeVar, "\");");
        }), "\n        const whenCondition = ").concat(whenCondition, ";\n        if (whenCondition) {\n          ").concat(options.format === 'class' ? 'this.' : '', "showContent(el)\n        }\n      "));
        str += "<template data-el=\"".concat(elId, "\">");
        if (json.children) {
            str += json.children.map(function (item) { return blockToHtml(item, options, blockOptions); }).join('\n');
        }
        str += '</template>';
    }
    else {
        var component = childComponents.find(function (impName) { return impName === json.name; });
        var elSelector = component ? (0, lodash_1.kebabCase)(json.name) : json.name;
        str += "<".concat(elSelector, " ");
        // For now, spread is not supported
        // if (json.bindings._spread === '_spread') {
        //   str += `
        //       {% for _attr in ${json.bindings._spread} %}
        //         {{ _attr[0] }}="{{ _attr[1] }}"
        //       {% endfor %}
        //     `;
        // }
        for (var key in json.properties) {
            if (key === 'innerHTML') {
                continue;
            }
            if (key.startsWith('$')) {
                continue;
            }
            var value = (json.properties[key] || '').replace(/"/g, '&quot;').replace(/\n/g, '\\n');
            str += " ".concat(key, "=\"").concat(value, "\" ");
        }
        // batch all local vars within the bindings
        var batchScopeVars_1 = {};
        var injectOnce = false;
        var startInjectVar = '%%START_VARS%%';
        for (var key in json.bindings) {
            if (((_e = json.bindings[key]) === null || _e === void 0 ? void 0 : _e.type) === 'spread' || key === 'css') {
                continue;
            }
            var value = (_f = json.bindings[key]) === null || _f === void 0 ? void 0 : _f.code;
            var cusArg = ((_g = json.bindings[key]) === null || _g === void 0 ? void 0 : _g.arguments) || ['event'];
            // TODO: proper babel transform to replace. Util for this
            var useValue = value;
            if (key.startsWith('on')) {
                var event_1 = key.replace('on', '').toLowerCase();
                if (!(0, is_component_1.isComponent)(json) && event_1 === 'change') {
                    event_1 = 'input';
                }
                var fnName = (0, lodash_1.camelCase)("on-".concat(elId, "-").concat(event_1));
                var codeContent = (0, remove_surrounding_block_1.removeSurroundingBlock)(updateReferencesInCode(useValue, options, blockOptions));
                options.js += "\n          // Event handler for '".concat(event_1, "' event on ").concat(elId, "\n          ").concat(options.format === 'class'
                    ? "this.".concat(fnName, " = (").concat(cusArg.join(','), ") => {")
                    : "function ".concat(fnName, " (").concat(cusArg.join(','), ") {"), "\n              ").concat(addScopeVars(scopeVars, codeContent, function (scopeVar) {
                    return "const ".concat(scopeVar, " = ").concat(options.format === 'class' ? 'this.' : '', "getScope(event.currentTarget, \"").concat(scopeVar, "\");");
                }), "\n            ").concat(codeContent, "\n          }\n        ");
                var fnIdentifier = "".concat(options.format === 'class' ? 'this.' : '').concat(fnName);
                addOnChangeJs(elId, options, "\n            ;el.removeEventListener('".concat(event_1, "', ").concat(fnIdentifier, ");\n            ;el.addEventListener('").concat(event_1, "', ").concat(fnIdentifier, ");\n          "));
            }
            else if (key === 'ref') {
                str += " data-ref=\"".concat(ComponentName, "-").concat(useValue, "\" ");
            }
            else {
                if (key === 'style') {
                    addOnChangeJs(elId, options, "\n            ".concat(addScopeVars(scopeVars, useValue, function (scopeVar) {
                        return "const ".concat(scopeVar, " = ").concat(options.format === 'class' ? 'this.' : '', "getScope(el, \"").concat(scopeVar, "\");");
                    }), "\n            ;Object.assign(el.style, ").concat(useValue, ");"));
                }
                else {
                    // gather all local vars to inject later
                    getScopeVars(scopeVars, useValue).forEach(function (key) {
                        // unique keys
                        batchScopeVars_1[key] = true;
                    });
                    addOnChangeJs(elId, options, "\n            ".concat(injectOnce ? '' : startInjectVar, "\n            ").concat(generateSetElementAttributeCode(key, elSelector, useValue, options, {
                        component: component,
                    }), "\n            "));
                    if (!injectOnce) {
                        injectOnce = true;
                    }
                }
            }
        }
        // batch inject local vars in the beginning of the function block
        var codeBlock = options.onChangeJsById[elId];
        var testInjectVar = new RegExp(startInjectVar);
        if (codeBlock && testInjectVar.test(codeBlock)) {
            var localScopeVars = Object.keys(batchScopeVars_1);
            options.onChangeJsById[elId] = codeBlock.replace(startInjectVar, "\n        ".concat(addScopeVars(localScopeVars, true, function (scopeVar) {
                return "const ".concat(scopeVar, " = ").concat(options.format === 'class' ? 'this.' : '', "getScope(el, \"").concat(scopeVar, "\");");
            }), "\n        "));
        }
        if (html_tags_1.SELF_CLOSING_HTML_TAGS.has(json.name)) {
            return str + ' />';
        }
        str += '>';
        if (json.children) {
            str += json.children.map(function (item) { return blockToHtml(item, options, blockOptions); }).join('\n');
        }
        if (json.properties.innerHTML) {
            // Maybe put some kind of safety here for broken HTML such as no close tag
            str += htmlDecode(json.properties.innerHTML);
        }
        str += "</".concat(elSelector, ">");
    }
    return str;
};
function addUpdateAfterSetInCode(code, options, useString) {
    if (code === void 0) { code = ''; }
    if (useString === void 0) { useString = options.format === 'class' ? 'this.update' : 'update'; }
    var updates = 0;
    return (0, babel_transform_1.babelTransformExpression)(code, {
        AssignmentExpression: function (path) {
            var _a, _b;
            var node = path.node;
            if (core_1.types.isMemberExpression(node.left)) {
                if (core_1.types.isIdentifier(node.left.object)) {
                    // TODO: utillity to properly trace this reference to the beginning
                    if (node.left.object.name === 'state') {
                        // TODO: ultimately do updates by property, e.g. updateName()
                        // that updates any attributes dependent on name, etcç
                        var parent_1 = path;
                        // `_temp = ` assignments are created sometimes when we insertAfter
                        // for simple expressions. this causes us to re-process the same expression
                        // in an infinite loop
                        while ((parent_1 = parent_1.parentPath)) {
                            if (core_1.types.isAssignmentExpression(parent_1.node) &&
                                core_1.types.isIdentifier(parent_1.node.left) &&
                                parent_1.node.left.name.startsWith('_temp')) {
                                return;
                            }
                        }
                        // Uncomment to debug infinite loops:
                        // if (updates++ > 1000) {
                        //   console.error('Infinite assignment detected');
                        //   return;
                        // }
                        if ((_a = options === null || options === void 0 ? void 0 : options.experimental) === null || _a === void 0 ? void 0 : _a.addUpdateAfterSetInCode) {
                            useString = (_b = options === null || options === void 0 ? void 0 : options.experimental) === null || _b === void 0 ? void 0 : _b.addUpdateAfterSetInCode(useString, options, {
                                node: node,
                                code: code,
                                types: core_1.types,
                            });
                        }
                        path.insertAfter(core_1.types.callExpression(core_1.types.identifier(useString), []));
                    }
                }
            }
        },
    });
}
var htmlDecode = function (html) { return html.replace(/&quot;/gi, '"'); };
// TODO: props support via custom elements
var componentToHtml = function (_options) {
    if (_options === void 0) { _options = {}; }
    return function (_a) {
        var _b, _c, _d, _e, _f, _g, _h, _j, _k;
        var component = _a.component;
        var options = (0, merge_options_1.initializeOptions)({
            target: 'html',
            component: component,
            defaults: __assign(__assign({}, _options), { onChangeJsById: {}, js: '', namesMap: {}, format: 'script' }),
        });
        var json = (0, fast_clone_1.fastClone)(component);
        if (options.plugins) {
            json = (0, plugins_1.runPreJsonPlugins)({ json: json, plugins: options.plugins });
        }
        addUpdateAfterSet(json, options);
        var componentHasProps = (0, has_props_1.hasProps)(json);
        var hasLoop = (0, has_component_1.hasComponent)('For', json);
        var hasShow = (0, has_component_1.hasComponent)('Show', json);
        var hasTextBinding = (0, has_bindings_text_1.hasBindingsText)(json);
        if (options.plugins) {
            json = (0, plugins_1.runPostJsonPlugins)({ json: json, plugins: options.plugins });
        }
        var css = (0, collect_css_1.collectCss)(json, {
            prefix: options.prefix,
        });
        var str = json.children.map(function (item) { return blockToHtml(item, options); }).join('\n');
        if (css.trim().length) {
            str += "<style>".concat(css, "</style>");
        }
        var hasChangeListeners = Boolean(Object.keys(options.onChangeJsById).length);
        var hasGeneratedJs = Boolean(options.js.trim().length);
        if (hasChangeListeners || hasGeneratedJs || ((_b = json.hooks.onMount) === null || _b === void 0 ? void 0 : _b.code) || hasLoop) {
            // TODO: collectJs helper for here and liquid
            str += "\n      <script>\n      (() => {\n        const state = ".concat((0, get_state_object_string_1.getStateObjectStringFromComponent)(json, {
                valueMapper: function (value) {
                    return addUpdateAfterSetInCode(updateReferencesInCode(value, options), options);
                },
            }), ";\n        ").concat(componentHasProps ? "let props = {};" : '', "\n        let context = null;\n        let nodesToDestroy = [];\n        let pendingUpdate = false;\n        ").concat(!((_d = (_c = json.hooks) === null || _c === void 0 ? void 0 : _c.onInit) === null || _d === void 0 ? void 0 : _d.code) ? '' : 'let onInitOnce = false;', "\n\n        function destroyAnyNodes() {\n          // destroy current view template refs before rendering again\n          nodesToDestroy.forEach(el => el.remove());\n          nodesToDestroy = [];\n        }\n        ").concat(!hasChangeListeners
                ? ''
                : "\n        \n        // Function to update data bindings and loops\n        // call update() when you mutate state and need the updates to reflect\n        // in the dom\n        function update() {\n          if (pendingUpdate === true) {\n            return;\n          }\n          pendingUpdate = true;\n          ".concat(Object.keys(options.onChangeJsById)
                    .map(function (key) {
                    var value = options.onChangeJsById[key];
                    if (!value) {
                        return '';
                    }
                    return "\n              document.querySelectorAll(\"[data-el='".concat(key, "']\").forEach((el) => {\n                ").concat(value, "\n              });\n            ");
                })
                    .join('\n\n'), "\n\n          destroyAnyNodes();\n\n          ").concat(!((_e = json.hooks.onUpdate) === null || _e === void 0 ? void 0 : _e.length)
                    ? ''
                    : "\n                ".concat(json.hooks.onUpdate.reduce(function (code, hook) {
                        code += addUpdateAfterSetInCode(updateReferencesInCode(hook.code, options), options);
                        return code + '\n';
                    }, ''), " \n                "), "\n\n          pendingUpdate = false;\n        }\n\n        ").concat(options.js, "\n\n        // Update with initial state on first load\n        update();\n        "), "\n\n        ").concat(!((_g = (_f = json.hooks) === null || _f === void 0 ? void 0 : _f.onInit) === null || _g === void 0 ? void 0 : _g.code)
                ? ''
                : "\n            if (!onInitOnce) {\n              ".concat(updateReferencesInCode(addUpdateAfterSetInCode((_j = (_h = json.hooks) === null || _h === void 0 ? void 0 : _h.onInit) === null || _j === void 0 ? void 0 : _j.code, options), options), "\n              onInitOnce = true;\n            }\n            "), "\n\n        ").concat(!((_k = json.hooks.onMount) === null || _k === void 0 ? void 0 : _k.code)
                ? ''
                : // TODO: make prettier by grabbing only the function body
                    "\n              // onMount\n              ".concat(updateReferencesInCode(addUpdateAfterSetInCode(json.hooks.onMount.code, options), options), " \n              "), "\n\n        ").concat(!hasShow
                ? ''
                : "\n          function showContent(el) {\n            // https://developer.mozilla.org/en-US/docs/Web/API/HTMLTemplateElement/content\n            // grabs the content of a node that is between <template> tags\n            // iterates through child nodes to register all content including text elements\n            // attaches the content after the template\n  \n  \n            const elementFragment = el.content.cloneNode(true);\n            const children = Array.from(elementFragment.childNodes)\n            children.forEach(child => {\n              if (el?.scope) {\n                child.scope = el.scope;\n              }\n              if (el?.context) {\n                child.context = el.context;\n              }\n              nodesToDestroy.push(child);\n            });\n            el.after(elementFragment);\n          }\n  \n        ", "\n        ").concat(!hasTextBinding
                ? ''
                : "\n          // Helper text DOM nodes\n          function renderTextNode(el, text) {\n            const textNode = document.createTextNode(text);\n            if (el?.scope) {\n              textNode.scope = el.scope\n            }\n            if (el?.context) {\n              child.context = el.context;\n            }\n            el.after(textNode);\n            nodesToDestroy.push(el.nextSibling);\n          }\n          ", "\n        ").concat(!hasLoop
                ? ''
                : "\n          // Helper to render loops\n          function renderLoop(template, array, itemName, itemIndex, collectionName) {\n            const collection = [];\n            for (let [index, value] of array.entries()) {\n              const elementFragment = template.content.cloneNode(true);\n              const children = Array.from(elementFragment.childNodes)\n              const localScope = {};\n              let scope = localScope;\n              if (template?.scope) {\n                const getParent = {\n                  get(target, prop, receiver) {\n                    if (prop in target) {\n                      return target[prop];\n                    }\n                    if (prop in template.scope) {\n                      return template.scope[prop];\n                    }\n                    return target[prop];\n                  }\n                };\n                scope = new Proxy(localScope, getParent);\n              }\n              children.forEach((child) => {\n                if (itemName !== undefined) {\n                  scope[itemName] = value;\n                }\n                if (itemIndex !== undefined) {\n                  scope[itemIndex] = index;\n                }\n                if (collectionName !== undefined) {\n                  scope[collectionName] = array;\n                }\n                child.scope = scope;\n                if (template.context) {\n                  child.context = template.context;\n                }\n                this.nodesToDestroy.push(child);\n                collection.unshift(child);\n              });\n              collection.forEach(child => template.after(child));\n            }\n          }\n\n          function getScope(el, name) {\n            do {\n              let value = el?.scope?.[name]\n              if (value !== undefined) {\n                return value\n              }\n            } while ((el = el.parentNode));\n          }\n        ", "\n      })()\n      </script>\n    ");
        }
        if (options.plugins) {
            str = (0, plugins_1.runPreCodePlugins)({ json: json, code: str, plugins: options.plugins });
        }
        if (options.prettier !== false) {
            try {
                str = (0, standalone_1.format)(str, {
                    parser: 'html',
                    htmlWhitespaceSensitivity: 'ignore',
                    plugins: [
                        // To support running in browsers
                        require('prettier/parser-html'),
                        require('prettier/parser-postcss'),
                        require('prettier/parser-babel'),
                    ],
                });
            }
            catch (err) {
                console.warn('Could not prettify', { string: str }, err);
            }
        }
        if (options.plugins) {
            str = (0, plugins_1.runPostCodePlugins)({ json: json, code: str, plugins: options.plugins });
        }
        return str;
    };
};
exports.componentToHtml = componentToHtml;
// TODO: props support via custom elements
var componentToCustomElement = function (_options) {
    if (_options === void 0) { _options = {}; }
    return function (_a) {
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14;
        var component = _a.component;
        var ComponentName = component.name;
        var kebabName = (0, lodash_1.kebabCase)(ComponentName);
        var options = (0, merge_options_1.initializeOptions)({
            target: 'customElement',
            component: component,
            defaults: __assign(__assign({ prefix: kebabName }, _options), { onChangeJsById: {}, js: '', namesMap: {}, format: 'class' }),
        });
        var json = (0, fast_clone_1.fastClone)(component);
        if (options.plugins) {
            json = (0, plugins_1.runPreJsonPlugins)({ json: json, plugins: options.plugins });
        }
        var _15 = (0, get_props_ref_1.getPropsRef)(json, true), forwardProp = _15[0], hasPropRef = _15[1];
        var contextVars = Object.keys(((_b = json === null || json === void 0 ? void 0 : json.context) === null || _b === void 0 ? void 0 : _b.get) || {});
        var childComponents = getChildComponents(json, options);
        var componentHasProps = (0, has_props_1.hasProps)(json);
        var componentHasStatefulDom = (0, has_stateful_dom_1.hasStatefulDom)(json);
        var props = (0, get_props_1.getProps)(json);
        // prevent jsx props from showing up as @Input
        if (hasPropRef) {
            props.delete(forwardProp);
        }
        var outputs = (0, get_prop_functions_1.getPropFunctions)(json);
        var domRefs = (0, get_refs_1.getRefs)(json);
        var jsRefs = Object.keys(json.refs).filter(function (ref) { return !domRefs.has(ref); });
        (0, map_refs_1.mapRefs)(json, function (refName) { return "self._".concat(refName); });
        var context = contextVars.map(function (variableName) {
            var _a, _b, _c;
            var token = (_a = json === null || json === void 0 ? void 0 : json.context) === null || _a === void 0 ? void 0 : _a.get[variableName].name;
            if ((_b = options === null || options === void 0 ? void 0 : options.experimental) === null || _b === void 0 ? void 0 : _b.htmlContext) {
                return (_c = options === null || options === void 0 ? void 0 : options.experimental) === null || _c === void 0 ? void 0 : _c.htmlContext(variableName, token);
            }
            return "this.".concat(variableName, " = this.getContext(this._root, ").concat(token, ")");
        });
        var setContext = [];
        for (var key in json.context.set) {
            var _16 = json.context.set[key], name_1 = _16.name, value = _16.value, ref = _16.ref;
            setContext.push({ name: name_1, value: value, ref: ref });
        }
        addUpdateAfterSet(json, options);
        var hasContext = context.length;
        var hasLoop = (0, has_component_1.hasComponent)('For', json);
        var hasScope = hasLoop;
        var hasShow = (0, has_component_1.hasComponent)('Show', json);
        if (options.plugins) {
            json = (0, plugins_1.runPostJsonPlugins)({ json: json, plugins: options.plugins });
        }
        var css = '';
        if ((_c = options === null || options === void 0 ? void 0 : options.experimental) === null || _c === void 0 ? void 0 : _c.css) {
            css = (_d = options === null || options === void 0 ? void 0 : options.experimental) === null || _d === void 0 ? void 0 : _d.css(json, options, {
                collectCss: collect_css_1.collectCss,
                prefix: options.prefix,
            });
        }
        else {
            css = (0, collect_css_1.collectCss)(json, {
                prefix: options.prefix,
            });
        }
        (0, strip_meta_properties_1.stripMetaProperties)(json);
        var html = json.children
            .map(function (item) {
            return blockToHtml(item, options, {
                childComponents: childComponents,
                props: props,
                outputs: outputs,
                ComponentName: ComponentName,
                contextVars: contextVars,
            });
        })
            .join('\n');
        if ((_e = options === null || options === void 0 ? void 0 : options.experimental) === null || _e === void 0 ? void 0 : _e.childrenHtml) {
            html = (_f = options === null || options === void 0 ? void 0 : options.experimental) === null || _f === void 0 ? void 0 : _f.childrenHtml(html, kebabName, json, options);
        }
        if ((_g = options === null || options === void 0 ? void 0 : options.experimental) === null || _g === void 0 ? void 0 : _g.cssHtml) {
            html += (_h = options === null || options === void 0 ? void 0 : options.experimental) === null || _h === void 0 ? void 0 : _h.cssHtml(css);
        }
        else if (css.length) {
            html += "<style>".concat(css, "</style>");
        }
        if (options.prettier !== false) {
            try {
                html = (0, standalone_1.format)(html, {
                    parser: 'html',
                    htmlWhitespaceSensitivity: 'ignore',
                    plugins: [
                        // To support running in browsers
                        require('prettier/parser-html'),
                        require('prettier/parser-postcss'),
                        require('prettier/parser-babel'),
                        require('prettier/parser-typescript'),
                    ],
                });
                html = html.trim().replace(/\n/g, '\n      ');
            }
            catch (err) {
                console.warn('Could not prettify', { string: html }, err);
            }
        }
        var str = "\n      ".concat(json.types ? json.types.join('\n') : '', "\n      ").concat((0, render_imports_1.renderPreComponent)({ component: json, target: 'customElement' }), "\n      /**\n       * Usage:\n       * \n       *  <").concat(kebabName, "></").concat(kebabName, ">\n       * \n       */\n      class ").concat(ComponentName, " extends ").concat(((_j = options === null || options === void 0 ? void 0 : options.experimental) === null || _j === void 0 ? void 0 : _j.classExtends)
            ? (_k = options === null || options === void 0 ? void 0 : options.experimental) === null || _k === void 0 ? void 0 : _k.classExtends(json, options)
            : 'HTMLElement', " {\n        ").concat(Array.from(domRefs)
            .map(function (ref) {
            return "\n        get _".concat(ref, "() {\n          return this._root.querySelector(\"[data-ref='").concat(ComponentName, "-").concat(ref, "']\")\n        }\n            ");
        })
            .join('\n'), "\n\n        get _root() {\n          return this.shadowRoot || this;\n        }\n\n        constructor() {\n          super();\n          const self = this;\n          ").concat(
        // TODO: more than one context not injector
        setContext.length === 1 && ((_l = setContext === null || setContext === void 0 ? void 0 : setContext[0]) === null || _l === void 0 ? void 0 : _l.ref)
            ? "this.context = ".concat(setContext[0].ref)
            : '', "\n\n          ").concat(!((_o = (_m = json.hooks) === null || _m === void 0 ? void 0 : _m.onInit) === null || _o === void 0 ? void 0 : _o.code) ? '' : 'this.onInitOnce = false;', "\n\n          this.state = ").concat((0, get_state_object_string_1.getStateObjectStringFromComponent)(json, {
            valueMapper: function (value) {
                return (0, function_1.pipe)((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(addUpdateAfterSetInCode(value, options, 'self.update'), {
                    includeProps: false,
                    includeState: true,
                    // TODO: if it's an arrow function it's this.state.
                    replaceWith: 'self.state.',
                }), function (newCode) {
                    return (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(newCode, {
                        // TODO: replace with `this.` and add setters that call this.update()
                        includeProps: true,
                        includeState: false,
                        replaceWith: 'self.props.',
                    });
                }, function (code) {
                    return (0, strip_state_and_props_refs_1.DO_NOT_USE_CONTEXT_VARS_TRANSFORMS)({
                        code: code,
                        contextVars: contextVars,
                        // correctly ref the class not state object
                        context: 'self.',
                    });
                });
            },
        }), ";\n          if (!this.props) {\n            this.props = {};\n          }\n          ").concat(!componentHasProps
            ? ''
            : "\n          this.componentProps = [".concat(Array.from(props)
                .map(function (prop) { return "\"".concat(prop, "\""); })
                .join(','), "];\n          "), "\n\n          ").concat(!((_p = json.hooks.onUpdate) === null || _p === void 0 ? void 0 : _p.length)
            ? ''
            : "\n            this.updateDeps = [".concat((_q = json.hooks.onUpdate) === null || _q === void 0 ? void 0 : _q.map(function (hook) { return updateReferencesInCode((hook === null || hook === void 0 ? void 0 : hook.deps) || '[]', options); }).join(','), "];\n            "), "\n\n          // used to keep track of all nodes created by show/for\n          this.nodesToDestroy = [];\n          // batch updates\n          this.pendingUpdate = false;\n          ").concat(((_r = options === null || options === void 0 ? void 0 : options.experimental) === null || _r === void 0 ? void 0 : _r.componentConstructor)
            ? (_s = options === null || options === void 0 ? void 0 : options.experimental) === null || _s === void 0 ? void 0 : _s.componentConstructor(json, options)
            : '', "\n\n          ").concat(options.js, "\n\n          ").concat(jsRefs
            .map(function (ref) {
            var _a;
            // const typeParameter = json['refs'][ref]?.typeParameter || '';
            var argument = ((_a = json['refs'][ref]) === null || _a === void 0 ? void 0 : _a.argument) || 'null';
            return "this._".concat(ref, " = ").concat(argument);
        })
            .join('\n'), "\n\n          if (").concat((_t = json.meta.useMetadata) === null || _t === void 0 ? void 0 : _t.isAttachedToShadowDom, ") {\n            this.attachShadow({ mode: 'open' })\n          }\n        }\n\n\n        ").concat(!((_u = json.hooks.onUnMount) === null || _u === void 0 ? void 0 : _u.code)
            ? ''
            : "\n          disconnectedCallback() {\n            ".concat(((_v = options === null || options === void 0 ? void 0 : options.experimental) === null || _v === void 0 ? void 0 : _v.disconnectedCallback)
                ? (_w = options === null || options === void 0 ? void 0 : options.experimental) === null || _w === void 0 ? void 0 : _w.disconnectedCallback(json, options)
                : "\n            // onUnMount\n            ".concat(updateReferencesInCode(addUpdateAfterSetInCode(json.hooks.onUnMount.code, options), options, {
                    contextVars: contextVars,
                }), "\n            this.destroyAnyNodes(); // clean up nodes when component is destroyed\n            ").concat(!((_y = (_x = json.hooks) === null || _x === void 0 ? void 0 : _x.onInit) === null || _y === void 0 ? void 0 : _y.code) ? '' : 'this.onInitOnce = false;', "\n            "), "\n          }\n          "), "\n\n        destroyAnyNodes() {\n          // destroy current view template refs before rendering again\n          this.nodesToDestroy.forEach(el => el.remove());\n          this.nodesToDestroy = [];\n        }\n\n        connectedCallback() {\n          ").concat(context.join('\n'), "\n          ").concat(!componentHasProps
            ? ''
            : "\n          this.getAttributeNames().forEach((attr) => {\n            const jsVar = attr.replace(/-/g, '');\n            const regexp = new RegExp(jsVar, 'i');\n            this.componentProps.forEach(prop => {\n              if (regexp.test(prop)) {\n                const attrValue = this.getAttribute(attr);\n                if (this.props[prop] !== attrValue) {\n                  this.props[prop] = attrValue;\n                }\n              }\n            });\n          });\n          ", "\n          ").concat(((_z = options === null || options === void 0 ? void 0 : options.experimental) === null || _z === void 0 ? void 0 : _z.connectedCallbackUpdate)
            ? (_0 = options === null || options === void 0 ? void 0 : options.experimental) === null || _0 === void 0 ? void 0 : _0.connectedCallbackUpdate(json, html, options)
            : "\n              this._root.innerHTML = `\n      ".concat(html, "`;\n              this.pendingUpdate = true;\n              ").concat(!((_2 = (_1 = json.hooks) === null || _1 === void 0 ? void 0 : _1.onInit) === null || _2 === void 0 ? void 0 : _2.code) ? '' : 'this.onInit();', "\n              this.render();\n              this.onMount();\n              this.pendingUpdate = false;\n              this.update();\n              "), "\n        }\n        ").concat(!((_4 = (_3 = json.hooks) === null || _3 === void 0 ? void 0 : _3.onInit) === null || _4 === void 0 ? void 0 : _4.code)
            ? ''
            : "\n            onInit() {\n              ".concat(!((_6 = (_5 = json.hooks) === null || _5 === void 0 ? void 0 : _5.onInit) === null || _6 === void 0 ? void 0 : _6.code)
                ? ''
                : "\n                  if (!this.onInitOnce) {\n                    ".concat(updateReferencesInCode(addUpdateAfterSetInCode((_8 = (_7 = json.hooks) === null || _7 === void 0 ? void 0 : _7.onInit) === null || _8 === void 0 ? void 0 : _8.code, options), options, {
                    contextVars: contextVars,
                }), "\n                    this.onInitOnce = true;\n                  }"), "\n            }\n            "), "\n\n        ").concat(!hasShow
            ? ''
            : "\n          showContent(el) {\n            // https://developer.mozilla.org/en-US/docs/Web/API/HTMLTemplateElement/content\n            // grabs the content of a node that is between <template> tags\n            // iterates through child nodes to register all content including text elements\n            // attaches the content after the template\n  \n  \n            const elementFragment = el.content.cloneNode(true);\n            const children = Array.from(elementFragment.childNodes)\n            children.forEach(child => {\n              if (el?.scope) {\n                child.scope = el.scope;\n              }\n              if (el?.context) {\n                child.context = el.context;\n              }\n              this.nodesToDestroy.push(child);\n            });\n            el.after(elementFragment);\n          }", "\n        ").concat(!((_9 = options === null || options === void 0 ? void 0 : options.experimental) === null || _9 === void 0 ? void 0 : _9.attributeChangedCallback)
            ? ''
            : "\n          attributeChangedCallback(name, oldValue, newValue) {\n            ".concat((_10 = options === null || options === void 0 ? void 0 : options.experimental) === null || _10 === void 0 ? void 0 : _10.attributeChangedCallback(['name', 'oldValue', 'newValue'], json, options), "\n          }\n          "), "\n\n        onMount() {\n          ").concat(!((_11 = json.hooks.onMount) === null || _11 === void 0 ? void 0 : _11.code)
            ? ''
            : // TODO: make prettier by grabbing only the function body
                "\n                // onMount\n                ".concat(updateReferencesInCode(addUpdateAfterSetInCode(json.hooks.onMount.code, options), options, {
                    contextVars: contextVars,
                }), "\n                "), "\n        }\n\n        onUpdate() {\n          ").concat(!((_12 = json.hooks.onUpdate) === null || _12 === void 0 ? void 0 : _12.length)
            ? ''
            : "\n              const self = this;\n            ".concat(json.hooks.onUpdate.reduce(function (code, hook, index) {
                // create check update
                if (hook === null || hook === void 0 ? void 0 : hook.deps) {
                    code += "\n                ;(function (__prev, __next) {\n                  const __hasChange = __prev.find((val, index) => val !== __next[index]);\n                  if (__hasChange !== undefined) {\n                    ".concat(updateReferencesInCode(hook.code, options, {
                        contextVars: contextVars,
                        context: 'self.',
                    }), "\n                    self.updateDeps[").concat(index, "] = __next;\n                  }\n                }(self.updateDeps[").concat(index, "], ").concat(updateReferencesInCode((hook === null || hook === void 0 ? void 0 : hook.deps) || '[]', options, {
                        contextVars: contextVars,
                        context: 'self.',
                    }), "));\n                ");
                }
                else {
                    code += "\n                ".concat(updateReferencesInCode(hook.code, options, {
                        contextVars: contextVars,
                        context: 'self.',
                    }), "\n                ");
                }
                return code + '\n';
            }, ''), " \n            "), "\n        }\n\n        update() {\n          if (this.pendingUpdate === true) {\n            return;\n          }\n          this.pendingUpdate = true;\n          this.render();\n          this.onUpdate();\n          this.pendingUpdate = false;\n        }\n\n        render() {\n          ").concat(!componentHasStatefulDom
            ? ''
            : "\n          // grab previous input state\n          const preStateful = this.getStateful(this._root);\n          const preValues = this.prepareHydrate(preStateful);\n          ", "\n\n          // re-rendering needs to ensure that all nodes generated by for/show are refreshed\n          this.destroyAnyNodes();\n          this.updateBindings();\n\n          ").concat(!componentHasStatefulDom
            ? ''
            : "\n          // hydrate input state\n          if (preValues.length) {\n            const nextStateful = this.getStateful(this._root);\n            this.hydrateDom(preValues, nextStateful);\n          }\n          ", "\n        }\n        ").concat(!componentHasStatefulDom
            ? ''
            : "\n            getStateful(el) {\n              const stateful = el.querySelectorAll('[data-dom-state]');\n              return stateful ? Array.from(stateful) : [];\n            }\n            prepareHydrate(stateful) {\n              return stateful.map(el => {\n                return {\n                  id: el.dataset.domState,\n                  value: el.value,\n                  active: document.activeElement === el,\n                  selectionStart: el.selectionStart\n                };\n              });\n            }\n            hydrateDom(preValues, stateful) {\n              return stateful.map((el, index) => {\n                const prev = preValues.find((prev) => el.dataset.domState === prev.id);\n                if (prev) {\n                  el.value = prev.value;\n                  if (prev.active) {\n                     el.focus();\n                     el.selectionStart = prev.selectionStart;\n                  }\n                }\n              });\n            }\n          ", "\n\n        updateBindings() {\n          ").concat(Object.keys(options.onChangeJsById)
            .map(function (key) {
            var _a, _b, _c, _d, _e, _f, _g;
            var value = options.onChangeJsById[key];
            if (!value) {
                return '';
            }
            var code = '';
            if ((_a = options === null || options === void 0 ? void 0 : options.experimental) === null || _a === void 0 ? void 0 : _a.updateBindings) {
                key = (_c = (_b = options === null || options === void 0 ? void 0 : options.experimental) === null || _b === void 0 ? void 0 : _b.updateBindings) === null || _c === void 0 ? void 0 : _c.key(key, value, options);
                code = (_e = (_d = options === null || options === void 0 ? void 0 : options.experimental) === null || _d === void 0 ? void 0 : _d.updateBindings) === null || _e === void 0 ? void 0 : _e.code(key, value, options);
            }
            else {
                code = updateReferencesInCode(value, options, {
                    contextVars: contextVars,
                });
            }
            return "\n              ".concat(((_f = options === null || options === void 0 ? void 0 : options.experimental) === null || _f === void 0 ? void 0 : _f.generateQuerySelectorAll)
                ? "\n              ".concat((_g = options === null || options === void 0 ? void 0 : options.experimental) === null || _g === void 0 ? void 0 : _g.generateQuerySelectorAll(key, code), "\n              ")
                : "              \n              this._root.querySelectorAll(\"[data-el='".concat(key, "']\").forEach((el) => {\n                ").concat(code, "\n              })\n              "), "\n            ");
        })
            .join('\n\n'), "\n        }\n\n        // Helper to render content\n        renderTextNode(el, text) {\n          const textNode = document.createTextNode(text);\n          if (el?.scope) {\n            textNode.scope = el.scope;\n          }\n          if (el?.context) {\n            textNode.context = el.context;\n          }\n          el.after(textNode);\n          this.nodesToDestroy.push(el.nextSibling);\n        }\n        ").concat(!hasContext
            ? ''
            : "\n            // get Context Helper\n            getContext(el, token) {\n              do {\n                let value;\n                if (el?.context?.get) {\n                  value = el.context.get(token);\n                } else if (el?.context?.[token]) {\n                  value = el.context[token];\n                }\n                if (value !== undefined) {\n                  return value;\n                }\n              } while ((el = el.parentNode));\n            }\n            ", "\n        ").concat(!hasScope
            ? ''
            : "\n            // scope helper\n            getScope(el, name) {\n              do {\n                let value = el?.scope?.[name]\n                if (value !== undefined) {\n                  return value\n                }\n              } while ((el = el.parentNode));\n            }\n            ", "\n\n        ").concat(!hasLoop
            ? ''
            : "\n\n          // Helper to render loops\n          renderLoop(template, array, itemName, itemIndex, collectionName) {\n            const collection = [];\n            for (let [index, value] of array.entries()) {\n              const elementFragment = template.content.cloneNode(true);\n              const children = Array.from(elementFragment.childNodes)\n              const localScope = {};\n              let scope = localScope;\n              if (template?.scope) {\n                const getParent = {\n                  get(target, prop, receiver) {\n                    if (prop in target) {\n                      return target[prop];\n                    }\n                    if (prop in template.scope) {\n                      return template.scope[prop];\n                    }\n                    return target[prop];\n                  }\n                };\n                scope = new Proxy(localScope, getParent);\n              }\n              children.forEach((child) => {\n                if (itemName !== undefined) {\n                  scope[itemName] = value;\n                }\n                if (itemIndex !== undefined) {\n                  scope[itemIndex] = index;\n                }\n                if (collectionName !== undefined) {\n                  scope[collectionName] = array;\n                }\n                child.scope = scope;\n                if (template.context) {\n                  child.context = context;\n                }\n                this.nodesToDestroy.push(child);\n                collection.unshift(child)\n              });\n            }\n            collection.forEach(child => template.after(child));\n          }\n        ", "\n      }\n\n      ").concat(((_13 = options === null || options === void 0 ? void 0 : options.experimental) === null || _13 === void 0 ? void 0 : _13.customElementsDefine)
            ? (_14 = options === null || options === void 0 ? void 0 : options.experimental) === null || _14 === void 0 ? void 0 : _14.customElementsDefine(kebabName, component, options)
            : "customElements.define('".concat(kebabName, "', ").concat(ComponentName, ");"), "\n    ");
        if (options.plugins) {
            str = (0, plugins_1.runPreCodePlugins)({ json: json, code: str, plugins: options.plugins });
        }
        if (options.prettier !== false) {
            try {
                str = (0, standalone_1.format)(str, {
                    parser: 'typescript',
                    plugins: [
                        // To support running in browsers
                        require('prettier/parser-html'),
                        require('prettier/parser-postcss'),
                        require('prettier/parser-babel'),
                        require('prettier/parser-typescript'),
                    ],
                });
            }
            catch (err) {
                console.warn('Could not prettify', { string: str }, err);
            }
        }
        if (options.plugins) {
            str = (0, plugins_1.runPostCodePlugins)({ json: json, code: str, plugins: options.plugins });
        }
        return str;
    };
};
exports.componentToCustomElement = componentToCustomElement;
