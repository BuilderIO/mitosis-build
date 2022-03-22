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
var replace_idenifiers_1 = require("../helpers/replace-idenifiers");
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
var generateSetElementAttributeCode = function (key, useValue) {
    return needsSetAttribute(key)
        ? ";el.setAttribute(\"".concat(key, "\", ").concat(useValue, ");")
        : ";el.".concat(updateKeyIfException(key), " = ").concat(useValue);
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
var getForNames = function (json) {
    var names = [];
    (0, traverse_1.default)(json).forEach(function (item) {
        if ((0, is_mitosis_node_1.isMitosisNode)(item)) {
            if (item.name === 'For') {
                names.push(item.properties._forName);
            }
        }
    });
    return names;
};
var replaceForNameIdentifiers = function (json, options) {
    // TODO: cache this. by reference? lru?
    var forNames = getForNames(json);
    (0, traverse_1.default)(json).forEach(function (item) {
        if ((0, is_mitosis_node_1.isMitosisNode)(item)) {
            for (var key in item.bindings) {
                if (key === 'css' || key === '_forName') {
                    continue;
                }
                var value = item.bindings[key];
                if (typeof value === 'string') {
                    item.bindings[key] = (0, replace_idenifiers_1.replaceIdentifiers)(value, forNames, function (name) {
                        return "".concat(options.format === 'class' ? 'this.' : '', "getContext(el, \"").concat(name, "\")");
                    });
                }
            }
        }
    });
};
var mappers = {
    Fragment: function (json, options) {
        return json.children.map(function (item) { return blockToHtml(item, options); }).join('\n');
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
var blockToHtml = function (json, options) {
    var hasData = Object.keys(json.bindings).length;
    var elId = '';
    if (hasData) {
        elId = getId(json, options);
        json.properties['data-name'] = elId;
    }
    if (mappers[json.name]) {
        return mappers[json.name](json, options);
    }
    if ((0, is_children_1.default)(json)) {
        return "<slot></slot>";
    }
    if (json.properties._text) {
        return json.properties._text;
    }
    if (json.bindings._text) {
        addOnChangeJs(elId, options, "el.innerText = ".concat(json.bindings._text, ";"));
        return "<span data-name=\"".concat(elId, "\"><!-- ").concat(json.bindings._text.replace(/getContext\(el, "([^"]+)"\)/g, '$1'), " --></span>");
    }
    var str = '';
    if (json.name === 'For') {
        var itemName = json.properties._forName;
        addOnChangeJs(elId, options, 
        // TODO: be smarter about rendering, deleting old items and adding new ones by
        // querying dom potentially
        "\n        let array = ".concat(json.bindings.each, ";\n        let template = ").concat(options.format === 'class' ? 'this' : 'document', ".querySelector('[data-template-for=\"").concat(elId, "\"]');\n        ").concat(options.format === 'class' ? 'this.' : '', "renderLoop(el, array, template, \"").concat(itemName, "\");\n      "));
        // TODO: decide on how to handle this...
        str += "\n      <span data-name=\"".concat(elId, "\"></span>\n      <template data-template-for=\"").concat(elId, "\">");
        if (json.children) {
            str += json.children.map(function (item) { return blockToHtml(item, options); }).join('\n');
        }
        str += '</template>';
    }
    else if (json.name === 'Show') {
        addOnChangeJs(elId, options, "el.style.display = ".concat(json.bindings.when.replace(/;$/, ''), " ? 'inline' : 'none'"));
        str += "<span data-name=\"".concat(elId, "\">");
        if (json.children) {
            str += json.children.map(function (item) { return blockToHtml(item, options); }).join('\n');
        }
        str += '</span>';
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
                options.js += "\n          // Event handler for '".concat(event_1, "' event on ").concat(elId, "\n          ").concat(options.format === 'class'
                    ? "this.".concat(fnName, " = (event) => {")
                    : "function ".concat(fnName, " (event) {"), "\n            ").concat((0, remove_surrounding_block_1.removeSurroundingBlock)(updateReferencesInCode(useValue, options)), "\n          }\n        ");
                var fnIdentifier = "".concat(options.format === 'class' ? 'this.' : '').concat(fnName);
                addOnChangeJs(elId, options, "\n            ;el.removeEventListener('".concat(event_1, "', ").concat(fnIdentifier, ");\n            ;el.addEventListener('").concat(event_1, "', ").concat(fnIdentifier, ");\n          "));
            }
            else {
                if (key === 'style') {
                    addOnChangeJs(elId, options, ";Object.assign(el.style, ".concat(useValue, ");"));
                }
                else {
                    addOnChangeJs(elId, options, generateSetElementAttributeCode(key, useValue));
                }
            }
        }
        if (jsx_1.selfClosingTags.has(json.name)) {
            return str + ' />';
        }
        str += '>';
        if (json.children) {
            str += json.children.map(function (item) { return blockToHtml(item, options); }).join('\n');
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
        replaceForNameIdentifiers(json, useOptions);
        addUpdateAfterSet(json, useOptions);
        var componentHasProps = (0, has_props_1.hasProps)(json);
        var hasLoop = (0, has_component_1.hasComponent)('For', json);
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
            }), ";\n        ").concat(componentHasProps ? "let props = {};" : '', "\n\n        ").concat(!hasChangeListeners
                ? ''
                : "\n        \n        // Function to update data bindings and loops\n        // call update() when you mutate state and need the updates to reflect\n        // in the dom\n        function update() {\n          ".concat(Object.keys(useOptions.onChangeJsById)
                    .map(function (key) {
                    var value = useOptions.onChangeJsById[key];
                    if (!value) {
                        return '';
                    }
                    return "\n              document.querySelectorAll(\"[data-name='".concat(key, "']\").forEach((el) => {\n                ").concat(value, "\n              })\n            ");
                })
                    .join('\n\n'), "\n\n            ").concat(!((_c = json.hooks.onUpdate) === null || _c === void 0 ? void 0 : _c.code)
                    ? ''
                    : "\n                  ".concat(updateReferencesInCode(json.hooks.onUpdate.code, useOptions), " \n                  "), "\n        }\n\n        ").concat(useOptions.js, "\n\n        // Update with initial state on first load\n        update();\n        "), "\n\n        ").concat(!((_d = json.hooks.onMount) === null || _d === void 0 ? void 0 : _d.code)
                ? ''
                : // TODO: make prettier by grabbing only the function body
                    "\n              // onMount\n              ".concat(updateReferencesInCode(addUpdateAfterSetInCode(json.hooks.onMount.code, useOptions), useOptions), " \n              "), "\n\n        ").concat(!hasLoop
                ? ''
                : "\n\n          // Helper to render loops\n          function renderLoop(el, array, template, itemName) {\n            el.innerHTML = '';\n            for (let value of array) {\n              let tmp = document.createElement('span');\n              tmp.innerHTML = template.innerHTML;\n              Array.from(tmp.children).forEach(function (child) {\n                contextMap.set(child, {\n                  ...contextMap.get(child),\n                  [itemName]: value\n                });\n                el.appendChild(child);\n              });\n            }\n          }\n\n          // Helper to pass context down for loops\n          let contextMap = new WeakMap();\n          function getContext(el, name) {\n            let parent = el;\n            do {\n              let context = contextMap.get(parent);\n              if (context && name in context) {\n                return context[name];\n              }\n            } while (parent = parent.parentNode)\n          }\n        ", "\n      })()\n      </script>\n    ");
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
        var _b, _c, _d;
        var component = _a.component;
        var useOptions = __assign(__assign({}, options), { onChangeJsById: {}, js: '', namesMap: {}, format: 'class' });
        var json = (0, fast_clone_1.fastClone)(component);
        if (options.plugins) {
            json = (0, plugins_1.runPreJsonPlugins)(json, options.plugins);
        }
        var componentHasProps = (0, has_props_1.hasProps)(json);
        replaceForNameIdentifiers(json, useOptions);
        addUpdateAfterSet(json, useOptions);
        var hasLoop = (0, has_component_1.hasComponent)('For', json);
        if (options.plugins) {
            json = (0, plugins_1.runPostJsonPlugins)(json, options.plugins);
        }
        var css = (0, collect_styles_1.collectCss)(json, {
            prefix: options.prefix,
        });
        (0, strip_meta_properties_1.stripMetaProperties)(json);
        var html = json.children
            .map(function (item) { return blockToHtml(item, useOptions); })
            .join('\n');
        html += "<style>".concat(css, "</style>");
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
        var str = "\n      ".concat((0, render_imports_1.renderPreComponent)(json), "\n      /**\n       * Usage:\n       * \n       *  <").concat(kebabName, "></").concat(kebabName, ">\n       * \n       */\n      class ").concat(component.name, " extends HTMLElement {\n        constructor() {\n          super();\n\n          const self = this;\n          this.state = ").concat((0, get_state_object_string_1.getStateObjectStringFromComponent)(json, {
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
            : '', "\n\n          ").concat(!hasLoop
            ? ''
            : "\n            // Helper to pass context down for loops\n            this.contextMap = new WeakMap();\n          ", "\n\n          ").concat(useOptions.js, "\n        }\n\n        ").concat(!((_b = json.hooks.onUnMount) === null || _b === void 0 ? void 0 : _b.code)
            ? ''
            : "\n          disconnectedCallback() {\n            // onUnMount\n            ".concat(updateReferencesInCode(addUpdateAfterSetInCode(json.hooks.onUnMount.code, useOptions), useOptions), "\n          }\n          "), "\n\n        connectedCallback() {\n          this.innerHTML = `\n      ").concat(html, "`;\n          this.update();\n\n          ").concat(!((_c = json.hooks.onMount) === null || _c === void 0 ? void 0 : _c.code)
            ? ''
            : // TODO: make prettier by grabbing only the function body
                "\n                // onMount\n                ".concat(updateReferencesInCode(addUpdateAfterSetInCode(json.hooks.onMount.code, useOptions), useOptions), "\n                "), "\n        }\n\n        update() {\n          ").concat(Object.keys(useOptions.onChangeJsById)
            .map(function (key) {
            var value = useOptions.onChangeJsById[key];
            if (!value) {
                return '';
            }
            return "\n              this.querySelectorAll(\"[data-name='".concat(key, "']\").forEach((el) => {\n                ").concat(updateReferencesInCode(value, useOptions), "\n              })\n            ");
        })
            .join('\n\n'), "\n\n            ").concat(!((_d = json.hooks.onUpdate) === null || _d === void 0 ? void 0 : _d.code)
            ? ''
            : "\n                  ".concat(updateReferencesInCode(json.hooks.onUpdate.code, useOptions), " \n                  "), " \n        }\n\n        ").concat(!hasLoop
            ? ''
            : "\n\n          // Helper to render loops\n          renderLoop(el, array, template, itemName) {\n            el.innerHTML = '';\n            for (let value of array) {\n              let tmp = document.createElement('span');\n              tmp.innerHTML = template.innerHTML;\n              Array.from(tmp.children).forEach((child) => {\n                this.contextMap.set(child, {\n                  ...this.contextMap.get(child),\n                  [itemName]: value\n                });\n                el.appendChild(child);\n              });\n            }\n          }\n\n          getContext(el, name) {\n            let parent = el;\n            do {\n              let context = this.contextMap.get(parent);\n              if (context && name in context) {\n                return context[name];\n              }\n            } while (parent = parent.parentNode)\n          }\n        ", "\n      }\n\n      customElements.define('").concat(kebabName, "', ").concat(component.name, ");\n    ");
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
