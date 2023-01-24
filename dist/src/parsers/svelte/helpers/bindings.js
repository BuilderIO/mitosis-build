"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processBindings = void 0;
var bindings_1 = require("../../../helpers/bindings");
function replaceGroupWithChecked(node, isArray) {
    var _a, _b, _c;
    if (isArray === void 0) { isArray = false; }
    if ((_b = (_a = node.bindings.group) === null || _a === void 0 ? void 0 : _a.code) === null || _b === void 0 ? void 0 : _b.length) {
        var bindingValue = (_c = node.bindings.value) === null || _c === void 0 ? void 0 : _c.code;
        var propertyValue = node.properties.value;
        var groupBinding = node.bindings.group.code;
        var code = '';
        if (isArray) {
            code = bindingValue
                ? "".concat(groupBinding, ".includes(").concat(bindingValue, ")")
                : "".concat(groupBinding, ".includes('").concat(propertyValue, "')");
        }
        else {
            code = bindingValue
                ? "".concat(groupBinding, " === ").concat(bindingValue)
                : "".concat(groupBinding, " === '").concat(propertyValue, "'");
        }
        node.bindings['checked'] = (0, bindings_1.createSingleBinding)({
            code: code,
        });
        delete node.bindings.group;
    }
}
/* post-processes bindings
  bind:group https://svelte.dev/docs#template-syntax-element-directives-bind-group
  bind:property https://svelte.dev/docs#template-syntax-component-directives-bind-this
  bind:this https://svelte.dev/docs#template-syntax-component-directives-bind-this

  - replaces group binding with checked for checkboxes and radios (supported inputs for bind:group)
  - adds onChange for bind:group and bind:property (event.target.value OR event.target.checked)
*/
function processBindings(json, node) {
    var _a, _b, _c, _d, _e, _f, _g;
    var name;
    var target = 'event.target.value';
    var binding = '';
    var isArray = false;
    if (Object.prototype.hasOwnProperty.call(node.bindings, 'group')) {
        name = 'group';
        binding = (_b = (_a = node.bindings.group) === null || _a === void 0 ? void 0 : _a.code) !== null && _b !== void 0 ? _b : '';
        if (binding.startsWith('state.')) {
            var stateObject = json.state[binding.replace(/^state\./, '')];
            isArray = Array.isArray(stateObject === null || stateObject === void 0 ? void 0 : stateObject.code);
        }
        replaceGroupWithChecked(node, isArray);
        if (node.properties.type === 'checkbox' && !node.properties.value) {
            target = 'event.target.checked';
        }
    }
    else if (Object.prototype.hasOwnProperty.call(node.bindings, 'this')) {
        name = 'ref';
        binding = (_d = (_c = node.bindings.this) === null || _c === void 0 ? void 0 : _c.code) !== null && _d !== void 0 ? _d : '';
    }
    else if (Object.prototype.hasOwnProperty.call(node.bindings, 'onChange') &&
        node.properties.type === 'checkbox') {
        target = 'event.target.checked';
        binding = (_f = (_e = node.bindings.onChange) === null || _e === void 0 ? void 0 : _e.code.split('=')[0]) !== null && _f !== void 0 ? _f : '';
    }
    var onChangeCode = "".concat(binding, " = ").concat(target);
    // If the binding is an array, we should push / splice rather than assigning
    if (isArray) {
        onChangeCode = "event.target.checked ? ".concat(binding, ".push(").concat(target, ") : ").concat(binding, ".splice(").concat(binding, ".indexOf(").concat(node.properties.value ? "'".concat(node.properties.value, "'") : (_g = node.bindings.value) === null || _g === void 0 ? void 0 : _g.code, "), 1)");
    }
    if (name !== 'ref' && binding) {
        node.bindings['onChange'] = (0, bindings_1.createSingleBinding)({
            code: onChangeCode,
            arguments: ['event'],
        });
    }
}
exports.processBindings = processBindings;
