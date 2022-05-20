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
var lodash_1 = require("lodash");
var lodash_2 = require("lodash");
var standalone_1 = require("prettier/standalone");
var has_props_1 = require("../helpers/has-props");
var traverse_1 = __importDefault(require("traverse"));
var babel_transform_1 = require("../helpers/babel-transform");
var collect_styles_1 = require("../helpers/collect-styles");
var dash_case_1 = require("../helpers/dash-case");
var fast_clone_1 = require("../helpers/fast-clone");
var get_state_object_string_1 = require("../helpers/get-state-object-string");
var has_component_1 = require("../helpers/has-component");
var is_component_1 = require("../helpers/is-component");
var is_mitosis_node_1 = require("../helpers/is-mitosis-node");
var is_html_attribute_1 = require("../helpers/is-html-attribute");
var is_valid_attribute_name_1 = require("../helpers/is-valid-attribute-name");
var get_props_1 = require("../helpers/get-props");
var get_prop_functions_1 = require("../helpers/get-prop-functions");
var jsx_1 = require("../parsers/jsx");
var strip_state_and_props_refs_1 = require("../helpers/strip-state-and-props-refs");
var plugins_1 = require("../modules/plugins");
var is_children_1 = __importDefault(require("../helpers/is-children"));
var strip_meta_properties_1 = require("../helpers/strip-meta-properties");
var remove_surrounding_block_1 = require("../helpers/remove-surrounding-block");
var render_imports_1 = require("../helpers/render-imports");
var isAttribute = function (key) {
    return /-/.test(key);
};
var ATTRIBUTE_KEY_EXCEPTIONS_MAP = {
    class: 'className',
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
    var isComponent = meta === null || meta === void 0 ? void 0 : meta.component;
    var isHtmlAttr = (0, is_html_attribute_1.isHtmlAttribute)(key, tagName);
    var setAttr = !isKey && (isHtmlAttr || (0, is_valid_attribute_name_1.isValidAttributeName)(key) || isAttribute(key));
    return setAttr
        ? ";el.setAttribute(\"".concat(key, "\", ").concat(useValue, ");").concat(!isComponent || isHtmlAttr
            ? ''
            : "\n    ;el.props.".concat((0, lodash_1.camelCase)(key), " = ").concat(useValue, ";\n    ;el.update();\n    "), "\n    ")
        : ";el.".concat(updateKeyIfException(key), " = ").concat(useValue, ";").concat(!isComponent || isKey
            ? ''
            : "\n    ;el.props.".concat((0, lodash_1.camelCase)(key), " = ").concat(useValue, ";\n    ;el.update();\n    "), "\n    ");
};
var addUpdateAfterSet = function (json, options) {
    (0, traverse_1.default)(json).forEach(function (item) {
        var _a;
        if ((0, is_mitosis_node_1.isMitosisNode)(item)) {
            for (var key in item.bindings) {
                var value = (_a = item.bindings[key]) === null || _a === void 0 ? void 0 : _a.code;
                var newValue = addUpdateAfterSetInCode(value, options);
                if (newValue !== value) {
                    item.bindings[key] = { code: newValue };
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
var replaceClassname = function (json, options) {
    (0, traverse_1.default)(json).forEach(function (node) {
        if ((0, is_mitosis_node_1.isMitosisNode)(node)) {
            if (node.properties.className) {
                // Change className to class in the HTML elements
                node.properties.class = node.properties.className;
                delete node.properties.className;
            }
        }
    });
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
        return json.children
            .map(function (item) { return blockToHtml(item, options, blockOptions); })
            .join('\n');
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
// TODO: overloaded function
var updateReferencesInCode = function (code, options) {
    var _a, _b;
    if ((_a = options === null || options === void 0 ? void 0 : options.experimental) === null || _a === void 0 ? void 0 : _a.updateReferencesInCode) {
        return (_b = options === null || options === void 0 ? void 0 : options.experimental) === null || _b === void 0 ? void 0 : _b.updateReferencesInCode(code, options, {
            stripStateAndPropsRefs: strip_state_and_props_refs_1.stripStateAndPropsRefs,
        });
    }
    if (options.format === 'class') {
        return (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(code, {
            includeProps: false,
            includeState: true,
            replaceWith: 'this.state.',
        }), {
            // TODO: replace with `this.` and add setters that call this.update()
            includeProps: true,
            includeState: false,
            replaceWith: 'this.props.',
        });
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
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    if (blockOptions === void 0) { blockOptions = {}; }
    var scopeVars = (blockOptions === null || blockOptions === void 0 ? void 0 : blockOptions.scopeVars) || [];
    var childComponents = (blockOptions === null || blockOptions === void 0 ? void 0 : blockOptions.childComponents) || [];
    var hasData = Object.keys(json.bindings).length;
    var elId = '';
    if (hasData) {
        elId = getId(json, options);
        json.properties['data-name'] = elId;
    }
    if ((_a = options === null || options === void 0 ? void 0 : options.experimental) === null || _a === void 0 ? void 0 : _a.getId) {
        elId = (_b = options === null || options === void 0 ? void 0 : options.experimental) === null || _b === void 0 ? void 0 : _b.getId(elId, json, options, {
            hasData: hasData,
            getId: getId,
        });
        json.properties['data-name'] = (_c = options === null || options === void 0 ? void 0 : options.experimental) === null || _c === void 0 ? void 0 : _c.dataName(elId, json, options, {
            hasData: hasData,
            getId: getId,
        });
    }
    if ((_e = (_d = options === null || options === void 0 ? void 0 : options.experimental) === null || _d === void 0 ? void 0 : _d.mappers) === null || _e === void 0 ? void 0 : _e[json.name]) {
        return (_g = (_f = options === null || options === void 0 ? void 0 : options.experimental) === null || _f === void 0 ? void 0 : _f.mappers) === null || _g === void 0 ? void 0 : _g[json.name](json, options, elId, scopeVars, blockToHtml, addScopeVars, addOnChangeJs);
    }
    if (mappers[json.name]) {
        return mappers[json.name](json, options, { scopeVars: scopeVars, childComponents: childComponents });
    }
    if ((0, is_children_1.default)(json)) {
        return "<slot></slot>";
    }
    if (json.properties._text) {
        return json.properties._text;
    }
    if ((_h = json.bindings._text) === null || _h === void 0 ? void 0 : _h.code) {
        // TO-DO: textContent might be better performance-wise
        addOnChangeJs(elId, options, "\n      ".concat(addScopeVars(scopeVars, json.bindings._text.code, function (scopeVar) {
            return "const ".concat(scopeVar, " = ").concat(options.format === 'class' ? 'this.' : '', "getContext(el, \"").concat(scopeVar, "\");");
        }), "\n      ").concat(options.format === 'class' ? 'this.' : '', "renderTextNode(el, ").concat(json.bindings._text.code, ");"));
        return "<template data-name=\"".concat(elId, "\"><!-- ").concat((_j = json.bindings._text) === null || _j === void 0 ? void 0 : _j.code, " --></template>");
    }
    var str = '';
    if (json.name === 'For') {
        var forArguments = ((_k = json === null || json === void 0 ? void 0 : json.scope) === null || _k === void 0 ? void 0 : _k.For) || [];
        var localScopeVars_1 = __spreadArray(__spreadArray([], scopeVars, true), forArguments, true);
        var argsStr = forArguments.map(function (arg) { return "\"".concat(arg, "\""); }).join(',');
        addOnChangeJs(elId, options, 
        // TODO: be smarter about rendering, deleting old items and adding new ones by
        // querying dom potentially
        "\n        let array = ".concat((_l = json.bindings.each) === null || _l === void 0 ? void 0 : _l.code, ";\n        ").concat(options.format === 'class' ? 'this.' : '', "renderLoop(el, array, ").concat(argsStr, ");\n      "));
        // TODO: decide on how to handle this...
        str += "\n      <template data-name=\"".concat(elId, "\">");
        if (json.children) {
            str += json.children
                .map(function (item) {
                return blockToHtml(item, options, {
                    scopeVars: localScopeVars_1,
                    childComponents: childComponents,
                });
            })
                .join('\n');
        }
        str += '</template>';
    }
    else if (json.name === 'Show') {
        var whenCondition = ((_m = json.bindings.when) === null || _m === void 0 ? void 0 : _m.code).replace(/;$/, '');
        addOnChangeJs(elId, options, "\n        ".concat(addScopeVars(scopeVars, whenCondition, function (scopeVar) {
            return "const ".concat(scopeVar, " = ").concat(options.format === 'class' ? 'this.' : '', "getContext(el, \"").concat(scopeVar, "\");");
        }), "\n        const whenCondition = ").concat(whenCondition, ";\n        if (whenCondition) {\n          ").concat(options.format === 'class' ? 'this.' : '', "showContent(el)\n        }\n      "));
        str += "<template data-name=\"".concat(elId, "\">");
        if (json.children) {
            str += json.children
                .map(function (item) {
                return blockToHtml(item, options, { scopeVars: scopeVars, childComponents: childComponents });
            })
                .join('\n');
        }
        str += '</template>';
    }
    else {
        var component = childComponents.find(function (impName) { return impName === json.name; });
        var elSelector = component ? (0, lodash_2.kebabCase)(json.name) : json.name;
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
            var value = (json.properties[key] || '')
                .replace(/"/g, '&quot;')
                .replace(/\n/g, '\\n');
            str += " ".concat(key, "=\"").concat(value, "\" ");
        }
        // batch all local vars within the bindings
        var batchScopeVars_1 = {};
        var injectOnce = false;
        var startInjectVar = '%%START_VARS%%';
        for (var key in json.bindings) {
            if (key === '_spread' || key === 'ref' || key === 'css') {
                continue;
            }
            var value = (_o = json.bindings[key]) === null || _o === void 0 ? void 0 : _o.code;
            // TODO: proper babel transform to replace. Util for this
            var useValue = value;
            if (key.startsWith('on')) {
                var event_1 = key.replace('on', '').toLowerCase();
                if (!(0, is_component_1.isComponent)(json) && event_1 === 'change') {
                    event_1 = 'input';
                }
                var fnName = (0, lodash_1.camelCase)("on-".concat(elId, "-").concat(event_1));
                var codeContent = (0, remove_surrounding_block_1.removeSurroundingBlock)(updateReferencesInCode(useValue, options));
                options.js += "\n          // Event handler for '".concat(event_1, "' event on ").concat(elId, "\n          ").concat(options.format === 'class'
                    ? "this.".concat(fnName, " = (event) => {")
                    : "function ".concat(fnName, " (event) {"), "\n              ").concat(addScopeVars(scopeVars, codeContent, function (scopeVar) {
                    return "const ".concat(scopeVar, " = ").concat(options.format === 'class' ? 'this.' : '', "getContext(event.currentTarget, \"").concat(scopeVar, "\");");
                }), "\n            ").concat(codeContent, "\n          }\n        ");
                var fnIdentifier = "".concat(options.format === 'class' ? 'this.' : '').concat(fnName);
                addOnChangeJs(elId, options, "\n            ;el.removeEventListener('".concat(event_1, "', ").concat(fnIdentifier, ");\n            ;el.addEventListener('").concat(event_1, "', ").concat(fnIdentifier, ");\n          "));
            }
            else {
                if (key === 'style') {
                    addOnChangeJs(elId, options, "\n            ".concat(addScopeVars(scopeVars, useValue, function (scopeVar) {
                        return "const ".concat(scopeVar, " = ").concat(options.format === 'class' ? 'this.' : '', "getContext(el, \"").concat(scopeVar, "\");");
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
                return "const ".concat(scopeVar, " = ").concat(options.format === 'class' ? 'this.' : '', "getContext(el, \"").concat(scopeVar, "\");");
            }), "\n        "));
        }
        if (jsx_1.selfClosingTags.has(json.name)) {
            return str + ' />';
        }
        str += '>';
        if (json.children) {
            str += json.children
                .map(function (item) {
                return blockToHtml(item, options, { scopeVars: scopeVars, childComponents: childComponents });
            })
                .join('\n');
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
var componentToHtml = function (options) {
    if (options === void 0) { options = {}; }
    return function (_a) {
        var _b, _c, _d, _e, _f, _g, _h, _j, _k;
        var component = _a.component;
        var useOptions = __assign(__assign({}, options), { onChangeJsById: {}, js: '', namesMap: {}, format: 'script' });
        var json = (0, fast_clone_1.fastClone)(component);
        if (options.plugins) {
            json = (0, plugins_1.runPreJsonPlugins)(json, options.plugins);
        }
        addUpdateAfterSet(json, useOptions);
        var componentHasProps = (0, has_props_1.hasProps)(json);
        var hasLoop = (0, has_component_1.hasComponent)('For', json);
        var hasShow = (0, has_component_1.hasComponent)('Show', json);
        if (options.plugins) {
            json = (0, plugins_1.runPostJsonPlugins)(json, options.plugins);
        }
        var css = (0, collect_styles_1.collectCss)(json, {
            prefix: options.prefix,
        });
        var str = json.children
            .map(function (item) { return blockToHtml(item, useOptions); })
            .join('\n');
        if (css.trim().length) {
            str += "<style>".concat(css, "</style>");
        }
        var hasChangeListeners = Boolean(Object.keys(useOptions.onChangeJsById).length);
        var hasGeneratedJs = Boolean(useOptions.js.trim().length);
        if (hasChangeListeners ||
            hasGeneratedJs ||
            ((_b = json.hooks.onMount) === null || _b === void 0 ? void 0 : _b.code) ||
            hasLoop) {
            // TODO: collectJs helper for here and liquid
            str += "\n      <script>\n      (() => {\n        const state = ".concat((0, get_state_object_string_1.getStateObjectStringFromComponent)(json, {
                valueMapper: function (value) {
                    return addUpdateAfterSetInCode(updateReferencesInCode(value, useOptions), useOptions);
                },
            }), ";\n        ").concat(componentHasProps ? "let props = {};" : '', "\n        let nodesToDestroy = [];\n        let pendingUpdate = false;\n        ").concat(!((_d = (_c = json.hooks) === null || _c === void 0 ? void 0 : _c.onInit) === null || _d === void 0 ? void 0 : _d.code) ? '' : 'let onInitOnce = false;', "\n\n        function destroyAnyNodes() {\n          // destroy current view template refs before rendering again\n          nodesToDestroy.forEach(el => el.remove());\n          nodesToDestroy = [];\n        }\n        ").concat(!hasChangeListeners
                ? ''
                : "\n        \n        // Function to update data bindings and loops\n        // call update() when you mutate state and need the updates to reflect\n        // in the dom\n        function update() {\n          if (pendingUpdate === true) {\n            return;\n          }\n          pendingUpdate = true;\n          ".concat(Object.keys(useOptions.onChangeJsById)
                    .map(function (key) {
                    var value = useOptions.onChangeJsById[key];
                    if (!value) {
                        return '';
                    }
                    return "\n              document.querySelectorAll(\"[data-name='".concat(key, "']\").forEach((el) => {\n                ").concat(value, "\n              });\n            ");
                })
                    .join('\n\n'), "\n\n          destroyAnyNodes();\n\n          ").concat(!((_e = json.hooks.onUpdate) === null || _e === void 0 ? void 0 : _e.length)
                    ? ''
                    : "\n                ".concat(json.hooks.onUpdate.reduce(function (code, hook) {
                        code += addUpdateAfterSetInCode(updateReferencesInCode(hook.code, useOptions), useOptions);
                        return code + '\n';
                    }, ''), " \n                "), "\n\n          pendingUpdate = false;\n        }\n\n        ").concat(useOptions.js, "\n\n        // Update with initial state on first load\n        update();\n        "), "\n\n        ").concat(!((_g = (_f = json.hooks) === null || _f === void 0 ? void 0 : _f.onInit) === null || _g === void 0 ? void 0 : _g.code)
                ? ''
                : "\n            if (!onInitOnce) {\n              ".concat(updateReferencesInCode(addUpdateAfterSetInCode((_j = (_h = json.hooks) === null || _h === void 0 ? void 0 : _h.onInit) === null || _j === void 0 ? void 0 : _j.code, useOptions), useOptions), "\n              onInitOnce = true;\n            }\n            "), "\n\n        ").concat(!((_k = json.hooks.onMount) === null || _k === void 0 ? void 0 : _k.code)
                ? ''
                : // TODO: make prettier by grabbing only the function body
                    "\n              // onMount\n              ".concat(updateReferencesInCode(addUpdateAfterSetInCode(json.hooks.onMount.code, useOptions), useOptions), " \n              "), "\n\n        ").concat(!hasShow
                ? ''
                : "\n          function showContent(el) {\n            // https://developer.mozilla.org/en-US/docs/Web/API/HTMLTemplateElement/content\n            // grabs the content of a node that is between <template> tags\n            // iterates through child nodes to register all content including text elements\n            // attaches the content after the template\n  \n  \n            const elementFragment = el.content.cloneNode(true);\n            const children = Array.from(elementFragment.childNodes)\n            children.forEach(child => {\n              if (el?.scope) {\n                child.scope = el.scope;\n              }\n              nodesToDestroy.push(child);\n            });\n            el.after(elementFragment);\n          }\n  \n        ", "\n        // Helper text DOM nodes\n        function renderTextNode(el, text) {\n          const textNode = document.createTextNode(text);\n          if (el?.scope) {\n            textNode.scope = el.scope\n          }\n          el.after(textNode);\n          nodesToDestroy.push(el.nextSibling);\n        }\n        ").concat(!hasLoop
                ? ''
                : "\n          // Helper to render loops\n          function renderLoop(template, array, itemName, itemIndex, collectionName) {\n            for (let [index, value] of array.entries()) {\n              const elementFragment = template.content.cloneNode(true);\n              const localScope = {};\n              let scope = localScope;\n              if (template?.scope) {\n                const getParent = {\n                  get(target, prop, receiver) {\n                    if (prop in target) {\n                      return target[prop];\n                    }\n                    if (prop in template.scope) {\n                      return template.scope[prop];\n                    }\n                    return target[prop];\n                  }\n                };\n                scope = new Proxy(localScope, getParent);\n              }\n              Array.from(elementFragment.childNodes).reversrEach((child) => {\n                if (itemName !== undefined) {\n                  scope[itemName] = value;\n                }\n                if (itemIndex !== undefined) {\n                  scope[itemIndex] = index;\n                }\n                if (collectionName !== undefined) {\n                  scope[collectionName] = array;\n                }\n                child.scope = scope;\n                this.nodesToDestroy.push(child);\n                template.after(child);\n              });\n            }\n          }\n\n          function getContext(el, name) {\n            do {\n              let value = el?.scope?.[name]\n              if (value !== undefined) {\n                return value\n              }\n            } while ((el = el.parentNode));\n          }\n        ", "\n      })()\n      </script>\n    ");
        }
        if (options.plugins) {
            str = (0, plugins_1.runPreCodePlugins)(str, options.plugins);
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
            str = (0, plugins_1.runPostCodePlugins)(str, options.plugins);
        }
        return str;
    };
};
exports.componentToHtml = componentToHtml;
// TODO: props support via custom elements
var componentToCustomElement = function (options) {
    if (options === void 0) { options = {}; }
    return function (_a) {
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16;
        var component = _a.component;
        var kebabName = (0, lodash_2.kebabCase)(component.name);
        var useOptions = __assign(__assign({ prefix: kebabName }, options), { onChangeJsById: {}, js: '', namesMap: {}, format: 'class' });
        var json = (0, fast_clone_1.fastClone)(component);
        if (options.plugins) {
            json = (0, plugins_1.runPreJsonPlugins)(json, options.plugins);
        }
        replaceClassname(json, useOptions);
        var childComponents = getChildComponents(json, useOptions);
        var componentHasProps = (0, has_props_1.hasProps)(json);
        var props = (0, get_props_1.getProps)(json);
        var outputs = (0, get_prop_functions_1.getPropFunctions)(json);
        addUpdateAfterSet(json, useOptions);
        var hasLoop = (0, has_component_1.hasComponent)('For', json);
        var hasShow = (0, has_component_1.hasComponent)('Show', json);
        if (options.plugins) {
            json = (0, plugins_1.runPostJsonPlugins)(json, options.plugins);
        }
        var css = '';
        if ((_b = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _b === void 0 ? void 0 : _b.css) {
            css = (_c = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _c === void 0 ? void 0 : _c.css(json, useOptions, {
                collectCss: collect_styles_1.collectCss,
                prefix: options.prefix,
            });
        }
        else {
            css = (0, collect_styles_1.collectCss)(json, {
                prefix: options.prefix,
            });
        }
        (0, strip_meta_properties_1.stripMetaProperties)(json);
        var html = json.children
            .map(function (item) {
            return blockToHtml(item, useOptions, { childComponents: childComponents, props: props, outputs: outputs });
        })
            .join('\n');
        if ((_d = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _d === void 0 ? void 0 : _d.childrenHtml) {
            html = (_e = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _e === void 0 ? void 0 : _e.childrenHtml(html, kebabName, json, useOptions);
        }
        if ((_f = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _f === void 0 ? void 0 : _f.cssHtml) {
            html += (_g = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _g === void 0 ? void 0 : _g.cssHtml(css);
        }
        else {
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
        var str = "\n      ".concat((0, render_imports_1.renderPreComponent)(json), "\n      /**\n       * Usage:\n       * \n       *  <").concat(kebabName, "></").concat(kebabName, ">\n       * \n       */\n      class ").concat(component.name, " extends ").concat(((_h = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _h === void 0 ? void 0 : _h.classExtends)
            ? (_j = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _j === void 0 ? void 0 : _j.classExtends(json, useOptions)
            : 'HTMLElement', " {\n        constructor() {\n          super();\n          const self = this;\n          ").concat(!((_l = (_k = json.hooks) === null || _k === void 0 ? void 0 : _k.onInit) === null || _l === void 0 ? void 0 : _l.code) ? '' : 'this.onInitOnce = false;', "\n          this.state = ").concat((0, get_state_object_string_1.getStateObjectStringFromComponent)(json, {
            valueMapper: function (value) {
                return (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(addUpdateAfterSetInCode(value, useOptions, 'self.update'), {
                    includeProps: false,
                    includeState: true,
                    // TODO: if it's an arrow function it's this.state.
                    replaceWith: 'self.state.',
                }), {
                    // TODO: replace with `this.` and add setters that call this.update()
                    includeProps: true,
                    includeState: false,
                    replaceWith: 'self.props.',
                });
            },
        }), ";\n          ").concat(componentHasProps /* TODO: accept these as attributes/properties on the custom element */
            ? "this.props = {};"
            : '', "\n\n\n          // used to keep track of all nodes created by show/for\n          this.nodesToDestroy = [];\n          // batch updates\n          this.pendingUpdate = false;\n          ").concat(((_m = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _m === void 0 ? void 0 : _m.componentConstructor)
            ? (_o = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _o === void 0 ? void 0 : _o.componentConstructor(json, useOptions)
            : '', "\n\n          ").concat(useOptions.js, "\n\n          if (").concat((_p = json.meta.useMetadata) === null || _p === void 0 ? void 0 : _p.isAttachedToShadowDom, ") {\n            this.attachShadow({ mode: 'open' })\n          }\n        }\n\n\n        ").concat(!((_q = json.hooks.onUnMount) === null || _q === void 0 ? void 0 : _q.code)
            ? ''
            : "\n          disconnectedCallback() {\n            ".concat(((_r = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _r === void 0 ? void 0 : _r.disconnectedCallback)
                ? (_s = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _s === void 0 ? void 0 : _s.disconnectedCallback(json, useOptions)
                : "\n            // onUnMount\n            ".concat(updateReferencesInCode(addUpdateAfterSetInCode(json.hooks.onUnMount.code, useOptions), useOptions), "\n            this.destroyAnyNodes(); // clean up nodes when component is destroyed\n            ").concat(!((_u = (_t = json.hooks) === null || _t === void 0 ? void 0 : _t.onInit) === null || _u === void 0 ? void 0 : _u.code) ? '' : 'this.onInitOnce = false;', "\n            "), "\n          }\n          "), "\n\n        destroyAnyNodes() {\n          // destroy current view template refs before rendering again\n          this.nodesToDestroy.forEach(el => el.remove());\n          this.nodesToDestroy = [];\n        }\n\n        get _root() {\n          return this.shadowRoot || this;\n        }\n\n        connectedCallback() {\n          ").concat(((_v = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _v === void 0 ? void 0 : _v.connectedCallbackUpdate)
            ? (_w = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _w === void 0 ? void 0 : _w.connectedCallbackUpdate(json, html, useOptions)
            : "\n              this._root.innerHTML = `\n      ".concat(html, "`;\n              this.pendingUpdate = true;\n              this.render();\n              ").concat(!((_y = (_x = json.hooks) === null || _x === void 0 ? void 0 : _x.onInit) === null || _y === void 0 ? void 0 : _y.code) ? '' : 'this.onInit();', "\n              this.onMount();\n              this.pendingUpdate = false;\n              this.update();\n              "), "\n        }\n        ").concat(!((_0 = (_z = json.hooks) === null || _z === void 0 ? void 0 : _z.onInit) === null || _0 === void 0 ? void 0 : _0.code)
            ? ''
            : "\n            onInit() {\n              ".concat(!((_2 = (_1 = json.hooks) === null || _1 === void 0 ? void 0 : _1.onInit) === null || _2 === void 0 ? void 0 : _2.code)
                ? ''
                : "\n                  if (!this.onInitOnce) {\n                    ".concat(updateReferencesInCode(addUpdateAfterSetInCode((_4 = (_3 = json.hooks) === null || _3 === void 0 ? void 0 : _3.onInit) === null || _4 === void 0 ? void 0 : _4.code, useOptions), useOptions), "\n                    this.onInitOnce = true;\n                  }"), "\n            }\n            "), "\n\n        ").concat(!hasShow
            ? ''
            : "\n          showContent(el) {\n            // https://developer.mozilla.org/en-US/docs/Web/API/HTMLTemplateElement/content\n            // grabs the content of a node that is between <template> tags\n            // iterates through child nodes to register all content including text elements\n            // attaches the content after the template\n  \n  \n            const elementFragment = el.content.cloneNode(true);\n            const children = Array.from(elementFragment.childNodes)\n            children.forEach(child => {\n              if (el?.scope) {\n                child.scope = el.scope;\n              }\n              this.nodesToDestroy.push(child);\n            });\n            el.after(elementFragment);\n          }", "\n        ").concat(!((_5 = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _5 === void 0 ? void 0 : _5.attributeChangedCallback)
            ? ''
            : "\n          attributeChangedCallback(name, oldValue, newValue) {\n            ".concat((_6 = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _6 === void 0 ? void 0 : _6.attributeChangedCallback(['name', 'oldValue', 'newValue'], json, useOptions), "\n          }\n          "), "\n\n        onMount() {\n          ").concat(!((_7 = json.hooks.onMount) === null || _7 === void 0 ? void 0 : _7.code)
            ? ''
            : // TODO: make prettier by grabbing only the function body
                "\n                // onMount\n                ".concat(updateReferencesInCode(addUpdateAfterSetInCode(json.hooks.onMount.code, useOptions), useOptions), "\n                "), "\n        }\n\n        onUpdate() {\n          ").concat(!((_8 = json.hooks.onUpdate) === null || _8 === void 0 ? void 0 : _8.length)
            ? ''
            : "\n            ".concat(json.hooks.onUpdate.reduce(function (code, hook) {
                code += updateReferencesInCode(hook.code, useOptions);
                return code + '\n';
            }, ''), " \n            "), "\n        }\n\n        update() {\n          if (this.pendingUpdate === true) {\n            return;\n          }\n          this.pendingUpdate = true;\n          ").concat(!((_9 = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _9 === void 0 ? void 0 : _9.shouldComponentUpdateStart)
            ? ''
            : "\n            ".concat((_10 = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _10 === void 0 ? void 0 : _10.shouldComponentUpdateStart(json, useOptions), "\n            "), "\n          this.render();\n          this.onUpdate();\n          ").concat(!((_11 = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _11 === void 0 ? void 0 : _11.shouldComponentUpdateEnd)
            ? ''
            : "\n            ".concat((_12 = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _12 === void 0 ? void 0 : _12.shouldComponentUpdateEnd(json, useOptions), "\n            "), "\n          this.pendingUpdate = false;\n        }\n\n        render() {\n          // re-rendering needs to ensure that all nodes generated by for/show are refreshed\n          this.destroyAnyNodes();\n          ").concat(((_13 = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _13 === void 0 ? void 0 : _13.updateBindings)
            ? (_14 = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _14 === void 0 ? void 0 : _14.updateBindings(json, useOptions)
            : 'this.updateBindings();', "\n        }\n\n        updateBindings() {\n          ").concat(Object.keys(useOptions.onChangeJsById)
            .map(function (key) {
            var _a, _b, _c, _d, _e, _f, _g;
            var value = useOptions.onChangeJsById[key];
            if (!value) {
                return '';
            }
            var code = '';
            if ((_a = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _a === void 0 ? void 0 : _a.updateBindings) {
                key = (_c = (_b = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _b === void 0 ? void 0 : _b.updateBindings) === null || _c === void 0 ? void 0 : _c.key(key, value, useOptions);
                code = (_e = (_d = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _d === void 0 ? void 0 : _d.updateBindings) === null || _e === void 0 ? void 0 : _e.code(key, value, useOptions);
            }
            else {
                code = updateReferencesInCode(value, useOptions);
            }
            return "\n              ".concat(((_f = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _f === void 0 ? void 0 : _f.generateQuerySelectorAll)
                ? "\n              ".concat((_g = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _g === void 0 ? void 0 : _g.generateQuerySelectorAll(key, code), "\n              ")
                : "              \n              this._root.querySelectorAll(\"[data-name='".concat(key, "']\").forEach((el) => {\n                ").concat(code, "\n              })\n              "), "\n            ");
        })
            .join('\n\n'), "\n        }\n\n        // Helper to render content\n        renderTextNode(el, text) {\n          const textNode = document.createTextNode(text);\n          if (el?.scope) {\n            textNode.scope = el.scope;\n          }\n          el.after(textNode);\n          this.nodesToDestroy.push(el.nextSibling);\n        }\n\n        ").concat(!hasLoop
            ? ''
            : "\n\n          // Helper to render loops\n          renderLoop(template, array, itemName, itemIndex, collectionName) {\n            const collection = [];\n            for (let [index, value] of array.entries()) {\n              const elementFragment = template.content.cloneNode(true);\n              const children = Array.from(elementFragment.childNodes)\n              const localScope = {};\n              let scope = localScope;\n              if (template?.scope) {\n                const getParent = {\n                  get(target, prop, receiver) {\n                    if (prop in target) {\n                      return target[prop];\n                    }\n                    if (prop in template.scope) {\n                      return template.scope[prop];\n                    }\n                    return target[prop];\n                  }\n                };\n                scope = new Proxy(localScope, getParent);\n              }\n              children.forEach((child) => {\n                if (itemName !== undefined) {\n                  scope[itemName] = value;\n                }\n                if (itemIndex !== undefined) {\n                  scope[itemIndex] = index;\n                }\n                if (collectionName !== undefined) {\n                  scope[collectionName] = array;\n                }\n                child.scope = scope;\n                this.nodesToDestroy.push(child);\n                collection.push(child)\n              });\n            }\n            collection.reverse().forEach(child => template.after(child));\n          }\n        \n          getContext(el, name) {\n            do {\n              let value = el?.scope?.[name]\n              if (value !== undefined) {\n                return value\n              }\n            } while ((el = el.parentNode));\n          }\n        ", "\n      }\n\n      ").concat(((_15 = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _15 === void 0 ? void 0 : _15.customElementsDefine)
            ? (_16 = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _16 === void 0 ? void 0 : _16.customElementsDefine(kebabName, component, useOptions)
            : "customElements.define('".concat(kebabName, "', ").concat(component.name, ");"), "\n    ");
        if (options.plugins) {
            str = (0, plugins_1.runPreCodePlugins)(str, options.plugins);
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
            str = (0, plugins_1.runPostCodePlugins)(str, options.plugins);
        }
        return str;
    };
};
exports.componentToCustomElement = componentToCustomElement;
