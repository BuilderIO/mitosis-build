"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentToTaro = exports.TagMap = exports.collectTaroStyles = exports.DEFAULT_Component_SET = void 0;
var json5_1 = __importDefault(require("json5"));
var lodash_1 = require("lodash");
var traverse_1 = __importDefault(require("traverse"));
var bindings_1 = require("../helpers/bindings");
var fast_clone_1 = require("../helpers/fast-clone");
var is_mitosis_node_1 = require("../helpers/is-mitosis-node");
var merge_options_1 = require("../helpers/merge-options");
var react_1 = require("./react");
// @tarojs/components
exports.DEFAULT_Component_SET = new Set([
    'View',
    'Icon',
    'Progress',
    'RichText',
    'Text',
    'Button',
    'Checkbox',
    'CheckboxGroup',
    'Form',
    'Input',
    'Label',
    'Picker',
    'PickerView',
    'PickerViewColumn',
    'Radio',
    'RadioGroup',
    'Slider',
    'Switch',
    'CoverImage',
    'Textarea',
    'CoverView',
    'MovableArea',
    'MovableView',
    'ScrollView',
    'Swiper',
    'SwiperItem',
    'Navigator',
    'Audio',
    'Camera',
    'Image',
    'LivePlayer',
    'Video',
    'Canvas',
    'Ad',
    'WebView',
    'Block',
    'Map',
    'Slot',
    'SlotView',
    'Editor',
    'MatchMedia',
    'FunctionalPageNavigator',
    'LivePusher',
    'OfficialAccount',
    'OpenData',
    'NavigationBar',
    'PageMeta',
    'VoipRoom',
    'AdCustom',
]);
// TODO: px to 2 px
var collectTaroStyles = function (json) {
    var styleMap = {};
    var componentIndexes = {};
    (0, traverse_1.default)(json).forEach(function (item) {
        var _a;
        if (!(0, is_mitosis_node_1.isMitosisNode)(item) || typeof ((_a = item.bindings.css) === null || _a === void 0 ? void 0 : _a.code) !== 'string') {
            return;
        }
        var value = json5_1.default.parse(item.bindings.css.code);
        delete item.bindings.css;
        if (!(0, lodash_1.size)(value)) {
            return;
        }
        for (var key in value) {
            var propertyValue = value[key];
            // convert px to 2 * px, PX to PX
            if (typeof propertyValue === 'string' && propertyValue.match(/^\d/)) {
                var newValue = parseFloat(propertyValue);
                if (!isNaN(newValue)) {
                    if (propertyValue.endsWith('px')) {
                        newValue = 2 * newValue;
                        value[key] = "".concat(newValue, "px");
                    }
                    else {
                        value[key] = newValue;
                    }
                }
            }
        }
        var componentName = (0, lodash_1.camelCase)(item.name || 'view');
        var index = (componentIndexes[componentName] = (componentIndexes[componentName] || 0) + 1);
        var className = "".concat(componentName).concat(index);
        item.bindings.style = (0, bindings_1.createSingleBinding)({ code: "styles.".concat(className) });
        styleMap[className] = value;
    });
    return styleMap;
};
exports.collectTaroStyles = collectTaroStyles;
exports.TagMap = {
    span: 'Text',
    button: 'Button',
    input: 'Input',
    img: 'Image',
    form: 'Form',
    textarea: 'Textarea',
};
/**
 * Plugin that handles necessary transformations from React to React Native:
 * - Converts DOM tags to @tarojs/components
 * - Removes redundant `class`/`className` attributes
 */
var PROCESS_TARO_PLUGIN = function () { return ({
    json: {
        pre: function (json) {
            var TaroComponentsImports = { path: '@tarojs/components', imports: {} };
            json.imports.push(TaroComponentsImports);
            (0, traverse_1.default)(json).forEach(function (node) {
                var _a, _b, _c, _d;
                if ((0, is_mitosis_node_1.isMitosisNode)(node)) {
                    // TODO: More dom tags convert to  @tarojs/components
                    if (!!exports.TagMap[node.name]) {
                        TaroComponentsImports.imports[exports.TagMap[node.name]] = exports.TagMap[node.name];
                        node.name = exports.TagMap[node.name];
                    }
                    else if (node.name.toLowerCase() === node.name) {
                        TaroComponentsImports.imports.View = 'View';
                        node.name = 'View';
                    }
                    if (((_a = node.properties._text) === null || _a === void 0 ? void 0 : _a.trim().length) || ((_d = (_c = (_b = node.bindings._text) === null || _b === void 0 ? void 0 : _b.code) === null || _c === void 0 ? void 0 : _c.trim()) === null || _d === void 0 ? void 0 : _d.length)) {
                        TaroComponentsImports.imports.Text = 'Text';
                        node.name = 'Text';
                    }
                    if (node.properties.class) {
                        delete node.properties.class;
                    }
                    if (node.properties.className) {
                        delete node.properties.className;
                    }
                    if (node.bindings.class) {
                        delete node.bindings.class;
                    }
                    if (node.bindings.className) {
                        delete node.bindings.className;
                    }
                }
            });
        },
    },
}); };
var DEFAULT_OPTIONS = {
    stateType: 'useState',
    plugins: [PROCESS_TARO_PLUGIN],
};
var componentToTaro = function (_options) {
    if (_options === void 0) { _options = {}; }
    return function (_a) {
        var component = _a.component, path = _a.path;
        var json = (0, fast_clone_1.fastClone)(component);
        var options = (0, merge_options_1.mergeOptions)(DEFAULT_OPTIONS, _options, {
            type: 'taro',
        });
        return (0, react_1.componentToReact)(options)({ component: json, path: path });
    };
};
exports.componentToTaro = componentToTaro;
