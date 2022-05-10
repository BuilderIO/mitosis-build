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
var jsx_1 = require("../parsers/jsx");
var strip_state_and_props_refs_1 = require("../helpers/strip-state-and-props-refs");
var plugins_1 = require("../modules/plugins");
var is_children_1 = __importDefault(require("../helpers/is-children"));
var strip_meta_properties_1 = require("../helpers/strip-meta-properties");
var remove_surrounding_block_1 = require("../helpers/remove-surrounding-block");
var render_imports_1 = require("../helpers/render-imports");
var ATTRIBUTE_KEY_EXCEPTIONS_MAP = {
    class: 'className',
};
var updateKeyIfException = function (key) {
    var _a;
    return (_a = ATTRIBUTE_KEY_EXCEPTIONS_MAP[key]) !== null && _a !== void 0 ? _a : key;
};
var needsSetAttribute = function (key) {
    return [key.includes('-')].some(Boolean);
};
var generateSetElementAttributeCode = function (key, useValue, options) {
    var _a, _b;
    if ((_a = options === null || options === void 0 ? void 0 : options.experimental) === null || _a === void 0 ? void 0 : _a.props) {
        return (_b = options === null || options === void 0 ? void 0 : options.experimental) === null || _b === void 0 ? void 0 : _b.props(key, useValue, options);
    }
    return needsSetAttribute(key)
        ? ";el.setAttribute(\"".concat(key, "\", ").concat(useValue, ");")
        : ";el.".concat(updateKeyIfException(key), " = ").concat(useValue, ";");
};
var addUpdateAfterSet = function (json, options) {
    (0, traverse_1.default)(json).forEach(function (item) {
        if ((0, is_mitosis_node_1.isMitosisNode)(item)) {
            for (var key in item.bindings) {
                var value = item.bindings[key];
                var newValue = addUpdateAfterSetInCode(value, options);
                if (newValue !== value) {
                    item.bindings[key] = newValue;
                }
            }
        }
    });
};
var addScopeVars = function (parentScopeVars, value, fn) {
    return "".concat(parentScopeVars
        .filter(function (scopeVar) {
        return new RegExp(scopeVar).test(value);
    })
        .map(function (scopeVar) {
        return fn(scopeVar);
    })
        .join('\n'));
};
var mappers = {
    Fragment: function (json, options, parentScopeVars) {
        return json.children
            .map(function (item) { return blockToHtml(item, options, parentScopeVars); })
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
var blockToHtml = function (json, options, parentScopeVars) {
    var _a, _b, _c, _d, _e, _f, _g;
    if (parentScopeVars === void 0) { parentScopeVars = []; }
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
        return (_g = (_f = options === null || options === void 0 ? void 0 : options.experimental) === null || _f === void 0 ? void 0 : _f.mappers) === null || _g === void 0 ? void 0 : _g[json.name](json, options, elId, parentScopeVars, blockToHtml, addScopeVars, addOnChangeJs);
    }
    if (mappers[json.name]) {
        return mappers[json.name](json, options, parentScopeVars);
    }
    if ((0, is_children_1.default)(json)) {
        return "<slot></slot>";
    }
    if (json.properties._text) {
        return json.properties._text;
    }
    if (json.bindings._text) {
        // TO-DO: textContent might be better performance-wise
        addOnChangeJs(elId, options, "\n      ".concat(addScopeVars(parentScopeVars, json.bindings._text, function (scopeVar) {
            return "const ".concat(scopeVar, " = ").concat(options.format === 'class' ? 'this.' : '', "getContext(el, \"").concat(scopeVar, "\");");
        }), "\n      ;el.innerText = ").concat(json.bindings._text, ";"));
        return "<span data-name=\"".concat(elId, "\"><!-- ").concat(json.bindings._text, " --></span>");
    }
    var str = '';
    if (json.name === 'For') {
        var itemName = json.properties._forName;
        var indexName = json.properties._indexName;
        var collectionName = json.properties._collectionName;
        var scopedVars_1 = __spreadArray(__spreadArray([], parentScopeVars, true), [
            itemName,
            indexName,
            collectionName,
        ], false).filter(Boolean);
        addOnChangeJs(elId, options, 
        // TODO: be smarter about rendering, deleting old items and adding new ones by
        // querying dom potentially
        "\n        let array = ".concat(json.bindings.each, ";\n        let template = ").concat(options.format === 'class' ? 'this._root' : 'document', ".querySelector('[data-template-for=\"").concat(elId, "\"]');\n        ").concat(options.format === 'class' ? 'this.' : '', "renderLoop(el, array, template, ").concat(itemName ? "\"".concat(itemName, "\"") : 'undefined', ", ").concat(indexName ? "\"".concat(indexName, "\"") : 'undefined', ", ").concat(collectionName ? "\"".concat(collectionName, "\"") : 'undefined', ");\n      "));
        // TODO: decide on how to handle this...
        str += "\n      <span data-name=\"".concat(elId, "\"></span>\n      <template data-template-for=\"").concat(elId, "\">");
        if (json.children) {
            str += json.children
                .map(function (item) { return blockToHtml(item, options, scopedVars_1); })
                .join('\n');
        }
        str += '</template>';
    }
    else if (json.name === 'Show') {
        addOnChangeJs(elId, options, "\n        const whenCondition = ".concat(json.bindings.when.replace(/;$/, ''), ";\n        if (whenCondition) {\n          ").concat(options.format === 'class' ? 'this.' : '', "showContent(el)\n        }\n      "));
        str += "<template data-name=\"".concat(elId, "\">");
        if (json.children) {
            str += json.children
                .map(function (item) { return blockToHtml(item, options, parentScopeVars); })
                .join('\n');
        }
        str += '</template>';
    }
    else {
        str += "<".concat(json.name, " ");
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
        for (var key in json.bindings) {
            if (key === '_spread' || key === 'ref' || key === 'css') {
                continue;
            }
            var value = json.bindings[key];
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
                    : "function ".concat(fnName, " (event) {"), "\n              ").concat(addScopeVars(parentScopeVars, codeContent, function (scopeVar) {
                    return "const ".concat(scopeVar, " = ").concat(options.format === 'class' ? 'this.' : '', "getContext(event.currentTarget, \"").concat(scopeVar, "\");");
                }), "\n            ").concat(codeContent, "\n          }\n        ");
                var fnIdentifier = "".concat(options.format === 'class' ? 'this.' : '').concat(fnName);
                addOnChangeJs(elId, options, "\n            ;el.removeEventListener('".concat(event_1, "', ").concat(fnIdentifier, ");\n            ;el.addEventListener('").concat(event_1, "', ").concat(fnIdentifier, ");\n          "));
            }
            else {
                if (key === 'style') {
                    addOnChangeJs(elId, options, "\n            ".concat(addScopeVars(parentScopeVars, useValue, function (scopeVar) {
                        return "const ".concat(scopeVar, " = ").concat(options.format === 'class' ? 'this.' : '', "getContext(el, \"").concat(scopeVar, "\");");
                    }), "\n            ;Object.assign(el.style, ").concat(useValue, ");"));
                }
                else {
                    addOnChangeJs(elId, options, "\n            ".concat(addScopeVars(parentScopeVars, useValue, function (scopeVar) {
                        // TODO: multiple loops may duplicate variable declarations
                        return ";var ".concat(scopeVar, " = ").concat(options.format === 'class' ? 'this.' : '', "getContext(el, \"").concat(scopeVar, "\");");
                    }), "\n            ").concat(generateSetElementAttributeCode(key, useValue, options), "\n            "));
                }
            }
        }
        if (jsx_1.selfClosingTags.has(json.name)) {
            return str + ' />';
        }
        str += '>';
        if (json.children) {
            str += json.children
                .map(function (item) { return blockToHtml(item, options, parentScopeVars); })
                .join('\n');
        }
        if (json.properties.innerHTML) {
            // Maybe put some kind of safety here for broken HTML such as no close tag
            str += htmlDecode(json.properties.innerHTML);
        }
        str += "</".concat(json.name, ">");
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
        var _b, _c, _d;
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
            }), ";\n        ").concat(componentHasProps ? "let props = {};" : '', "\n        let nodesToDestroy = [];\n\n        function destroyAnyNodes() {\n          // destroy current view template refs before rendering again\n          nodesToDestroy.forEach(el => el.remove());\n          nodesToDestroy = [];\n        }\n        ").concat(!hasChangeListeners
                ? ''
                : "\n        \n        // Function to update data bindings and loops\n        // call update() when you mutate state and need the updates to reflect\n        // in the dom\n        function update() {\n          ".concat(Object.keys(useOptions.onChangeJsById)
                    .map(function (key) {
                    var value = useOptions.onChangeJsById[key];
                    if (!value) {
                        return '';
                    }
                    return "\n              document.querySelectorAll(\"[data-name='".concat(key, "']\").forEach((el, index) => {\n                ").concat(value, "\n              })\n            ");
                })
                    .join('\n\n'), "\n\n            destroyAnyNodes();\n\n            ").concat(!((_c = json.hooks.onUpdate) === null || _c === void 0 ? void 0 : _c.length)
                    ? ''
                    : "\n                  ".concat(json.hooks.onUpdate.map(function (hook) {
                        return updateReferencesInCode(hook.code, useOptions);
                    }), " \n                  "), "\n        }\n\n        ").concat(useOptions.js, "\n\n        // Update with initial state on first load\n        update();\n        "), "\n\n        ").concat(!((_d = json.hooks.onMount) === null || _d === void 0 ? void 0 : _d.code)
                ? ''
                : // TODO: make prettier by grabbing only the function body
                    "\n              // onMount\n              ".concat(updateReferencesInCode(addUpdateAfterSetInCode(json.hooks.onMount.code, useOptions), useOptions), " \n              "), "\n        ").concat(!hasShow
                ? ''
                : "\n          function showContent(el) {\n            // https://developer.mozilla.org/en-US/docs/Web/API/HTMLTemplateElement/content\n            // grabs the content of a node that is between <template> tags\n            // iterates through child nodes to register all content including text elements\n            // attaches the content after the template\n  \n  \n            const elementFragment = el.content.cloneNode(true);\n            const children = Array.from(elementFragment.childNodes)\n            children.forEach(child => {\n              ".concat(options.format === 'class' ? 'this.' : '', "nodesToDestroy.push(child);\n            });\n            el.after(elementFragment);\n          }\n  \n        "), "\n        ").concat(!hasLoop
                ? ''
                : "\n          // Helper to render loops\n          function renderLoop(el, array, template, itemName, itemIndex, collectionName) {\n            el.innerHTML = \"\";\n            for (let [index, value] of array.entries()) {\n              let tmp = document.createElement(\"span\");\n              tmp.innerHTML = template.innerHTML;\n              Array.from(tmp.children).forEach((child) => {\n                if (itemName !== undefined) {\n                  child['__' + itemName] = value;\n                }\n                if (itemIndex !== undefined) {\n                  child['__' + itemIndex] = index;\n                }\n                if (collectionName !== undefined) {\n                  child['__' + collectionName] = array;\n                }\n                el.appendChild(child);\n              });\n            }\n          }\n\n          function getContext(el, name) {\n            do {\n              let value = el['__' + name]\n              if (value !== undefined) {\n                return value\n              }\n            } while ((el = el.parentNode));\n          }\n        ", "\n      })()\n      </script>\n    ");
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
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
        var component = _a.component;
        var useOptions = __assign(__assign({}, options), { onChangeJsById: {}, js: '', namesMap: {}, format: 'class' });
        var json = (0, fast_clone_1.fastClone)(component);
        if (options.plugins) {
            json = (0, plugins_1.runPreJsonPlugins)(json, options.plugins);
        }
        var componentHasProps = (0, has_props_1.hasProps)(json);
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
            .map(function (item) { return blockToHtml(item, useOptions); })
            .join('\n');
        if ((_d = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _d === void 0 ? void 0 : _d.childrenHtml) {
            html = (_e = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _e === void 0 ? void 0 : _e.childrenHtml(html, json, useOptions);
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
        var kebabName = component.name
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .toLowerCase();
        var str = "\n      ".concat((0, render_imports_1.renderPreComponent)(json), "\n      /**\n       * Usage:\n       * \n       *  <").concat(kebabName, "></").concat(kebabName, ">\n       * \n       */\n      class ").concat(component.name, " extends ").concat(((_h = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _h === void 0 ? void 0 : _h.classExtends)
            ? (_j = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _j === void 0 ? void 0 : _j.classExtends(json, useOptions)
            : 'HTMLElement', " {\n        constructor() {\n          super();\n          const self = this;\n          this.state = ").concat((0, get_state_object_string_1.getStateObjectStringFromComponent)(json, {
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
            : '', "\n\n\n          // used to keep track of all nodes created by show/for\n          this.nodesToDestroy = [];\n          ").concat(((_k = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _k === void 0 ? void 0 : _k.componentConstructor)
            ? (_l = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _l === void 0 ? void 0 : _l.componentConstructor(json, useOptions)
            : '', "\n\n          ").concat(useOptions.js, "\n\n          if (").concat((_m = json.meta.useMetadata) === null || _m === void 0 ? void 0 : _m.isAttachedToShadowDom, ") {\n            this.attachShadow({ mode: 'open' })\n          }\n        }\n\n\n        ").concat(!((_o = json.hooks.onUnMount) === null || _o === void 0 ? void 0 : _o.code)
            ? ''
            : "\n          disconnectedCallback() {\n            // onUnMount\n            ".concat(updateReferencesInCode(addUpdateAfterSetInCode(json.hooks.onUnMount.code, useOptions), useOptions), "\n            this.destroyAnyNodes(); // clean up nodes when component is destroyed\n          }\n          "), "\n\n        destroyAnyNodes() {\n          // destroy current view template refs before rendering again\n          this.nodesToDestroy.forEach(el => el.remove());\n          this.nodesToDestroy = [];\n        }\n\n        get _root() {\n          return this.shadowRoot || this;\n        }\n\n        connectedCallback() {\n          this._root.innerHTML = `\n      ").concat(html, "`;\n          this.onMount();\n          ").concat(((_p = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _p === void 0 ? void 0 : _p.connectedCallbackUpdate)
            ? (_q = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _q === void 0 ? void 0 : _q.connectedCallbackUpdate(json, useOptions)
            : 'this.update();', "\n        }\n\n\n        ").concat(!hasShow
            ? ''
            : "\n          showContent(el) {\n            // https://developer.mozilla.org/en-US/docs/Web/API/HTMLTemplateElement/content\n            // grabs the content of a node that is between <template> tags\n            // iterates through child nodes to register all content including text elements\n            // attaches the content after the template\n  \n  \n            const elementFragment = el.content.cloneNode(true);\n            const children = Array.from(elementFragment.childNodes)\n            children.forEach(child => {\n              this.nodesToDestroy.push(child);\n            });\n            el.after(elementFragment);\n          }", "\n\n        onMount() {\n          ").concat(!((_r = json.hooks.onMount) === null || _r === void 0 ? void 0 : _r.code)
            ? ''
            : // TODO: make prettier by grabbing only the function body
                "\n                // onMount\n                ".concat(updateReferencesInCode(addUpdateAfterSetInCode(json.hooks.onMount.code, useOptions), useOptions), "\n                "), "\n        }\n\n        onUpdate() {\n          ").concat(!((_s = json.hooks.onUpdate) === null || _s === void 0 ? void 0 : _s.length)
            ? ''
            : "\n      ".concat(json.hooks.onUpdate.map(function (hook) {
                return updateReferencesInCode(hook.code, useOptions);
            }), " \n      "), " \n        }\n\n        update() {\n          this.onUpdate();\n          // re-rendering needs to ensure that all nodes generated by for/show are refreshed\n          this.destroyAnyNodes();\n          ").concat(((_t = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _t === void 0 ? void 0 : _t.updateBindings)
            ? (_u = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _u === void 0 ? void 0 : _u.updateBindings(json, useOptions)
            : 'this.updateBindings();', "\n        }\n\n        updateBindings() {\n                    ").concat(Object.keys(useOptions.onChangeJsById)
            .map(function (key) {
            var _a, _b, _c, _d, _e;
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
            return "\n              this._root.querySelectorAll(\"[data-name='".concat(key, "']\").forEach((el, index) => {\n                ").concat(code, "\n              })\n            ");
        })
            .join('\n\n'), "\n        }\n\n        ").concat(!hasLoop
            ? ''
            : "\n\n          // Helper to render loops\n          renderLoop(el, array, template, itemName, itemIndex, collectionName) {\n            el.innerHTML = \"\";\n            for (let [index, value] of array.entries()) {\n              let tmp = document.createElement(\"span\");\n              tmp.innerHTML = template.innerHTML;\n              Array.from(tmp.children).forEach((child) => {\n                if (itemName !== undefined) {\n                  child['__' + itemName] = value;\n                }\n                if (itemIndex !== undefined) {\n                  child['__' + itemIndex] = index;\n                }\n                if (collectionName !== undefined) {\n                  child['__' + collectionName] = array;\n                }\n                el.appendChild(child);\n              });\n            }\n          }\n        \n          getContext(el, name) {\n            do {\n              let value = el['__' + name]\n              if (value !== undefined) {\n                return value\n              }\n            } while ((el = el.parentNode));\n          }\n        ", "\n      }\n\n      ").concat(((_v = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _v === void 0 ? void 0 : _v.customElementsDefine)
            ? (_w = useOptions === null || useOptions === void 0 ? void 0 : useOptions.experimental) === null || _w === void 0 ? void 0 : _w.customElementsDefine(kebabName, component, useOptions)
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
