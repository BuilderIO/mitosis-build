"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentToAngular = exports.blockToAngular = void 0;
var dedent_1 = __importDefault(require("dedent"));
var standalone_1 = require("prettier/standalone");
var collect_styles_1 = require("../helpers/collect-styles");
var fast_clone_1 = require("../helpers/fast-clone");
var get_refs_1 = require("../helpers/get-refs");
var get_state_object_string_1 = require("../helpers/get-state-object-string");
var map_refs_1 = require("../helpers/map-refs");
var render_imports_1 = require("../helpers/render-imports");
var strip_state_and_props_refs_1 = require("../helpers/strip-state-and-props-refs");
var jsx_1 = require("../parsers/jsx");
var plugins_1 = require("../modules/plugins");
var is_children_1 = __importDefault(require("../helpers/is-children"));
var get_props_1 = require("../helpers/get-props");
var lodash_1 = require("lodash");
var strip_meta_properties_1 = require("../helpers/strip-meta-properties");
var remove_surrounding_block_1 = require("../helpers/remove-surrounding-block");
var indent_1 = require("../helpers/indent");
var mappers = {
    Fragment: function (json, options) {
        return "<div>".concat(json.children
            .map(function (item) { return (0, exports.blockToAngular)(item, options); })
            .join('\n'), "</div>");
    },
};
var blockToAngular = function (json, options) {
    if (options === void 0) { options = {}; }
    if (mappers[json.name]) {
        return mappers[json.name](json, options);
    }
    if ((0, is_children_1.default)(json)) {
        return "<ng-slot></ng-slot>";
    }
    if (json.properties._text) {
        return json.properties._text;
    }
    if (json.bindings._text) {
        return "{{".concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(json.bindings._text), "}}");
    }
    var str = '';
    if (json.name === 'For') {
        str += "<ng-container *ngFor=\"let ".concat(json.properties._forName, " of ").concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(json.bindings.each), "\">");
        str += json.children
            .map(function (item) { return (0, exports.blockToAngular)(item, options); })
            .join('\n');
        str += "</ng-container>";
    }
    else if (json.name === 'Show') {
        str += "<ng-container *ngIf=\"".concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(json.bindings.when), "\">");
        str += json.children
            .map(function (item) { return (0, exports.blockToAngular)(item, options); })
            .join('\n');
        str += "</ng-container>";
    }
    else {
        str += "<".concat(json.name, " ");
        // TODO: spread support for angular
        // if (json.bindings._spread) {
        //   str += `v-bind="${stripStateAndPropsRefs(
        //     json.bindings._spread as string,
        //   )}"`;
        // }
        for (var key in json.properties) {
            if (key.startsWith('$')) {
                continue;
            }
            var value = json.properties[key];
            str += " ".concat(key, "=\"").concat(value, "\" ");
        }
        for (var key in json.bindings) {
            if (key === '_spread') {
                continue;
            }
            if (key.startsWith('$')) {
                continue;
            }
            var value = json.bindings[key];
            // TODO: proper babel transform to replace. Util for this
            var useValue = (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(value);
            if (key.startsWith('on')) {
                var event_1 = key.replace('on', '').toLowerCase();
                if (event_1 === 'change' &&
                    json.name === 'input' /* todo: other tags */) {
                    event_1 = 'input';
                }
                // TODO: proper babel transform to replace. Util for this
                var finalValue = (0, remove_surrounding_block_1.removeSurroundingBlock)(useValue.replace(/event\./g, '$event.'));
                str += " (".concat(event_1, ")=\"").concat(finalValue, "\" ");
            }
            else if (key === 'ref') {
                str += " #".concat(useValue, " ");
            }
            else {
                str += " [".concat(key, "]=\"").concat(useValue, "\" ");
            }
        }
        if (jsx_1.selfClosingTags.has(json.name)) {
            return str + ' />';
        }
        str += '>';
        if (json.children) {
            str += json.children
                .map(function (item) { return (0, exports.blockToAngular)(item, options); })
                .join('\n');
        }
        str += "</".concat(json.name, ">");
    }
    return str;
};
exports.blockToAngular = blockToAngular;
var componentToAngular = function (options) {
    if (options === void 0) { options = {}; }
    return function (_a) {
        var component = _a.component;
        // Make a copy we can safely mutate, similar to babel's toolchain
        var json = (0, fast_clone_1.fastClone)(component);
        if (options.plugins) {
            json = (0, plugins_1.runPreJsonPlugins)(json, options.plugins);
        }
        var props = (0, get_props_1.getProps)(component);
        var refs = Array.from((0, get_refs_1.getRefs)(json));
        (0, map_refs_1.mapRefs)(json, function (refName) { return "this.".concat(refName, ".nativeElement"); });
        if (options.plugins) {
            json = (0, plugins_1.runPostJsonPlugins)(json, options.plugins);
        }
        var css = (0, collect_styles_1.collectCss)(json);
        if (options.prettier !== false) {
            css = tryFormat(css, 'css');
        }
        var template = json.children.map(function (item) { return (0, exports.blockToAngular)(item); }).join('\n');
        if (options.prettier !== false) {
            template = tryFormat(template, 'html');
        }
        (0, strip_meta_properties_1.stripMetaProperties)(json);
        var dataString = (0, get_state_object_string_1.getStateObjectStringFromComponent)(json, {
            format: 'class',
            valueMapper: function (code) {
                return (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(code, { replaceWith: 'this.' });
            },
        });
        var str = (0, dedent_1.default)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    import { Component ", "", " } from '@angular/core';\n    ", "\n\n    @Component({\n      selector: '", "',\n      template: `\n        ", "\n      `,\n      ", "\n    })\n    export default class ", " {\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n    }\n  "], ["\n    import { Component ", "", " } from '@angular/core';\n    ", "\n\n    @Component({\n      selector: '", "',\n      template: \\`\n        ", "\n      \\`,\n      ", "\n    })\n    export default class ", " {\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n    }\n  "])), refs.length ? ', ViewChild, ElementRef' : '', props.size ? ', Input' : '', (0, render_imports_1.renderPreComponent)(json), (0, lodash_1.kebabCase)(json.name || 'my-component'), (0, indent_1.indent)(template, 8).replace(/`/g, '\\`').replace(/\$\{/g, '\\${'), css.length
            ? "styles: [\n        `".concat((0, indent_1.indent)(css, 8), "`\n      ],")
            : '', component.name, Array.from(props)
            .map(function (item) { return "@Input() ".concat(item, ": any"); })
            .join('\n'), refs
            .map(function (refName) { return "@ViewChild('".concat(refName, "') ").concat(refName, ": ElementRef"); })
            .join('\n'), !component.hooks.onMount
            ? ''
            : "ngOnInit() {\n              ".concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(component.hooks.onMount.code, {
                replaceWith: 'this.',
            }), "\n            }"), !component.hooks.onUpdate
            ? ''
            : "ngAfterContentChecked() {\n              ".concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(component.hooks.onUpdate.code, {
                replaceWith: 'this.',
            }), "\n            }"), !component.hooks.onUnMount
            ? ''
            : "ngOnDestroy() {\n              ".concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(component.hooks.onUnMount.code, {
                replaceWith: 'this.',
            }), "\n            }"), dataString);
        if (options.plugins) {
            str = (0, plugins_1.runPreCodePlugins)(str, options.plugins);
        }
        if (options.prettier !== false) {
            str = tryFormat(str, 'typescript');
        }
        if (options.plugins) {
            str = (0, plugins_1.runPostCodePlugins)(str, options.plugins);
        }
        return str;
    };
};
exports.componentToAngular = componentToAngular;
var tryFormat = function (str, parser) {
    try {
        return (0, standalone_1.format)(str, {
            parser: parser,
            plugins: [
                // To support running in browsers
                require('prettier/parser-typescript'),
                require('prettier/parser-postcss'),
                require('prettier/parser-html'),
                require('prettier/parser-babel'),
            ],
            htmlWhitespaceSensitivity: 'ignore',
        });
    }
    catch (err) {
        console.warn('Could not prettify', { string: str }, err);
    }
    return str;
};
var templateObject_1;
