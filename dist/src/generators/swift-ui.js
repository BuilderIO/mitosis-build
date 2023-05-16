"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentToSwift = void 0;
var traverse_1 = __importDefault(require("traverse"));
var dedent_1 = require("../helpers/dedent");
var fast_clone_1 = require("../helpers/fast-clone");
var filter_empty_text_nodes_1 = require("../helpers/filter-empty-text-nodes");
var generic_format_1 = require("../helpers/generic-format");
var get_state_object_string_1 = require("../helpers/get-state-object-string");
var get_styles_1 = require("../helpers/get-styles");
var is_children_1 = __importDefault(require("../helpers/is-children"));
var is_mitosis_node_1 = require("../helpers/is-mitosis-node");
var state_1 = require("../helpers/state");
var try_prettier_format_1 = require("../helpers/try-prettier-format");
var mitosis_node_1 = require("../types/mitosis-node");
var scrolls = function (json) {
    var _a;
    return ((_a = (0, get_styles_1.getStyles)(json)) === null || _a === void 0 ? void 0 : _a.overflow) === 'auto';
};
var mappers = {
    Fragment: function (json, options) {
        return "".concat(json.children.map(function (item) { return blockToSwift(item, options); }).join('\n'));
    },
    link: function () { return ''; },
    Image: function (json, options) {
        var _a;
        return ("Image(".concat(processBinding((_a = json.bindings.image) === null || _a === void 0 ? void 0 : _a.code, options) || "\"".concat(json.properties.image, "\""), ")") +
            getStyleString(json, options) +
            getActionsString(json, options));
    },
    input: function (json, options) {
        var _a, _b;
        var name = json.properties.$name;
        var str = "TextField(".concat(json.bindings.placeholder
            ? processBinding((_a = json.bindings.placeholder) === null || _a === void 0 ? void 0 : _a.code, options)
            : json.properties.placeholder
                ? JSON.stringify(json.bindings.placeholder.code)
                : '""', ", text: $").concat(name, ")") +
            getStyleString(json, options) +
            getActionsString(json, options);
        if (json.bindings.onChange) {
            str += "\n        .onChange(of: ".concat(name, ") { ").concat(name, " in \n          ").concat(processBinding(wrapAction("var event = { target: { value: \"\\(".concat(name, ")\" } };\n              ").concat((_b = json.bindings.onChange) === null || _b === void 0 ? void 0 : _b.code)), options), " \n        }");
        }
        return str;
    },
};
var blockToSwift = function (json, options) {
    var _a, _b;
    if (mappers[json.name]) {
        return mappers[json.name](json, options);
    }
    // TODO: Add support for `{props.children}` bindings
    // Right now we return an empty string because the generated code
    // is very likely wrong.
    if ((0, is_children_1.default)({ node: json })) {
        return '/* `props.children` is not supported yet for SwiftUI */';
    }
    if (json.properties._text) {
        if (!json.properties._text.trim().length) {
            return '';
        }
        return "Text(\"".concat(json.properties._text.trim().replace(/\s+/g, ' '), "\")");
    }
    if (json.bindings._text) {
        return "Text(".concat(processBinding(json.bindings._text.code, options), ".toString())");
    }
    var str = '';
    var children = json.children.filter(filter_empty_text_nodes_1.filterEmptyTextNodes);
    var style = (0, get_styles_1.getStyles)(json);
    // TODO: do as preprocess step and do more mappings of dom attributes to special
    // Image, TextField, etc component props
    var name = json.name === 'input'
        ? 'TextField'
        : json.name === 'img'
            ? 'Image'
            : json.name[0].toLowerCase() === json.name[0]
                ? scrolls(json)
                    ? 'ScrollView'
                    : (style === null || style === void 0 ? void 0 : style.display) === 'flex' && style.flexDirection !== 'column'
                        ? 'HStack'
                        : 'VStack'
                : json.name;
    if (name === 'TextField') {
        var placeholder = json.properties.placeholder;
        delete json.properties.placeholder;
        json.properties._ = placeholder || '';
    }
    if ((0, mitosis_node_1.checkIsForNode)(json)) {
        str += "ForEach(".concat(processBinding((_a = json.bindings.each) === null || _a === void 0 ? void 0 : _a.code, options), ", id: \\.self) { ").concat(json.scope.forName, " in ").concat(children
            .map(function (item) { return blockToSwift(item, options); })
            .join('\n'), " }");
    }
    else if (json.name === 'Show') {
        str += "if ".concat(processBinding((_b = json.bindings.when) === null || _b === void 0 ? void 0 : _b.code, options), " {\n      ").concat(children.map(function (item) { return blockToSwift(item, options); }).join('\n'), "\n    }");
    }
    else {
        str += "".concat(name, "(");
        for (var key in json.properties) {
            if (key === 'class' || key === 'className') {
                continue;
            }
            // TODO: binding mappings
            // const value = json.properties[key];
            // str += ` ${key}: "${(value as string).replace(/"/g, '&quot;')}", `;
            console.warn("Unsupported property \"".concat(key, "\""));
        }
        for (var key in json.bindings) {
            if (
            // TODO: implement spread, ref, more css
            key === '_spread' ||
                key === 'ref' ||
                key === 'css' ||
                key === 'class' ||
                key === 'className') {
                continue;
            }
            if (key.startsWith('on')) {
                if (key === 'onClick') {
                    continue;
                }
                else {
                    // TODO: other event mappings
                    console.warn("Unsupported event binding \"".concat(key, "\""));
                }
            }
            else {
                console.warn("Unsupported binding \"".concat(key, "\""));
                // TODO: need binding mappings
                // str += ` ${key}: ${processBinding(value, options)}, `;
            }
        }
        str += ")";
        str += " {";
        if (json.children) {
            str += json.children.map(function (item) { return blockToSwift(item, options); }).join('\n');
        }
        str += "}";
        str += getStyleString(json, options);
        str += getActionsString(json, options);
    }
    return str;
};
var wrapAction = function (str) { return "(() => { ".concat(str, " })()"); };
function getActionsString(json, options) {
    var str = '';
    if (json.bindings.onClick) {
        str += "\n.onTapGesture {\n      ".concat(processBinding(wrapAction(json.bindings.onClick.code), options), "\n    }");
    }
    return str;
}
function getStyleString(node, options) {
    var style = (0, get_styles_1.getStyles)(node);
    var str = '';
    for (var key in style) {
        var useKey = key;
        var rawValue = style[key];
        var value = "\"".concat(rawValue, "\"");
        if (['padding', 'margin'].includes(key)) {
            // TODO: throw error if calc()
            value = parseFloat(rawValue);
            str += "\n.".concat(useKey, "(").concat(value, ")");
        }
        else if (key === 'color') {
            useKey = 'foregroundColor';
            // TODO: convert to RBG and use Color(red: ..., ....)
        }
        else {
            console.warn("Styling key \"".concat(key, "\" is not supported"));
        }
    }
    return str;
}
function getJsSource(json, options) {
    var str = "const state = new Proxy(".concat((0, get_state_object_string_1.getStateObjectStringFromComponent)(json), ", {\n    set: (target, key, value) => {\n      const returnVal = Reflect.set(target, key, value);\n      update();\n      return returnVal;\n    }\n  });");
    if (options.prettier === false) {
        return str.trim();
    }
    else {
        return (0, try_prettier_format_1.tryPrettierFormat)(str, 'typescript').trim();
    }
}
var processBinding = function (str, options) {
    // Use triple quotes for multiline strings or strings including '"'
    if (str.includes('\n') || str.includes('"')) {
        return "eval(code: \"\"\"\n      ".concat(str, "\n      \"\"\")");
    }
    // Use double quotes for simple strings
    return "eval(code: \"".concat(str, "\")");
};
function componentHasDynamicData(json) {
    var hasState = (0, state_1.checkHasState)(json);
    if (hasState) {
        return true;
    }
    var found = false;
    (0, traverse_1.default)(json).forEach(function (node) {
        if ((0, is_mitosis_node_1.isMitosisNode)(node)) {
            if (Object.keys(node.bindings).filter(function (item) { return item !== 'css'; }).length) {
                found = true;
                this.stop();
            }
        }
    });
    return found;
}
function mapDataForSwiftCompatability(json) {
    var inputIndex = 0;
    json.meta.inputNames = json.meta.inputNames || [];
    (0, traverse_1.default)(json).forEach(function (node) {
        var _a;
        if ((0, is_mitosis_node_1.isMitosisNode)(node)) {
            if (node.name === 'input') {
                if (!Object.keys(node.bindings).filter(function (item) { return item !== 'css'; }).length) {
                    return;
                }
                if (!node.properties.$name) {
                    node.properties.$name = "input".concat(++inputIndex);
                }
                json.meta.inputNames[node.properties.$name] =
                    ((_a = node.bindings.value) === null || _a === void 0 ? void 0 : _a.code) || '';
            }
        }
    });
}
function getInputBindings(json, options) {
    var str = '';
    var inputNames = json.meta.inputNames;
    if (!inputNames) {
        return str;
    }
    for (var item in inputNames) {
        str += "\n@State private var ".concat(item, ": String = \"\"");
    }
    return str;
}
var componentToSwift = function (options) {
    if (options === void 0) { options = {}; }
    return function (_a) {
        var component = _a.component;
        var json = (0, fast_clone_1.fastClone)(component);
        mapDataForSwiftCompatability(json);
        var hasDyanmicData = componentHasDynamicData(json);
        var children = json.children.map(function (item) { return blockToSwift(item, options); }).join('\n');
        var hasInputNames = Object.keys(json.meta.inputNames || {}).length > 0;
        var str = (0, dedent_1.dedent)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    import SwiftUI\n    ", "\n\n    struct ", ": View {\n      ", "\n\n      var body: some View {\n        VStack {\n          ", "\n        }", "\n      }\n    }\n  "], ["\n    import SwiftUI\n    ", "\n\n    struct ", ": View {\n      ", "\n\n      var body: some View {\n        VStack {\n          ", "\n        }", "\n      }\n    }\n  "])), !hasDyanmicData
            ? ''
            : "import JavaScriptCore\n    \n    final class UpdateTracker: ObservableObject {\n        @Published var value = 0;\n    \n        func update() {\n            value += 1\n        }\n    }\n    ", component.name, !hasDyanmicData
            ? ''
            : "\n        @ObservedObject var updateTracker = UpdateTracker()\n        private var jsContext = JSContext()\n        ".concat(getInputBindings(json, options), "\n\n        func eval(code: String) -> JSValue! {\n          return jsContext?.evaluateScript(code)\n        }\n\n        ").concat(!hasInputNames
                ? ''
                : "\n        func setComputedState() {\n          ".concat(Object.keys(json.meta.inputNames || {})
                    .map(function (item) {
                    return "".concat(item, " = ").concat(processBinding(json.meta.inputNames[item], options), ".toString()!");
                })
                    .join('\n'), "\n        }"), "\n\n        init() {\n          let jsSource = \"\"\"\n              ").concat(getJsSource(json, options), "\n          \"\"\"\n          jsContext?.exceptionHandler = { context, exception in\n            print(\"JS Error: \\(exception!)\") \n          }\n\n          let updateRef = updateTracker.update\n          let updateFn : @convention(block) () -> Void = { updateRef() }\n          jsContext?.setObject(updateFn, forKeyedSubscript: \"update\" as NSString)\n\n          jsContext?.evaluateScript(jsSource)\n        }\n      ").trim(), children, !hasInputNames
            ? ''
            : "\n        .onAppear {\n          setComputedState()\n        }\n        ");
        if (options.prettier !== false) {
            str = (0, generic_format_1.format)(str);
        }
        return str;
    };
};
exports.componentToSwift = componentToSwift;
var templateObject_1;
